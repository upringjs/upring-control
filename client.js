'use strict'

const d3 = require('d3')
const WebSocket = require('ws')

const width = 960
const height = 500
const radius = Math.min(width, height) / 2

const palette = d3.schemeCategory20c
var paletteCounter = 0
const idColors = new Map()

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

const pie = d3.pie()
  .value(function (d) {
    return d.point
  })
  .sort(null)

const arc = d3.arc()
  .innerRadius(radius - 100)
  .outerRadius(radius - 20)

function fill (d, i) {
  const name = d.data.id
  var color = idColors.get(name)
  if (!color) {
    color = palette[paletteCounter++]
    idColors.set(name, color)
  }

  if (paletteCounter >= palette.length) {
    paletteCounter = 0
  }

  return color
}

const conn = new WebSocket(document.URL.replace('http', 'ws'))
var path

conn.onmessage = function (msg) {
  const data = JSON.parse(msg.data)

  // TODO add a transition
  if (path) {
    path.remove()
  }

  path = getPath(data)
}

function getPath (data) {
  return svg.datum(data).selectAll('path')
    .data(pie)
    .enter()
    .append('path')
    .attr('fill', fill)
    .attr('d', arc)
    .each(function (d) {
      this._current = d
    })
}
