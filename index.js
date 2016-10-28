'use strict'

const browserify = require('browserify')
const bankai = require('bankai')
const http = require('http')
const path = require('path')
const client = path.join(__dirname, 'client.js')

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

  return http.createServer((req, res) => {
    switch (req.url) {
      case '/': return html(req, res).pipe(res)
      case '/whoami': return ready(res) && whoami(req, res)
      case '/peers': return ready(res) && peers(req, res)
      case '/ring': return ready(res) && ring(req, res)
      case '/bundle.js': return js(req, res).pipe(res)
      case '/bundle.css': return css(req, res).pipe(res)
      default:
        res.statusCode = 404
        return res.end('404 not found')
    }
  })

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
    const entries = upring._hashring._entries.map(function (entry) {
      return {
        id: entry.peer.id,
        point: entry.point
      }
    })
    res.end(JSON.stringify(entries, null, 2))
  }
}

module.exports = build
