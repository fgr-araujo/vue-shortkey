import {expect} from 'chai'
import Shortkey from '../src/index.js'

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
    })

    it('Return a combined key', () => {
      expect(Shortkey.decodeKey({altKey: true, key: 'a'})).to.equal('alta')
      expect(Shortkey.decodeKey({altKey: true, ctrlKey: true, key: 'a'})).to.equal('ctrlalta')
    })
  })
})
