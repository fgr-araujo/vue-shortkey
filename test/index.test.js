import find from  'array.prototype.find'
import {expect} from 'chai'
import Vue from 'vue'
import Shortkey from '../src/index.js'

find.shim()

Vue.use(Shortkey)
const VM = pTemplate => new Vue({
  template: pTemplate,
  data() {
    return {
      called: false
    }
  },
  methods: {
    foo() {
      this.called = true
    }
  }
})

function createEvent(name='keydown') {
  const event = document.createEvent('HTMLEvents')
  event.initEvent(name, false, true)
  return event
}

describe('Index.js', () => {
  describe('fn.decodeKey', () => {
    it('Return single key', () => {
      expect(Shortkey.decodeKey({key: 'Shift'})).to.equal('shift')
      expect(Shortkey.decodeKey({key: 'Control'})).to.equal('ctrl')
      expect(Shortkey.decodeKey({key: 'Meta'})).to.equal('meta')
      expect(Shortkey.decodeKey({key: 'Alt'})).to.equal('alt')
      expect(Shortkey.decodeKey({key: 'ArrowUp'})).to.equal('arrowup')
      expect(Shortkey.decodeKey({key: 'ArrowLeft'})).to.equal('arrowleft')
      expect(Shortkey.decodeKey({key: 'ArrowRight'})).to.equal('arrowright')
      expect(Shortkey.decodeKey({key: 'ArrowDown'})).to.equal('arrowdown')
      expect(Shortkey.decodeKey({key: 'AltGraph'})).to.equal('altgraph')
      expect(Shortkey.decodeKey({key: 'Escape'})).to.equal('esc')
      expect(Shortkey.decodeKey({key: 'Enter'})).to.equal('enter')
      expect(Shortkey.decodeKey({key: 'Tab'})).to.equal('tab')
      expect(Shortkey.decodeKey({key: ' '})).to.equal('space')
      expect(Shortkey.decodeKey({key: 'PageUp'})).to.equal('pageup')
      expect(Shortkey.decodeKey({key: 'PageDown'})).to.equal('pagedown')
      expect(Shortkey.decodeKey({key: 'Home'})).to.equal('home')
      expect(Shortkey.decodeKey({key: 'End'})).to.equal('end')
      expect(Shortkey.decodeKey({key: 'Delete'})).to.equal('del')
      expect(Shortkey.decodeKey({key: 'Insert'})).to.equal('insert')
      expect(Shortkey.decodeKey({key: 'NumLock'})).to.equal('numlock')
      expect(Shortkey.decodeKey({key: 'CapsLock'})).to.equal('capslock')
      expect(Shortkey.decodeKey({key: 'Pause'})).to.equal('pause')
      expect(Shortkey.decodeKey({key: 'ContextMenu'})).to.equal('contextmenu')
      expect(Shortkey.decodeKey({key: 'ScrollLock'})).to.equal('scrolllock')
      expect(Shortkey.decodeKey({key: 'BrowserHome'})).to.equal('browserhome')
      expect(Shortkey.decodeKey({key: 'MediaSelect'})).to.equal('mediaselect')
    })

    it('Return a combined key', () => {
      expect(Shortkey.decodeKey({altKey: true, key: 'a'})).to.equal('alta')
      expect(Shortkey.decodeKey({altKey: true, ctrlKey: true, key: 'a'})).to.equal('ctrlalta')
    })
  })
})


describe('functionnal tests', () => {
  describe('Dispatch triggered event', () => {
    it('listen for keydown and dispatch simple event', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'q\']"></div>')
      vm.$mount(div)

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.true
      vm.$destroy()
    })

    it('listen for keydown and dispatch event with object key', (done) => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"></div>')

      const stubFoo = sinon.stub(vm, 'foo').callsFake(fn => {
        expect(fn.srcKey).to.equal('option1')
        stubFoo.restore()
        vm.$destroy()
        done()
      })

      vm.$mount(div)

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)
    })
  })


  describe('Don`t dispatch triggered event', () => {
    it('dont trigger listen for keydown and dispatch event', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)

      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea v-shortkey.avoid></textarea></div>')
      vm.$mount(div)

      const textarea = vm.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.false
      vm.$destroy()
    })

    it('listen for keydown and dispatch event with object key', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"><textarea v-shortkey.avoid></textarea></div>')
      vm.$mount(div)

      const textarea = vm.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.false
      vm.$destroy()
    })
  })

  it('Setting focus with .focus modifier', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new VM(`<div><input type="text" /> <button type="button" v-shortkey.focus="['f']">BUTTON</button></div>`)
    vm.$mount(div)

    const inputText = vm.$el.querySelector('input')
    inputText.focus()
    expect(document.activeElement == inputText).to.be.true

    const keydown = createEvent('keydown')
    keydown.key = 'f'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'f'
    document.dispatchEvent(keyup)

    const buttonInput = vm.$el.querySelector('button')
    expect(document.activeElement == buttonInput).to.be.true
    vm.$destroy()
  })

  it('Bring push button with .push modifier', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new VM(`<div><button type="button" v-shortkey.push="['p']" @shortkey="foo()">BUTTON</button></div>`)
    vm.$mount(div)

    const spyFoo = sinon.spy(vm, 'foo')

    const keydown = createEvent('keydown')
    keydown.key = 'p'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'p'
    document.dispatchEvent(keyup)

    expect(spyFoo.callCount).to.equal(2)
    spyFoo.restore()
    vm.$destroy()
  })

  it('Testing delete key', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new VM(`<button @shortkey="foo" v-shortkey="['del']"></button>`)
    vm.$mount(div)

    const keydown = createEvent('keydown')
    keydown.key = 'Delete'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'Delete'
    document.dispatchEvent(keyup)

    expect(vm.called).to.be.true
    vm.$destroy()
  })

  it('Testing ? key', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new VM(`<button @shortkey="foo" v-shortkey="['shift', '?']"></button>`)
    vm.$mount(div)

    const keydown = createEvent('keydown')
    keydown.shiftKey = true
    keydown.key = '?'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keydown.shiftKey = true
    keydown.key = '?'
    document.dispatchEvent(keyup)

    expect(vm.called).to.be.true
    vm.$destroy()
  })
})
