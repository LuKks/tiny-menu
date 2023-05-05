const Menu = require('./index.js')
const crayon = require('tiny-crayon')

const DATA = new Array(25).fill().map(() => Math.random())

const menu = new Menu({
  render (page) {
    this.create('MENU ' + Math.random())

    this.add(1, 'List')
    this.add(2, 'Add')
    this.add(3, 'Remove')
    this.add(4, 'Edit\n')

    this.add(-1, 'Text A')
    this.add(-1, 'Text B\n')

    this.add(8, 'Seeds')
    this.add(9, 'Core viewer\n')

    this.add(0, 'Exit')
  },
  handler (item, value, page) {
    if (item === 0 || item === null) return
    if (item === 8) return seeds.show()
    if (item === 9) return viewer.show()

    console.log('Menu handler:', { item, value, page })
  }
})

const seeds = new Menu({
  render (page) {
    this.create('SEEDS ' + Math.random())

    this.add(1, 'Generate')
    this.add(0, 'Back to menu')
  },
  handler (item, value, page) {
    console.log('Menu handler:', { item, value, page })

    if (item === null) return
    if (item === 0) return menu.show()
    if (item === 1) return seeds.show()
  }
})

const viewer = new Menu({
  async render (page) {
    const pages = Menu.calculatePages(page, DATA.length, 10)

    this.create('Pagination (' + pages.page + '/' + pages.max + ')')

    this.add(-1, 'Data:')

    for (let i = pages.start, count = 1; i < pages.end; i++, count++) {
      this.add(-1, crayon.yellow('#' + i) + ' ' + DATA[i])
    }

    this.add(-1, '')
    this.add(8, 'Back', { disabled: page <= 1 })
    this.add(9, 'Next', { disabled: page >= pages.max })
    this.add(0, 'Exit')
  },
  handler (item, value, page) {
    console.log('Menu handler:', { item, value, page })

    if (item === 0 || item === null) return menu.show()
    if (item === 8) return viewer.show(page - 1)
    if (item === 9) return viewer.show(page + 1)
  }
})

main()

async function main () {
  await menu.show()

  console.log('Menu closed')
}
