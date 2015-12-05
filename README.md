##Ollie Controller

##Important

* You need to [rebuild](https://github.com/nwjs/nw.js/wiki/build-native-modules-with-nw-gyp) bluetooth-hci-socket module in noble module in olliejs module for this module to work. (I will make a script for this sometime)
* To run without sudo (I haven't tested this on other distros or Mac or Windows) you have to enter the following command in ~/.nwjs after nwjs creates .nwjs directory. (I will make a script for this sometime)

```sh
sudo setcap cap_net_raw+eip $(eval readlink -f `which nw`)
```

* Running without sudo is highly encouraged, otherwise you may face unwanted folders in your project folder.
* After you clone the repo/get the repo from npm to a folder and run ```npm install```, start the controller with ```npm start```.

##Screenshots

![](/../screenshots/1.png?raw=true)
