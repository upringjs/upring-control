'use strict'

const yo = require('yo-yo')
const sheetify = require('sheetify')
const style = sheetify('./legend.css')

function build (svg, onclick, onmouseover, onmouseleave, fill) {
  var elem = yo`
    <div></div>
  `

  document.body.appendChild(elem)

  return update

  function update (ring) {
    const peers = new Set()

    for (var i = 0; i < ring.length; i++) {
      peers.add(ring[i].id)
    }

    elem = yo.update(elem, render(peers))
  }

  function render (peers) {
    const legend = yo`
      <div class=${style}>
        <h2>Peers</h2>
        <ul>${Array.from(peers).map(asList)}</ul>
      </div>
    `

    return legend
  }

  function asList (id) {
    const color = fill({ id })
    return yo`
      <li onclick=${myonclick} onmouseover=${mymouseover} onmouseleave=${mymouseleave}>
        <span style="background-color: ${color}" class="color"></span>${id}
      </li>
    `

    function myonclick (ev) {
      ev.data = { id }
      onclick(ev)
    }

    function mymouseover (ev) {
      ev.data = { id }
      onmouseover(ev)
    }

    function mymouseleave (ev) {
      ev.data = { id }
      onmouseleave(ev)
    }
  }
}

module.exports = build
