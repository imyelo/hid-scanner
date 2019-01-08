const scanner = require('./scanner')

scanner.on('char', (char) => {
  process.stdout.write(char)
})

scanner.on('error', (error) => console.error(error))
