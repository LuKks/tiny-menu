# tiny-menu

Terminal menu

![](https://img.shields.io/npm/v/tiny-menu.svg) ![](https://img.shields.io/npm/dt/tiny-menu.svg)

```
npm i tiny-menu
```

## Usage
```js
const Menu = require('tiny-menu')

const menu = new Menu({
  render (page) {
    this.create('MENU')

    this.add(1, 'List')
    this.add(2, 'Add')
    this.add(3, 'Remove')
    this.add(4, 'Edit\n')

    this.add(-1, 'Text A')
    this.add(-1, 'Text B\n')

    this.add(9, 'Generate\n')

    this.add(0, 'Exit')
  },
  handler (item, value, page) {
    console.log('Callback:', { item, value, page })
  }
})

await menu.show()
```

## Examples

#### Pagination

```js
const Menu = require('tiny-menu')

const DATA = new Array(25).fill().map(() => Math.random())

const viewer = new Menu({
  render (page) {
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
    if (item === 0 || item === null) return
    if (item === 8) return viewer.show(page - 1)
    if (item === 9) return viewer.show(page + 1)
  }
})

await viewer.show()
```

## License

Apache-2.0
