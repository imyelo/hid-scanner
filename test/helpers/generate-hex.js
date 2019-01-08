#!/usr/bin/env node
'use strict'

const HID = require('node-hid')
const meow = require('meow')

/**
 * The product name of your hid-kb device
 */
const PRODUCT = 'SM-2D PRODUCT HID KBW'

const cli = meow(`
  Usage
    $ ./test/helpers/generate-hex.js <product-name>


  Example
    $ ./test/helpers/generate-hex.js > ./test/fixtures/0.hex.txt
    # Then scan code with your scanner

`)
const product = cli.input[0] || PRODUCT

const device = HID.devices().find((device) => device.product === product)

if (!device) {
  throw new Error('Cannot find device')
}

const hid = new HID.HID(device.path)

hid.on('data', (data) => {
  process.stdout.write(data.toString('hex') + '\n')
})
