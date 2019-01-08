# HID Scanner
> :flashlight: Node.js Library for HID Code Scanner


## Installation
```sh
# install as a cli
npm i @yelo/hid-scanner --build-from-source --driver=libusb -g
# or install as a dependency
npm i @yelo/hid-scanner --build-from-source --driver=libusb --save
```


## Usage
### CLI Usage
#### Basic
1. Execute:

    ```sh
    hid-scanner
    ```

2. Scan QRCode with your scanner!


#### List devices
```sh
hid-scanner --devices
```


#### Use another hid device (with other product name)
```sh
hid-scanner <product-name>
```

e.g.:

```sh
hid-scanner "MY SUPERB HID PRODUCT"
```


#### More information
```sh
hid-scanner --help
```


### Library Usage
```javascript
const Scanner = require('@yelo/hid-scanner')
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


## Development
### Local installation for Linux
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


### Testing
```sh
npm test
```


#### Generate HEX fixture for testing
```sh
./test/helpers/generate-hex.js <product-name>
```

e.g.:

```sh
./test/helpers/generate-hex.js > ./test/fixtures/0.hex.txt
```


## References
- https://gist.github.com/MightyPork/6da26e382a7ad91b5496ee55fdc73db2
- https://source.android.com/devices/input/keyboard-devices.html
- https://github.com/node-hid/node-hid/issues/228
- https://www.usb.org/document-library/hid-usage-tables-112


## License
MIT &copy; [yelo](https://github.com/imyelo), 2019 - present
