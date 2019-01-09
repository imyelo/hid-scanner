const debug = require('debug')('hid')
const HID = require('node-hid')
const { EventEmitter } = require('events')
const chain = require('@hspkg/chain')
const { KEYMAP, SIGNAL, KEYS } = require('./keymap')

const { UNRECOGNIZED_KEY, UNDEFINED_KEY } = KEYS

class Scanner extends EventEmitter {
  constructor (product) {
    super()

    const devices = this.constructor.devices()
    debug(devices)

    const device = devices.find((device) => device.product === product)

    if (!device) {
      throw new Error('Cannot find device')
    }

    const hid = new HID.HID(device.path)

    hid.on('data',(data) => {
      try {
        const code = Buffer.from([data[2]]).toString('hex')
        const signal = Buffer.from([data[0]]).toString('hex')
        const key = KEYMAP[code]
        const event = key ? {
          name: key.name || UNDEFINED_KEY,
          char: chain(key, `.chars.${SIGNAL[signal]}`, null),
          raw: data,
        } : {
          name: UNRECOGNIZED_KEY,
          char: null,
          raw: data,
        }
        this.emit('key', event)
        debug('HID Data:', data, code, signal, key, event)
      } catch (error) {
        error.data = data
        debug('HID Data parse failed:', error)
        this.emit('error', error)
      }
    })
  }

  static devices () {
    return HID.devices()
  }
}

module.exports = Scanner
