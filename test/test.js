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

const macro = {
  async keymap (t, filename, expected) {
    const { scanner, hid } = t.context

    let string = ''
    scanner.on('char', (char) => {
      string += char
    })
    scanner.on('error', () => {}) // TODO: remove it

    const hexes = await fixture(filename)
    hexes.split('\n').forEach((hex) => {
      hid.emit('data', Buffer.from(hex, 'hex'))
    })

    t.is(string, expected)
    t.pass()
  },
}

test.serial('keymap 1', macro.keymap, '1.hex.txt', 'httpsmnznnetsodacdSD01234567')
// test.serial('keymap', macro.keymap, '1.hex.txt', 'https://mnzn.net/sod/ac/d/SD01234567') // TODO: use instead
test.serial('keymap 2', macro.keymap, '2.hex.txt', 'httpsgithubcomimyelotaboverviewfrom20181201to20181231')
// test.serial('keymap', macro.keymap, '2.hex.txt', 'https://github.com/imyelo?tab=overview&from=2018-12-01&to=2018-12-31') // TODO: use instead
