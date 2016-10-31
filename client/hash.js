'use strict'

const d3 = require('d3')

function create (radius, svg, color) {
  console.log(color)
  const arc = d3.arc()

  var innerRadius = 0
  var outerRadius = 0
  var path

  changeRadius(radius)

  return { plot, changeRadius, remove }

  function plot (main, point) {
    var startAngle
    var endAngle = 0

    main.selectAll('path')
      .each(function (p, i) {
        if (p.data.point < point.point) {
          startAngle = p.startAngle
          endAngle = p.endAngle
        }
      })

    if (!path) {
      path = svg.selectAll('path')
        .data([{
          startAngle,
          endAngle
        }])
        .enter()
        .append('path')
        .attr('fill', color)
        .attr('d', arc)
        .attr('opacity', 0)

      path
        .transition()
        .duration(500)
        .attr('opacity', 1)
    } else {
      path
        .transition()
        .duration(1500)
        .attr('opacity', 1)
        .attrTween('d', arcTween(startAngle, endAngle))
    }
  }

  function changeRadius (r) {
    computeVars(r)

    arc
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

    svg.selectAll('path')
      .transition('winresize')
      .attr('d', arc)
  }

  function computeVars (r) {
    innerRadius = r * 92 / 100
    outerRadius = r * 100 / 100
  }

  function remove () {
    if (path) {
      path.transition()
        .duration(500)
        .attr('opacity', 0)
        .remove()
      path = null
    }
  }

  function arcTween (startAngle, endAngle) {
    return function (d) {
      const interpolateEnd = d3.interpolate(d.endAngle, endAngle)
      const interpolateStart = d3.interpolate(d.startAngle, startAngle)
      return function (t) {
        d.endAngle = interpolateEnd(t)
        d.startAngle = interpolateStart(t)
        return arc(d)
      }
    }
  }
}

module.exports = create
