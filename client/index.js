'use strict'
/* global WebSocket */

const d3 = require('d3')
const sheetify = require('sheetify')
const yo = require('yo-yo')
const wr = require('winresize-event')
const xhr = require('xhr')
const d3sc = require('d3-scale-chromatic')
const CompCol = require('complementary-colors')
const maxColor = 10

// TODO make the scale and the max number of color dynamic
const scale = d3.scaleSequential(d3sc.interpolatePurples).domain([maxColor, 0])
const fill = require('./fill')(scale, maxColor)

const compCol = new CompCol(scale(1))
const fillColor = asColor(compCol.triad()[2])

sheetify('normalize.css')
const ringStyle = sheetify('../ring.css')
const barStyle = sheetify('../bar.css')

var width = 0
var height = 0
var radius = 0
var innerRadius = 0
var outerRadius = 0

function computeSizes (dim) {
  width = Math.floor(dim.width * 98 / 100)
  height = Math.floor(dim.height * 98 / 100)
  radius = Math.min(width, height) / 2

  innerRadius = radius * 70 / 100
  outerRadius = radius * 90 / 100
}

computeSizes(wr.getWinSize())

const bar = yo`
  <div class=${barStyle} >
    <a href='https://github.com/mcollina/upring' target="blank">
      <img class="logo" src='/upring.png'>
    </a>
    <div class="inputBox">
      <input type='text' oninput=${changePoint} placeholder="Search on the hashring">
    </div>
  </div>
`

var lastPoint = null

function changePoint (ev) {
  const body = ev.target.value

  if (body.length === 0) {
    hashDisplay.remove()
    return
  }

  xhr.post('/hash', { body }, function (err, res, body) {
    if (err || res.statusCode !== 200) {
      hashDisplay.remove()
      return
    }

    lastPoint = JSON.parse(body)
    hashDisplay.plot(svg, lastPoint)
  })
}

document.body.appendChild(bar)

const parent = yo`
  <div class=${ringStyle} id='wheel'>
    <div id='tooltip'>
    </div>
  </div>
`

document.body.appendChild(parent)

const parentSvg = d3.select('div#wheel').append('svg')
  .attr('width', width)
  .attr('height', height)

const svg3 = parentSvg.append('g')

const svg = parentSvg
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

const svg2 = parentSvg
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)

const { arcMouseOver, arcMouseLeave } = require('./mouseOver')(svg, fill)
const hashDisplay = require('./hash')(radius, svg2, fillColor)
const text = require('./text')(svg3, height, svg, arc, width, fill)

var count = 1
setInterval(function () {
  text.add({
    text: 'hello' + count++,
    point: Math.random() * (Math.pow(2, 32) - 1)
  })
}, 1000)

wr.winResize.on(function (dim) {
  computeSizes(dim)

  d3.select('div#wheel').select('svg')
    .transition('winresize')
    .attr('width', width)
    .attr('height', height)

  svg.transition('winresize')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  svg2.transition('winresize')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  arc
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  svg.selectAll('path')
    .transition('winresize')
    .attr('d', arc)

  hashDisplay.changeRadius(radius)

  text.resize(width, height)
})

const pie = d3.pie()
  .value(function (d) {
    return d.point
  })
  .sort(null)

const conn = new WebSocket(document.URL.replace('http', 'ws'))
var path

conn.onmessage = function (msg) {
  const data = JSON.parse(msg.data)

  // TODO add a transition
  if (path) {
    path.remove()
  }

  path = getPath(data)
  text.clear()

  if (lastPoint) {
    hashDisplay.plot(svg, lastPoint)
  }
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

function asColor (obj) {
  return 'rgb(' + obj.r + ', ' + obj.g + ', ' + obj.b + ')'
}
