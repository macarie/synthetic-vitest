import { text } from './fixtures'

export function mountCatalogue(id: string) {
  const main = document.createElement('main')
  main.setAttribute('aria-label', 'Catalogue')
  const heading = document.createElement('h1')
  heading.textContent = text(`${id}:heading`, 'Snapshot catalogue')
  const button = document.createElement('button')
  button.textContent = text(`${id}:button`, 'Capture snapshot')
  const list = document.createElement('ul')
  list.setAttribute('aria-label', 'Snapshot kinds')
  for (const [index, label] of ['Inline snapshots', 'File snapshots'].entries()) {
    const item = document.createElement('li')
    item.textContent = text(`${id}:item:${index}`, label)
    list.append(item)
  }
  main.append(heading, list, button)
  document.body.append(main)
  return main
}

export function mountPixels(id: string) {
  const root = document.createElement('div')
  root.dataset.testid = 'pixels'
  root.style.cssText = 'display:flex;width:240px;height:80px;background:#fff;'
  // Mutating a few hexadecimal characters changes pixels without introducing
  // font rasterization, network, animation or system-theme differences.
  for (let i = 0; i < 3; i++) {
    const block = document.createElement('div')
    const label = text(`${id}:pixels:${i}`, 'abc')
    const channels = [...label].map(char => char.charCodeAt(0))
    block.style.cssText = `width:80px;height:80px;background:rgb(${channels.join(',')});`
    root.append(block)
  }
  document.body.append(root)
  return root
}
