#!/bin/bash

npm install

if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform       
	echo Mac 
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under GNU/Linux platform
	echo Linux
	wget -O nw.tar.gz http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz
	tar xvzf nw.tar.gz -C src
	rm nw.tar.gz
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
	echo Win
    # Do something under Windows NT platform
fi

(cd node_modules/olliejs/node_modules/noble/node_modules/bluetooth-hci-socket; nw-gyp configure --target=0.12.3; nw-gyp build )

sudo setcap cap_net_raw+eip src/*/nw

./src/*/nw .
