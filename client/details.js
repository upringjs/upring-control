'use strict'

const xhr = require('xhr')
const yo = require('yo-yo')
const sheetify = require('sheetify')
const style = sheetify('../info.css')

function build (svg) {
  var elem = render()

  document.body.appendChild(elem)

  return function onclick (ev) {
    const id = ev.data.id
    xhr.get(`/peer/${id}`, function (err, res, body) {
      if (err) {
        console.log(err)
        return
      }
      elem = yo.update(elem, render(JSON.parse(body)))
    })
  }

  function render (data) {
    var content = ''

    if (data) {
      content = yo`
        <div class="info">
          <h2>Peer information<a class="close" onclick=${hide}>X</a></h2>
          <pre>${asLinks(JSON.stringify(data, null, 2))}</pre>
        </div>
      `
    }

    const info = yo`
      <div class=${style}>
      ${content}
      </div>
    `

    return info
  }

  function hide () {
    elem = yo.update(elem, render())
  }

  function asLinks (text) {
    var results = []
    var exp = /(https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.[\]]*[-A-Z0-9+&@#/%=~_|])/ig
    var match

    while ((match = exp.exec(text)) !== null) {
      results.push(yo`<code>${text.slice(0, match.index)}</code>`)
      results.push(yo`<a href='${match[1]}' target='_blank'><code>${match[1]}</code></a>`)
      text = text.slice(match.index + match[1].length)
    }

    results.push(yo`<code>${text}</code>`)

    return results
  }
}

module.exports = build
