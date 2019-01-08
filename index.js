const scanner = require('./scanner')

scanner.on('char', (char) => {
  console.log(char)
})

scanner.on('error', (error) => console.error(error))
