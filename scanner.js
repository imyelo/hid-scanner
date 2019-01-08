const debug = require('debug')('hid')
const HID = require('node-hid')
const { EventEmitter } = require('events')
const { KEYMAP, SIGNAL } = require('./keymap')

/**
 * The product name of your hid-kb device
 */
const PRODUCT = 'SM-2D PRODUCT HID KBW'

/**
 * The event bus of keyboard for outputing chars
 */
const bus = new EventEmitter()

const devices = HID.devices()
debug(devices)

const device = devices.find((device) => device.product === PRODUCT)

if (!device) {
  throw new Error('Cannot find device')
}

const hid = new HID.HID(devices[0].path)

hid.on('data', (data) => {
  try {
    const code = Buffer.from([data[2]]).toString('hex')
    const signal = Buffer.from([data[0]]).toString('hex')
    const char = KEYMAP[code][SIGNAL[signal]]
    debug('HID Data:', data, code, signal, char)
    bus.emit('char', char)
  } catch (error) {
    error.data = data
    debug('HID Data parse failed:', error)
    bus.emit('error', error)
  }
})

module.exports = bus
