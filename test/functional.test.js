import find from  'array.prototype.find'
import {expect} from 'chai'
import Vue from 'vue'
import Shortkey from '../src/index.js'

find.shim()

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


describe('functionnal tests', () => {
  Vue.use(Shortkey)

  it('listen for keydown and dispatch event', () => {
    const vm = new VM('<div @shortkey="foo" v-shortkey="[\'q\']"></div>')
    vm.$mount()

    var keydown = document.createEvent('HTMLEvents')
    keydown.initEvent("keydown", false, true)
    keydown.ctrlKey = false
    keydown.key = 'q'
    document.dispatchEvent(keydown)

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

    var keydown = document.createEvent('HTMLEvents')
    keydown.initEvent("keydown", false, true)
    keydown.ctrlKey = false
    keydown.key = 'b'
    document.dispatchEvent(keydown)

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

    let keydown = document.createEvent('HTMLEvents')
    keydown.initEvent('keydown', false, true)
    keydown.key = 'f'
    document.dispatchEvent(keydown)

    const buttonInput = vm.$el.querySelector('button')
    expect(document.activeElement == buttonInput).to.be.true
  })

  it.only('Bring push button with .push modifier', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new VM(`<div><button type="button" v-shortkey.push="['p']">BUTTON</button></div>`)
    vm.$mount(div)

    let spyFoo = sinon.spy(vm, 'foo')

    let keydown = document.createEvent('HTMLEvents')
    keydown.initEvent('keydown', false, true)
    keydown.key = 'p'
    document.dispatchEvent(keydown)

    expect(spyFoo).to.be.calledTwice
    spyFoo.restore()
  })
})
