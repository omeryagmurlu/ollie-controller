##Ollie Controller

##Important

* You need to [rebuild](https://github.com/nwjs/nw.js/wiki/build-native-modules-with-nw-gyp) bluetooth-hci-socket module in noble module in olliejs module for this module to work. (I will make a script for this sometime)
* To run without sudo (I haven't tested this on other distros or Mac or Windows) you have to enter the following command in ~/.nwjs after nwjs creates .nwjs directory. (I will make a script for this sometime)

```sh
sudo setcap cap_net_raw+eip $(eval readlink -f `which nw`)
```

* Running without sudo is highly encouraged, otherwise you may face unwanted folders in your project folder.
* After you clone the repo/get the repo from npm to a folder and run ```npm install```, start the controller with ```npm start```.
* There might be some problems with OSX.

##Installing

* Clone this repository or ```npm install ollie-controller``` in a folder.
* Rebuild hci-socket or the alternative for your distro (OS) [for windows it is bluetooth-hci-socket] with nw-gyp.
* [Optional] grant bluetooth access to ```nw``` in ```~/.nwjs``` directory to use without sudo.
* Run with either:
	* ```nwjs .```
	* ```npm start```
	* ```./init.sh```

##[Screenshots](https://photos.google.com/share/AF1QipPIJ7by0HDT3CadOOfwpkgYTELoPh4nMvPTos-DzzvJVLd1ZEOA2KK8xXL2cpL0HQ?key=THVpMF9uVEN0Vl9uRG1tYTJhZF8xRmZCeWxaQkJB)

Blog Post (Turkish) [link](http://omeryagmurlu.github.io/ollie/2015/12/01/olliejs.html)
