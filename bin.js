#! /usr/bin/env node

'use strict'

const control = require('.')
const UpRing = require('upring')
const args = require('minimist')(process.argv.slice(2), {
  alias: {
    timeout: 't',
    port: 'p',
    points: 'P',
    help: 'h',
    version: 'V',
    verbose: 'v'
  },
  default: {
    points: 100,
    timeout: 200,
    port: 8008
  }
})

if (args.help) {
  console.log(`Usage: upring-control [OPTS] [BASE]

Options:
  -t/--timeout MILLIS     milliseconds to wait to join the ring, default 200
  -p/--port PORT          the port on which the control panel will be exposes, default 8008
  -P/--points             the number of points for each peer, default 100
  -v/--verbose            enable debug logs
  -V/--version            print the version number
  -h/--help               shows this help
`)
  process.exit(1)
}

if (args.version) {
  console.log('v' + require('./package').version)
  process.exit(1)
}

const pinoHttp = require('pino-http')

const upring = UpRing({
  client: true, // this does not provides services to the ring
  logLevel: args.verbose ? 'debug' : 'info',
  hashring: {
    replicaPoints: args.points,
    joinTimeout: args.timeout,
    base: args._
  }
})

const logger = pinoHttp({ logger: upring.logger })

const server = control(upring)

upring.on('up', () => {
  server.on('request', logger)
  server.listen(args.port, function () {
    logger.logger.info('server listening on port %d', this.address().port)
  })
})
