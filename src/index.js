let ShortKey = {}
let mapFunctions = {}
let objAvoided = []
let elementAvoided = []
let keyPressed = false

const parseValue = (binding) => {
  return typeof binding.value === 'string' ? JSON.parse(binding.value.replace(/\'/gi, '"')) : binding.value
}

const unbindValue = (el, k) => {
  const idxElm = mapFunctions[k].el.indexOf(el)
  if (mapFunctions[k].el.length > 1 && idxElm > -1) {
    mapFunctions[k].el.splice(idxElm, 1)
  } else {
    delete mapFunctions[k]
  }
}

ShortKey.install = (Vue, options) => {
  elementAvoided = [...(options && options.prevent ? options.prevent : [])]
  Vue.directive('shortkey', {
    bind: (el, binding, vnode) => {
      // Mapping the commands
      const b = parseValue(binding)
      const pushButton = binding.modifiers.push === true
      const avoid = binding.modifiers.avoid === true
      const focus = binding.modifiers.focus === true
      const once = binding.modifiers.once === true
      if (avoid) {
        objAvoided.push(el)
      } else {
        mappingFunctions({b, pushButton, once, focus, el: vnode.elm})
      }
    },
    unbind: (el, binding) => {
      const b = parseValue(binding)
      if (b instanceof Array) {
        const k = b.join('')
        unbindValue(el, k)
      } else {
        for (let item in b) {
          const k = b[item].join('')
          unbindValue(el, k)
        }
      }

      objAvoided = objAvoided.filter((itm) => {
        return !itm === el;
      })
    }
  })
}

ShortKey.decodeKey = (pKey) => {
  let k = ''
  if (pKey.key === 'Shift' || pKey.shiftKey) { k += 'shift' }
  if (pKey.key === 'Control' || pKey.ctrlKey) { k += 'ctrl' }
  if (pKey.key === 'Meta'|| pKey.metaKey) { k += 'meta' }
  if (pKey.key === 'Alt' || pKey.altKey) { k += 'alt' }
  if (pKey.key === 'ArrowUp') { k += 'arrowup' }
  if (pKey.key === 'ArrowLeft') { k += 'arrowleft' }
  if (pKey.key === 'ArrowRight') { k += 'arrowright' }
  if (pKey.key === 'ArrowDown') { k += 'arrowdown' }
  if (pKey.key === 'AltGraph') { k += 'altgraph' }
  if (pKey.key === 'Escape') { k += 'esc' }
  if (pKey.key === 'Enter') { k += 'enter' }
  if (pKey.key === 'Tab') { k += 'tab' }
  if (pKey.key === ' ') { k += 'space' }
  if (pKey.key === 'PageUp') { k += 'pageup' }
  if (pKey.key === 'PageDown') { k += 'pagedown' }
  if (pKey.key === 'Home') { k += 'home' }
  if (pKey.key === 'End') { k += 'end' }
  if (pKey.key === 'Delete') { k += 'del' }
  if (pKey.key === 'Insert') { k += 'insert' }
  if (pKey.key === 'NumLock') { k += 'numlock' }
  if (pKey.key === 'CapsLock') { k += 'capslock' }
  if (pKey.key === 'Pause') { k += 'pause' }
  if (pKey.key === 'ContextMenu') { k += 'contextmenu' }
  if (pKey.key === 'ScrollLock') { k += 'scrolllock' }
  if (pKey.key === 'BrowserHome') { k += 'browserhome' }
  if (pKey.key === 'MediaSelect') { k += 'mediaselect' }
  if ((pKey.key && pKey.key !== ' ' && pKey.key.length === 1) || /F\d{1,2}|\//g.test(pKey.key)) k += pKey.key.toLowerCase()
  return k
}

ShortKey.keyDown = (pKey) => {
  if ((!mapFunctions[pKey].oc && !mapFunctions[pKey].ps) || (mapFunctions[pKey].ps && !keyPressed)) {
    const e = new Event('shortkey', { bubbles: false })
    if (mapFunctions[pKey].key) e.srcKey = mapFunctions[pKey].key
    const elm = mapFunctions[pKey].el
    elm[elm.length - 1].dispatchEvent(e)
  }
}
ShortKey.keyUp = (pKey) => {
  const e = new Event('shortkey', { bubbles: false })
  if (mapFunctions[pKey].key) e.srcKey = mapFunctions[pKey].key
  const elm = mapFunctions[pKey].el
  elm[elm.length - 1].dispatchEvent(e)
}

if (process.env.NODE_ENV !== 'test') {
  ;(function () {
    document.addEventListener('keydown', (pKey) => {
      const decodedKey = ShortKey.decodeKey(pKey)

      // Check evict
      if (filteringElement(pKey)) {
        pKey.preventDefault()
        pKey.stopPropagation()
        if (mapFunctions[decodedKey].fn) {
          ShortKey.keyDown(decodedKey)
          keyPressed = true
        } else if (!keyPressed) {
          const elm = mapFunctions[decodedKey].el
          elm[elm.length - 1].focus()
          keyPressed = true
        }
      }
    }, true)

    document.addEventListener('keyup', (pKey) => {
      const decodedKey = ShortKey.decodeKey(pKey)
      if (filteringElement(pKey)) {
        pKey.preventDefault()
        pKey.stopPropagation()
        if (mapFunctions[decodedKey].oc || mapFunctions[decodedKey].ps) {
          ShortKey.keyUp(decodedKey)
        }
      }
      keyPressed = false
    }, true)
  })()
}

const addToMappingFunctions = (k, {pushButton, once, focus, el}, item) => {
  const elm = mapFunctions[k] && mapFunctions[k].el ? mapFunctions[k].el : []
  elm.push(el)
  mapFunctions[k] = {
    'ps': pushButton,
    'oc': once,
    'fn': !focus,
    'key': item,
    el: elm
  }
}

const mappingFunctions = ({b, pushButton, once, focus, el}) => {
  if (b instanceof Array) {
    const k = b.join('')
    addToMappingFunctions(k, {pushButton, once, focus, el})
  } else {
    for (let item in b) {
      const k = b[item].join('')
      addToMappingFunctions(k, {pushButton, once, focus, el}, item)
    }
  }
}

const filteringElement = (pKey) => {
  const decodedKey = ShortKey.decodeKey(pKey)
  const objectAvoid = objAvoided.find(r => r === document.activeElement)
  const elementSeparate = checkElementType()
  const elementTypeAvoid = elementSeparate.avoidedTypes
  const elementClassAvoid = elementSeparate.avoidedClasses
  const filterTypeAvoid = elementTypeAvoid.find(r => document.activeElement && r === document.activeElement.tagName.toLowerCase())
  const filterClassAvoid = elementClassAvoid.find(r => document.activeElement && r === '.' + document.activeElement.className.toLowerCase())
  return !objectAvoid && mapFunctions[decodedKey] && !filterTypeAvoid && !filterClassAvoid
}

const checkElementType = () => {
  let elmTypeAvoid = []
  let elmClassAvoid = []
  elementAvoided.forEach(r => {
    const dotPosition = r.indexOf('.')
    if (dotPosition === 0) {
      elmClassAvoid.push(r)
    } else if (dotPosition > 0) {
      elmTypeAvoid.push(r.split('.')[0])
      elmClassAvoid.push('.' + r.split('.')[1])
    } else {
      elmTypeAvoid.push(r)
    }
  })

  return {avoidedTypes: elmTypeAvoid, avoidedClasses: elmClassAvoid}
}

if (typeof module != 'undefined' && module.exports) {
  module.exports = ShortKey;
} else if (typeof define == 'function' && define.amd) {
  define( function () { return ShortKey; } );
} else {
  window.ShortKey = ShortKey;
}
