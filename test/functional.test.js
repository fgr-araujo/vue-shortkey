import find from  'array.prototype.find'
import {expect} from 'chai'
import Vue from 'vue'
import Shortkey from '../src/index.js'

find.shim()

describe('functionnal tests', () => {
  Vue.use(Shortkey)

  it('listen for keydown and dispatch event', () => {
    const vm = new Vue({
      template: '<div @shortkey="foo" v-shortkey="[\'q\']"></div>',
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

    const vm = new Vue({
      template: '<div @shortkey="foo" v-shortkey="[\'b\']"><textarea v-shortkey.avoid></textarea></div>',
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
})
