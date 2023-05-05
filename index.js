const crayon = require('tiny-crayon')
const ask = require('ask-readline')

let busy = false

module.exports = class Menu {
  constructor (opts = {}) {
    this._render = opts.render
    this._handler = opts.handler

    this._items = new Map()
    this._ask = opts.ask
    this._clearConsole = opts.clear !== false
    // TODO: buffer logs
  }

  create (title) {
    this._clear()

    if (title) {
      console.log(title)
      console.log()
    }
  }

  add (num, text, opts = {}) {
    num = Number(num)

    if (num < -1 || num > 9) throw new Error('Item out of range: ' + num)
    if (typeof text !== 'string') throw new Error('Text should be string')

    if (num === -1) {
      console.log(text)
      return
    }

    if (this._items.has(num)) throw new Error('Item already registered: ' + num)

    this._items.set(num, { num, value: opts.value, disabled: opts.disabled })

    if (opts.custom) console.log(text)
    else if (opts.disabled) console.log(crayon.gray(num + '.', text))
    else console.log(crayon.yellow(num + '.'), text)
  }

  // TODO: display (page) {}

  async show (page) {
    if (busy) throw new Error('Menu is already in use')
    busy = true

    if (!page) page = 1

    let item = null

    try {
      const userReturn = await this._render(page)
      item = await this._askItem(userReturn)
    } finally {
      busy = false
      this._clear()
    }

    return this._handler(item ? item.num : null, item ? item.value : undefined, page)
  }

  // TODO: async close () {}

  _clear () {
    this._items.clear()
    if (this._clearConsole) console.clear()
  }

  async _askItem (userReturn) {
    while (true) {
      // TODO: being able to cancel an "ask" to close menus
      const answer = this._ask ? await this._ask(userReturn) : await this.ask()
      if (answer === null) return answer

      const num = Number(answer)
      const item = this._items.get(num)
      if (!item || item.disabled) continue

      return item
    }
  }

  ask (query, opts) {
    if (!query) return ask('', { oninput: autoSubmit })
    return ask(query, opts)
  }

  static calculatePages (page, maxItems, perPage = 7) {
    const max = Math.floor(maxItems / perPage) + (maxItems % perPage ? 1 : 0)

    if (page < 1) page = 1
    else if (page > max) page = max

    const start = ((page - 1) * perPage)
    const end = Math.min(start + perPage, maxItems)

    return { page, max, start, end }
  }
}

function autoSubmit (input) {
  return input.length > 0
}
