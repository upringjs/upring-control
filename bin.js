#! /usr/bin/env node

'use strict'

const control = require('.')
const UpRing = require('upring')
const args = require('minimist')(process.argv.slice(2), {
  alias: {
    timeout: 't',
    port: 'p',
    points: 'P'
  },
  default: {
    points: 100,
    timeout: 200,
    port: 8008
  }
})
const pinoHttp = require('pino-http')

const upring = UpRing({
  client: true, // this does not provides services to the ring
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
