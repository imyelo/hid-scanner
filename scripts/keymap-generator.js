#!/usr/bin/env node
'use strict'

const debug = require('debug')('hid:scripts')
const meow = require('meow')
const fs = require('fs-extra')
const path = require('path')
const got = require('got')
const cheerio = require('cheerio')

const TABLE_URL = 'https://source.android.com/devices/input/keyboard-devices.html'

const CACHE_PATH = path.join(__dirname, '.keymap-generator.cache.json')
const KEYMAP_PATH = path.resolve(__dirname, '../lib/keymap.raw.json')

const cli = meow(`
  Usage
    $ ./scripts/update-keymap.js


  Options
    --from-cache, -c  Fetch data from cache instead of network


  Examples
    $ ./scripts/update-keymap.js --from-cache

`, {
  description: 'HID Keymap generator',
  flags: {
    fromCache: {
      type: 'boolean',
      alias: 'c',
    },
  },
})

function chars (row) {
  let usageName = row['HID Usage Name']
  let keyName = row['Linux Key Code Name']
  let matched

  matched = usageName.match(/^Keyboard (.)(?: and (.))?$/)
  if (matched) {
    return matched.slice(1).filter(Boolean)
  }

  matched = usageName.match(/^Keyboard Non-US (.)(?: and (.))?$/)
  if (matched) {
    return matched.slice(1).filter(Boolean)
  }

  matched = usageName.match(/^Keypad (.)(?: and (.))?$/)
  if (matched) {
    return matched.slice(1).filter(Boolean)
  }

  if (keyName === 'KEY_TAB') {
    return ['\t']
  }
  if (keyName === 'KEY_SPACE') {
    return [' ']
  }
  if (keyName === 'KEY_ENTER') {
    return ['\n']
  }

  return []
}

async function fetch (fromCache = false) {
  if (fromCache) {
    debug('fetch from cache')
    return await fs.readJSON(CACHE_PATH)
  }

  debug('fetch from network')
  const response = await got(TABLE_URL)
  const $ = cheerio.load(response.body)
  const table = $('#hid-keyboard-and-keypad-page-0x07').next('table').eq(0)
  const keys = table.find('thead tr th').map(function () {
    return $(this).text().trim()
  }).get()
  let data = table.find('tbody tr').map(function () {
    let row = {}
    $(this).find('td').each(function (i) {
      row[keys[i]] = $(this).text().trim()
    })
    return row
  }).get()
  await fs.writeJSON(CACHE_PATH, data)

  return data
}

;(async () => {
  let data = await fetch(cli.flags.fromCache)

  data = data.filter((row) => row['Linux Key Code Name'] && row['HID Usage'].length === 11)

  data = data.map((row) => ({
    hid: row['HID Usage'].slice(-2),
    name: row['Linux Key Code Name'],
    chars: chars(row),
  }))

  let keymap = {}
  data.forEach(({ hid, name, chars }) => {
    keymap[hid] = {
      name,
      chars,
    }
  })

  await fs.writeJSON(KEYMAP_PATH, keymap, { spaces: '  ' })

  process.stdout.write('Keymap updated.')
})()
