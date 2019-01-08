# HID Scanner

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

## Get started
1. Execute:

    ```sh
    npm start
    ```

2. Scan QRCode with your scanner!
