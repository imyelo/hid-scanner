# HID Scanner
> :flashlight: Node.js Library for HID Code Scanner

## Installation
### For Linux
1. `libsub` is required

    ```sh
    sudo apt install libusb-1.0-0 libusb-1.0-0-dev
    ```

    see https://github.com/node-hid/node-hid/#compiling-from-source

2. Build from source

    ```sh
    npm install --build-from-source --driver=libusb
    ```

3. Link to global

    ```sh
    npm link
    ```


## Usage of cli
### Basic
1. Execute:

    ```sh
    hid-scanner
    ```

    or

    ```sh
    sudo node ./bin/hid-scanner
    ```

2. Scan QRCode with your scanner!

### List devices
```sh
hid-scanner --devices
```

### Use another hid device (with other product name)
```sh
hid-scanner <product-name>
```

e.g.:

```sh
hid-scanner "MY SUPERB HID PRODUCT"
```

### More information
```sh
hid-scanner --help
```

## Usage of library
```javascript
const Scanner = require('hid-scanner') // not availale on npm currently, but just for an example here
const scanner = new Scanner('SM-2D PRODUCT HID KBW')
/**
 * or:
 *    const scanner = new Scanner(Scanner.devices()[0])
 */

let string = ''
scanner.on('char', (char) => {
  if (char === '\n') {
    console.log(string)
    string = ''
    return
  }
  string += char
})
```


## Test
```sh
npm test
```

### Generate HEX fixture for testing
```sh
./test/helpers/generate-hex.js <product-name>
```

e.g.:

```sh
./test/helpers/generate-hex.js > ./test/fixtures/0.hex.txt
```


## License
MIT
