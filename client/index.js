'use strict'
/* global WebSocket */

const d3 = require('d3')
const sheetify = require('sheetify')
const yo = require('yo-yo')
const wr = require('winresize-event')

const palette = d3.schemeCategory20b
const fill = require('./fill')(palette)

sheetify('normalize.css')
const style = sheetify('../main.css')

var width = 0
var height = 0
var radius = 0
var innerRadius = 0
var outerRadius = 0

function computeSizes (dim) {
  width = Math.floor(dim.width * 90 / 100)
  height = Math.floor(dim.height * 90 / 100)
  radius = Math.min(width, height) / 2

  innerRadius = radius * 70 / 100
  outerRadius = radius * 90 / 100
}

computeSizes(wr.getWinSize())

const parent = yo`
  <div class=${style} id='wheel'>
    <div id='tooltip'>
    </div>
  </div>
`

document.body.appendChild(parent)

const svg = d3.select('div#wheel').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

const { arcMouseOver, arcMouseLeave } = require('./mouseOver')(svg, fill)

wr.winResize.on(function (dim) {
  computeSizes(dim)

  d3.select('div#wheel').select('svg')
    .transition('winresize')
    .attr('width', width)
    .attr('height', height)

  svg.transition('winresize')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  arc
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  svg.selectAll('path')
    .transition('winresize')
    .attr('d', arc)
})

const pie = d3.pie()
  .value(function (d) {
    return d.point
  })
  .sort(null)

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)

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
    .on('mouseover', arcMouseOver)
    .on('mouseleave', arcMouseLeave)
}

