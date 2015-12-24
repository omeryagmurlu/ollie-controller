#!/bin/bash

npm install

MACHINE_TYPE=`uname -m`

mkdir src
if [ "$(uname)" == "Darwin" ]; then
    # I doubt that code below is working, I dont' have a mac to test on      
	echo Mac
	if [ ${MACHINE_TYPE} == 'x86_64' ]; then
		wget -O nw.tar.gz http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-darwin-x64.tar.gz
	else
		wget -O nw.tar.gz http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-darwin-x86.tar.gz
	fi
	tar xvzf nw.tar.gz -C src
	rm nw.tar.gz
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under GNU/Linux platform
	echo Linux
	if [ ${MACHINE_TYPE} == 'x86_64' ]; then
		wget -O nw.tar.gz http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz
	else
		wget -O nw.tar.gz http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x86.tar.gz
	fi
	tar xvzf nw.tar.gz -C src
	rm nw.tar.gz
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
	echo Win
	echo "I don't have any time to write the batch code for this OS(!)"
    # Do something under Windows NT platform
fi

(cd node_modules/noble/node_modules/bluetooth-hci-socket; nw-gyp configure --target=0.12.3; nw-gyp build )

sudo setcap cap_net_raw+eip src/*/nw

./src/*/nw .
