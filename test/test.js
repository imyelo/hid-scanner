import test from 'ava'
import sinon from 'sinon'
import HID from 'node-hid'
import { EventEmitter } from 'events'
import fixture from './helpers/fixture'
import Scanner from '../lib/scanner'

test.beforeEach((t) => {
  const PRODUCT = 'FAKE'
  const stubs = {
    devices: sinon.stub(HID, 'devices'),
    hid: sinon.stub(HID, 'HID'),
  }
  const hid = new EventEmitter()

  stubs.devices.returns([{ product: PRODUCT }])
  stubs.hid.returns(hid)

  t.context.stubs = stubs
  t.context.hid = hid
  t.context.scanner = new Scanner(PRODUCT)
})

test.afterEach((t) => {
  t.context.stubs.devices.restore()
  t.context.stubs.hid.restore()
})

test('keymap', async (t) => {
  const { scanner, hid } = t.context

  let string = ''
  scanner.on('char', (char) => {
    string += char
  })
  scanner.on('error', () => {}) // TODO: remove it

  const hexes = await fixture('1.hex.txt')
  hexes.split('\n').forEach((hex) => {
    hid.emit('data', Buffer.from(hex, 'hex'))
  })

  t.is(string, 'httpsmnznnetsodacdSD01234567')
  // t.is(string, 'https://mnzn.net/sod/ac/d/SD01234567') // TODO: use instead

  t.pass()
})
