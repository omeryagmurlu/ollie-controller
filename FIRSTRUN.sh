#!/bin/bash

npm install

(cd node_modules/olliejs/node_modules/noble/node_modules/bluetooth-hci-socket; nw-gyp configure --target=0.12.3; nw-gyp build )

sudo setcap cap_net_raw+eip src/linux/nw

./src/linux/nw .
