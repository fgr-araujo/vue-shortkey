import './Pollyfills'
import find from  'array.prototype.find'
import {expect} from 'chai'
import {createApp, nextTick} from 'vue'
import Shortkey from '../src/index.js'

find.shim()

const VM = template => createApp({
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
}).use(Shortkey, { prevent: ['.disableshortkey', '.disableshortkey textarea'] })

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
      const root = vm.mount(createDiv())

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
      vm.unmount()
    })

    it('unbind simple events', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'q\']"></div>')
      const root = vm.mount(createDiv())

      vm.unmount()

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
    });

    it('listen for keydown and dispatch event with object key', (done) => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"></div>')
      const stubFoo = sinon.stub(vm._component.methods, 'foo').callsFake(fn => {
        expect(fn.srcKey).to.equal('option1')
        stubFoo.restore()
        vm.unmount()
        done()
      })
      const root = vm.mount(createDiv())

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
    })

    it('unbind event with object key', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"></div>')
      const root = vm.mount(createDiv())
      vm.unmount()

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
    })
  })


  describe('Don`t dispatch triggered event', () => {
    it('dont trigger listen for keydown and dispatch event', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea v-shortkey.avoid></textarea></div>')
      const root = vm.mount(createDiv())

      const textarea = root.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
      vm.unmount()
    })

    it('does not trigger events when its class is in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea class="disableshortkey"></textarea></div>')
      const root = vm.mount(createDiv())

      const textarea = root.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
      vm.unmount()
    })

    it('does not trigger events when one of its classes is in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']"><textarea class="disableshortkey stylingclass"></textarea></div>')
      const root = vm.mount(createDiv())

      const textarea = root.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
      vm.unmount()
    })

    it('does not trigger events when it gets matched by one item in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']" class="disableshortkey"><textarea class="stylingclass"></textarea></div>')
      const root = vm.mount(createDiv())

      const textarea = root.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
      vm.unmount()
    })

    it('does trigger events when only the parent element gets matched by one item in the prevent list', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="[\'b\']" class="disableshortkey"><input type="text" /></div>')
      const root = vm.mount(createDiv())

      const input = root.$el.querySelector('input')
      input.focus()
      expect(document.activeElement == input).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'b'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'b'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
      vm.unmount()
    })

    it('listen for keydown and dispatch event with object key', () => {
      const vm = new VM('<div @shortkey="foo" v-shortkey="{option1: [\'q\'], option2: [\'a\']}"><textarea v-shortkey.avoid></textarea></div>')
      const root = vm.mount(createDiv())

      const textarea = root.$el.querySelector('textarea')
      textarea.focus()
      expect(document.activeElement == textarea).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'q'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'q'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.false
      vm.unmount()
    })
  })

  describe('Dispatch triggered event', () => {

    it('trigger listen for keydown and propagte event to all listeners when modifier is present', () => {
      const vm = new VM(`<div>
        <button type="button" class="foo" @shortkey="foo" v-shortkey.propagte="[\'c\']">FOO</button>
        <button type="button" class="bar" @shortkey="bar" v-shortkey.propagte="[\'c\']">BAR</button>
      </div>`)
      const root = vm.mount(createDiv())

      const buttonFoo = root.$el.querySelector('button.foo')
      buttonFoo.focus()
      expect(document.activeElement == buttonFoo).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'c'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'c'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
      //expect(root.calledBubble).to.be.true
      vm.unmount()
    })

    it('trigger listen for keydown and propagte event to all listeners when modifier is present on the first element', () => {
      const vm = new VM(`<div>
        <button type="button" class="foo" @shortkey="foo" v-shortkey.propagte="[\'c\']">FOO</button>
        <button type="button" class="bar" @shortkey="bar" v-shortkey="[\'c\']">BAR</button>
      </div>`)
      const root = vm.mount(createDiv())

      const buttonFoo = root.$el.querySelector('button.foo')
      buttonFoo.focus()
      expect(document.activeElement == buttonFoo).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'c'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'c'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
      //expect(root.calledBubble).to.be.true
      vm.unmount()
    })

    it('trigger listen for keydown and propagte event to all listeners when modifier is present on the last element', () => {
      const vm = new VM(`<div>
        <button type="button" class="foo" @shortkey="foo" v-shortkey="[\'c\']">FOO</button>
        <button type="button" class="bar" @shortkey="bar" v-shortkey.propagte="[\'c\']">BAR</button>
      </div>`)
      const root = vm.mount(createDiv())

      const buttonFoo = root.$el.querySelector('button.foo')
      buttonFoo.focus()
      expect(document.activeElement == buttonFoo).to.be.true

      const keydown = createEvent('keydown')
      keydown.key = 'c'
      document.dispatchEvent(keydown)

      const keyup = createEvent('keyup')
      keyup.key = 'c'
      document.dispatchEvent(keyup)

      expect(root.called).to.be.true
      //expect(root.calledBubble).to.be.true
      vm.unmount()
    })

  })

  it('Setting focus with .focus modifier', () => {
    const vm = new VM(`<div><input type="text" /> <button type="button" v-shortkey.focus="['f']">BUTTON</button></div>`)
    const root = vm.mount(createDiv())

    const inputText = root.$el.querySelector('input')
    inputText.focus()
    expect(document.activeElement == inputText).to.be.true

    const keydown = createEvent('keydown')
    keydown.key = 'f'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'f'
    document.dispatchEvent(keyup)

    const buttonInput = root.$el.querySelector('button')
    expect(document.activeElement == buttonInput).to.be.true
    vm.unmount()
  })

  it('Bring push button with .push modifier', () => {
    const vm = new VM(`<div><button type="button" v-shortkey.push="['p']" @shortkey="foo()">BUTTON</button></div>`)
    const root = vm.mount(createDiv())

    const spyFoo = sinon.spy(root, 'foo')

    const keydown = createEvent('keydown')
    keydown.key = 'p'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'p'
    document.dispatchEvent(keyup)

    expect(spyFoo.callCount).to.equal(2)
    spyFoo.restore()
    vm.unmount()
  })

  it('Testing delete key', () => {
    const vm = new VM(`<button @shortkey="foo" v-shortkey="['del']"></button>`)
    const root = vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.key = 'Delete'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.key = 'Delete'
    document.dispatchEvent(keyup)

    expect(root.called).to.be.true
    vm.unmount()
  })

  it('Testing ? key', () => {
    const vm = new VM(`<button @shortkey="foo" v-shortkey="['shift', '?']"></button>`)
    const root = vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.shiftKey = true
    keydown.key = '?'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keydown.shiftKey = true
    keydown.key = '?'
    document.dispatchEvent(keyup)

    expect(root.called).to.be.true
    vm.unmount()
  })

  it("Update the binding", (done) => {
    const vm = VM(`<div>
                      <div v-if="!called" class="first" @shortkey="foo" v-shortkey="[\'q\']">foo</div>
                      <div v-else         class="test"  @shortkey="bar" v-shortkey="[\'g\']">bar</div>
                    </div>`)
    const root = vm.mount(createDiv())
    const keydown = createEvent('keydown')
    keydown.key = 'q'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keydown.key = 'q'
    document.dispatchEvent(keyup)

    expect(root.called).to.be.true
    nextTick(() => {
      const keydown2 = createEvent('keydown')
      keydown2.key = 'g'
      document.dispatchEvent(keydown2)

      const keyup2 = createEvent('keyup')
      keydown2.key = 'g'
      document.dispatchEvent(keyup2)

      expect(root.calledBubble).to.be.true
      vm.unmount()
      done()
    })
  })

  it('Prevent bubble event', () => {
    const vm = new VM('<div @shortkey="bar" v-shortkey="[\'a\']"><button type="button" @shortkey="foo" v-shortkey="[\'b\']">TEST</button></div>')
    const root = vm.mount(createDiv())

    const textarea = root.$el.querySelector('button')
    const keydown = createEvent('keydown')
    keydown.key = 'b'
    document.dispatchEvent(keydown)

    expect(root.called).to.be.true
    expect(root.calledBubble).to.be.false
    vm.unmount()
  })
})
