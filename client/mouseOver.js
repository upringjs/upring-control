'use strict'

const d3 = require('d3')

function setupMouseOver (svg, fill) {
  const div = d3.select('div#tooltip').style('opacity', 0)

  var lastId = ''

  return { arcMouseOver, arcMouseLeave }

  function arcMouseOver (ev) {
    const id = ev.data.id

    if (lastId !== id) {
      arcMouseLeave(ev)
    }

    svg.selectAll('path')
      .transition()
      .filter(function (p) {
        return p.data.id !== id
      })
      .attr('fill', () => '#333333')
      .style('opacity', 0.2)

    div.transition()
      .duration(200)
      .style('opacity', 0.9)

    div.html(`<b>id:</b>${id}<br/>`)
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px')

    lastId = id
  }

  function arcMouseLeave (ev) {
    svg.selectAll('path')
      .transition('restore')
      .attr('fill', fill)
      .style('opacity', 1)

    div.transition()
      .duration(200)
      .style('opacity', 0)

    lastId = ''
  }
}

module.exports = setupMouseOver
