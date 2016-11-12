let ShortKey = {}
let mapFunctions = {}

ShortKey.install = function (Vue) {
  Vue.directive('shortkey', {
    bind: function (el, binding, vnode) {
      // Mapping the commands
      let k = ''
      let b = binding.modifiers
      let pushButton = false
      if (b.hasOwnProperty('shift')) { k += 'shift'; delete b.shift }
      if (b.hasOwnProperty('ctrl')) { k += 'ctrl'; delete b.ctrl }
      if (b.hasOwnProperty('alt')) { k += 'alt'; delete b.alt }
      if (b.hasOwnProperty('altgraph')) { k += 'altgraph'; delete b.altgraph }
      if (b.hasOwnProperty('push')) { pushButton = true; delete b.push }
      if (Object.keys(b).length > 0) { k += Object.keys(b)[0].toLowerCase() }
      mapFunctions[k] = {
        'ps': pushButton,
        'fn': vnode.context.$vnode.child[binding.expression],
        'el': vnode.elm
      }
    }
  })
}

ShortKey.decodeKey = function (pKey) {
  let k = ''
  // console.log('theKey......', pKey)
  if (pKey.key === 'Shift' || pKey.shiftKey === true) { k += 'shift' }
  if (pKey.key === 'Control' || pKey.ctrlKey === true) { k += 'ctrl' }
  if (pKey.key === 'Alt' || pKey.altKey === true) { k += 'alt' }
  if (pKey.key === 'ArrowUp') { k += 'arrowup' }
  if (pKey.key === 'ArrowLeft') { k += 'arrowleft' }
  if (pKey.key === 'ArrowRight') { k += 'arrowright' }
  if (pKey.key === 'ArrowDown') { k += 'arrowdown' }
  if (pKey.key === 'AltGraph') { k += 'altgraph' }
  if ((pKey.key && pKey.key.length === 1) || /F\d{1,2}/g.test(pKey.key)) k += pKey.key.toLowerCase()
  return k
}

ShortKey.keyDown = function (pKey) {
  if (mapFunctions[pKey]) {
    mapFunctions[pKey].fn()
  }
}
ShortKey.keyUp = function (pKey) {
  if (mapFunctions[pKey]) {
    mapFunctions[pKey].fn()
  }
}

;(function () {
  document.addEventListener('keydown', (pKey) => {
    let decodedKey = ShortKey.decodeKey(pKey)
    if (mapFunctions[decodedKey]) {
      pKey.preventDefault()
      pKey.stopPropagation()
      if (mapFunctions[decodedKey].fn) {
        ShortKey.keyDown(decodedKey)
      } else {
        mapFunctions[decodedKey].el.focus()
      }
    }
  }, true)
  document.addEventListener('keyup', (pKey) => {
    let decodedKey = ShortKey.decodeKey(pKey)
    if (mapFunctions[decodedKey]) {
      pKey.preventDefault()
      pKey.stopPropagation()
      if (mapFunctions[decodedKey].ps) {
        ShortKey.keyUp(decodedKey)
      }
    }
  }, true)
})()

module.exports = ShortKey
