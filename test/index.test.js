import './Pollyfills'
import find from  'array.prototype.find'
import {expect} from 'chai'
import Vue from 'vue'
import Shortkey from '../src/index.js'

find.shim()

Vue.use(Shortkey, { prevent: ['.disableshortkey', '.disableshortkey textarea'] })
const VM = template => new Vue({
  template,
  data() {
    return {
      called: false,
      calledBubble: false
    }
  },
  methods: {
    foo() {
      this.called = true
    },
    bar() {
      this.calledBubble = true
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
      expect(Shortkey.decodeKey({key: 'Backspace'})).to.equal('backspace')
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

  const createDiv = () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    return div
  }

  describe('Dispatch triggered event', () => {
    it('listen for keydown and dispatch simple event', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'q\']"></div>')
      vm.$mount(createDiv())

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.true
      vm.$destroy()
    })

    it('unbind simple events', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'q\']"></div>')
      vm.$mount(createDiv())

      vm.$destroy()

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.false
    });

    it('listen for keydown and dispatch event with object key', (done) => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"></div>')

      const stubFoo = sinon.stub(vm, 'foo').callsFake(fn => {
        expect(fn.srcKey).to.equal('option1')
        stubFoo.restore()
        vm.$destroy()
        done()
      })
      vm.$mount(createDiv())

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.true
    })

    it('unbind event with object key', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"></div>')
      vm.$mount(createDiv())
      vm.$destroy()

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.false
    })
  })


  describe('Don`t dispatch triggered event', () => {
    it('dont trigger listen for keydown and dispatch event', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea v-shortkey.avoid></textarea></div>')
      vm.$mount(createDiv())

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

    it('does not trigger events when its class is in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea class="disableshortkey"></textarea></div>')
      vm.$mount(createDiv())

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

    it('does not trigger events when one of its classes is in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea class="disableshortkey stylingclass"></textarea></div>')
      vm.$mount(createDiv())

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

    it('does not trigger events when it gets matched by one item in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']" class="disableshortkey"><textarea class="stylingclass"></textarea></div>')
      vm.$mount(createDiv())

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

    it('does trigger events when only the parent element gets matched by one item in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']" class="disableshortkey"><input type="text" /></div>')
      vm.$mount(createDiv())

      const input = vm.$el.querySelector('input')
      input.focus()
      expect(document.activeElement == input).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(vm.called).to.be.true
      vm.$destroy()
    })

    it('listen for keydown and dispatch event with object key', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"><textarea v-shortkey.avoid></textarea></div>')
      vm.$mount(createDiv())

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
    const vm = new VM(`<div><input type="text" /> <button type="button" v-shortkey.focus="['f']">BUTTON</button></div>`)
    vm.$mount(createDiv())

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
    const vm = new VM(`<div><button type="button" v-shortkey.push="['p']" @shortkey="foo()">BUTTON</button></div>`)
    vm.$mount(createDiv())

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
    const vm = new VM(`<button @shortkey="foo" v-shortkey="['del']"></button>`)
    vm.$mount(createDiv())

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
    const vm = new VM(`<button @shortkey="foo" v-shortkey="['shift', '?']"></button>`)
    vm.$mount(createDiv())

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

  it("Update the binding", (done) => {
    const vm = VM(`<div>
                      <div v-if="!called" class="first" @shortkey="foo" v-shortkey="[\'q\']">foo</div>
                      <div v-else         class="test"  @shortkey="bar" v-shortkey="[\'g\']">bar</div>
                    </div>`)
    vm.$mount(createDiv())
    const keydown = createEvent('keydown')
    keydown.key = 'q'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keydown.key = 'q'
    document.dispatchEvent(keyup)

    expect(vm.called).to.be.true
    Vue.nextTick(() => {
      const keydown2 = createEvent('keydown')
      keydown2.key = 'g'
      document.dispatchEvent(keydown2)

      const keyup2 = createEvent('keyup')
      keydown2.key = 'g'
      document.dispatchEvent(keyup2)

      expect(vm.calledBubble).to.be.true
      vm.$destroy()
      done()
    })
  })

  it('Prevent bubble event', () => {
    const vm = new VM('<div @shortkey="bar" v-shortkey="[\'a\']"><button type="button" @shortkey="foo" v-shortkey="[\'b\']">TEST</button></div>')
    vm.$mount(createDiv())

    const textarea = vm.$el.querySelector('button')
    const keydown = createEvent('keydown')
    keydown.key = 'b'
    document.dispatchEvent(keydown)

    expect(vm.called).to.be.true
    expect(vm.calledBubble).to.be.false
    vm.$destroy()
  })
})
