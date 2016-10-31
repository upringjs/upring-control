'use strict'

const d3 = require('d3')

function addPoint (radius, svg, main, point) {
  const innerRadius = radius * 92 / 100
  const outerRadius = radius * 100 / 100

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  var startAngle
  var endAngle = 0

  main.selectAll('path')
    .each(function (p, i) {
      if (p.data.point < point.point) {
        startAngle = p.startAngle
        endAngle = p.endAngle
      }
    })

  svg.selectAll('path')
    .data([{
      startAngle,
      endAngle
    }])
    .enter()
    .append('path')
    .attr('fill', '#FFFF00')
    .attr('d', arc)
}

module.exports = addPoint
