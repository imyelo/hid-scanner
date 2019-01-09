const KEYMAP = require('./keymap.raw.json')

let KEYS = {
  UNRECOGNIZED_KEY: 'UNRECOGNIZED_KEY',
  UNDEFINED_KEY: 'UNDEFINED_KEY',
}
Object.values(KEYMAP).forEach(({ name }) => KEYS[name] = name)

exports.SIGNAL = {
  '00': 0,
  '02': 1,
}

exports.KEYMAP = KEYMAP
exports.KEYS = KEYS
