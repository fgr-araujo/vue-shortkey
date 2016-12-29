let ShortKey = {}
let mapFunctions = {}
let objAvoided = []
let elementAvoided = []
let keyPressed = false

ShortKey.install = function (Vue, options) {
  elementAvoided = [...(options && options.prevent ? options.prevent : [])]
  Vue.directive('shortkey', {
    bind: function (el, binding, vnode) {
      // Mapping the commands
      let b = typeof binding.value === 'string' ? JSON.parse(binding.value.replace(/\'/gi, '"')) : binding.value
      let pushButton = binding.modifiers.push === true
      let avoid = binding.modifiers.avoid === true
      let focus = binding.modifiers.focus === true
      let once = binding.modifiers.once === true
      if (pushButton) { delete b.push }
      if (avoid) {
        objAvoided.push(el)
      } else {
        let k = b.join('')
        mapFunctions[k] = {
          'ps': pushButton,
          'oc': once,
          'fn': !focus,
          'el': vnode.elm
        }
      }
    }
  })
}

ShortKey.decodeKey = function (pKey) {
  let k = ''
  if (pKey.key === 'Shift' || pKey.shiftKey === true) { k += 'shift' }
  if (pKey.key === 'Control' || pKey.ctrlKey === true) { k += 'ctrl' }
  if (pKey.key === 'Alt' || pKey.altKey === true) { k += 'alt' }
  if (pKey.key === 'ArrowUp') { k += 'arrowup' }
  if (pKey.key === 'ArrowLeft') { k += 'arrowleft' }
  if (pKey.key === 'ArrowRight') { k += 'arrowright' }
  if (pKey.key === 'ArrowDown') { k += 'arrowdown' }
  if (pKey.key === 'AltGraph') { k += 'altgraph' }
  if (pKey.key === 'Escape') { k += 'esc' }
  if ((pKey.key && pKey.key.length === 1) || /F\d{1,2}/g.test(pKey.key)) k += pKey.key.toLowerCase()
  return k
}

ShortKey.keyDown = function (pKey) {
  if ((!mapFunctions[pKey].oc && !mapFunctions[pKey].ps)|| (mapFunctions[pKey].ps && !keyPressed)) {
    var e = document.createEvent('HTMLEvents')
    e.initEvent('shortkey', true, true)
    mapFunctions[pKey].el.dispatchEvent(e)
  }
}
ShortKey.keyUp = function (pKey) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent('shortkey', true, true)
  mapFunctions[pKey].el.dispatchEvent(e)
}

;(function () {
  document.addEventListener('keydown', (pKey) => {
    let decodedKey = ShortKey.decodeKey(pKey)
    // Check evict
    if (mapFunctions[decodedKey] && !objAvoided.find(r => r === document.activeElement) && !elementAvoided.find(r => r === document.activeElement.tagName.toLowerCase() )) {
      pKey.preventDefault()
      pKey.stopPropagation()
      if (mapFunctions[decodedKey].fn) {
        ShortKey.keyDown(decodedKey)
        keyPressed = true
      } else if (!keyPressed) {
        mapFunctions[decodedKey].el.focus()
        keyPressed = true
      }
    }
  }, true)
  document.addEventListener('keyup', (pKey) => {
    let decodedKey = ShortKey.decodeKey(pKey)
    if (mapFunctions[decodedKey] && !objAvoided.find(r => r === document.activeElement) && !elementAvoided.find(r => r === document.activeElement.tagName.toLowerCase() )) {
      pKey.preventDefault()
      pKey.stopPropagation()
      if (mapFunctions[decodedKey].oc || mapFunctions[decodedKey].ps) {
        ShortKey.keyUp(decodedKey)
      }
    }
    keyPressed = false
  }, true)
})()

module.exports = ShortKey
