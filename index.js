'use strict'

const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')
const path = require('path')
const WebSocketServer = require('ws').Server
const client = path.join(__dirname, 'client')

function build (upring) {
  const assets = bankai()
  const css = assets.css()
  const js = assets.js(browserify, client)
  const html = assets.html()
  var _ready = false
  var isClient = false

  upring.on('up', function () {
    _ready = true
    try {
      upring.mymeta()
    } catch (err) {
      isClient = err && true
    }
  })

  const server = http.createServer((req, res) => {
    switch (req.url) {
      case '/': return html(req, res).pipe(res)
      case '/whoami': return ready(res) && whoami(req, res)
      case '/peers': return ready(res) && peers(req, res)
      case '/ring': return ready(res) && ring(req, res)
      case '/hash': return ready(res) && hash(req, res)
      case '/bundle.js': return js(req, res).pipe(res)
      case '/bundle.css': return css(req, res).pipe(res)
      default:
        res.statusCode = 404
        return res.end('404 not found')
    }
  })

  const wss = new WebSocketServer({ server: server })
  const connections = new Set()

  wss.on('connection', function connection (ws) {
    connections.add(ws)
    ws.on('close', function () {
      connections.delete(ws)
    })
    ws.send(JSON.stringify(computeRing()))
  })

  upring.on('peerUp', sendRing)
  upring.on('peerDown', sendRing)

  function sendRing () {
    const ring = computeRing()
    connections.forEach(function (conn) {
      conn.send(JSON.stringify(ring))
    })
  }

  return server

  function ready (res) {
    if (!_ready) {
      res.statusCode = 503
      res.end('ring not ready yet')
    }
    return _ready
  }

  function whoami (req, res) {
    const id = upring.whoami()
    res.end(id)
  }

  function peers (req, res) {
    const peers = upring.peers(!isClient)
    res.end(JSON.stringify(peers, null, 2))
  }

  function ring (req, res) {
    res.end(JSON.stringify(computeRing(), null, 2))
  }

  function hash (req, res) {
    if (req.method !== 'POST') {
      res.statusCode = 404
      res.end()
      return
    }
    var chunks = ''
    req.setEncoding('utf8')
    req.on('data', function (d) {
      chunks += d
    })
    req.on('end', function () {
      if (chunks.length === 0) {
        res.statusCode = 422
        res.end()
        return
      }
      res.end(JSON.stringify({
        point: upring._hashring.hash(chunks)
      }, null, 2))
    })
  }

  function computeRing () {
    const ring = upring._hashring._entries.map(function (entry) {
      return {
        id: entry.peer.id,
        point: entry.point
      }
    })

    return ring
  }
}

module.exports = build
