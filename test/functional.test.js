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

describe('functionnal tests', () => {
  it('listen for keydown and dispatch event', () => {
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
})
