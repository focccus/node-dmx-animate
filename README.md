# node-dmx-animate
A wrapper for [wiedi's node-dmx](https://github.com/wiedi/node-dmx) with some easier controls and animation presets. With this libary you can control DMX devices using node.js and animate them easily.
There is also a http Server with an api and a premade Webinterface for this libary: [dmx-animate-web]()

## Installation
For this libary you need to have [node.js](http://nodejs.org) and npm installed on your machine. ([Tutorial](https://treehouse.github.io/installation-guides/windows/node-windows.html))
Then just run in your console:
```
npm i dmx-animate --save
```
## Get started
Create a new javascript file in your folder and require `dmx-animate`:
```js
const dmxAnimate = require('dmx-animate')

var dmx = new dmxAnimate({
  universes: [
    {name: 'demo', driver: null, serialPath: 'COM7'}
  ]
})
```
Then initialize an universe like that.
* `name` - String : The name of the universe
* `device`- String, referring a registered driver
*   `device_id`  - Number or Object(windows: `COM[number]`, linux: `'/dev/cu.usbserial-6AVNHXS8'`)

These drivers are registered by default currently:
-   null: a development driver that prints the universe to stdout
-   artnet: driver for EnttecODE
-   bbdmx: driver for  [BeagleBone-DMX](https://github.com/boxysean/beaglebone-DMX)
-   dmx4all: driver for DMX4ALL devices like the "NanoDMX USB Interface"
-   enttec-usb-dmx-pro: a driver for devices using a Enttec USB DMX Pro chip like the "DMXKing ultraDMX Micro".
-   enttec-open-usb-dmx: driver for "Enttec Open DMX USB". This device is NOT recommended, there are known hardware limitations and this driver is not very stable. (If possible better obtain a device with the "pro" chip)
-   dmxking-utra-dmx-pro: driver for the DMXKing Ultra DMX pro interface. This driver support multiple universe specify the options with Port = A or B

Once you have created the instance of dmx-animate and choosen the driver, you can start adding devices:

## Devices
The dmx universe is made of devices. Register a new device by...
* calling a new instance of `new dmx.Device(options)`
* adding it using the function `dmx.addDevice(options,(universe))`
* adding multiple using `dmx.addDevices([options1,options2,...],(universe))`

(optionally add the universe to dmx.addDevice)

`options` is a object with some necessary keys: [optional]
| options | explanation |
|--|--|
| name | String - the unique name for the device |
|startChannel| number - the channel number on witch the device is registered |
|channels|Array - a list of labeled channels the device uses|
|[type]|String - use a preset|
|[programs]|Object - adds javascript functions to the device instance|
|[universe]|insert the universe index, name or instance; default to 0|

### Example:
```js
var rgbDevice = dmx.addDevice({
	name: 'basic-rgb',
	startChannel: 4,
	channels: ['r','g','b']
})
```
There are a few functions and properties on this new object. Take a look at [Functionality](#functions)

### Device presets
I made some preset devices already for you to use.
You can inherit a preset by using the `type` property. The presets can be found at [devices.js](#)

**Important**: The `channels` property is no longer required, but the name and startChannel obviously are. You can still overwrite channels, programs etc.

**Example**:
```js
var rgbDevice = dmx.addDevice({
	type: 'basic-rgb',
	name: 'basic-rgb',
	startChannel: 4
})
```
| device name | description |
|--|--|
| rbg-led-par56 | A 5 channel rgb par |
|basic-rgb|basic 3 channel rgb device |
|basic-dimmer|basic 1 channel device|
|4ch-dimmer|dimmer with 4 channels, used for dimmer packs|
|mania-scx500|a scanner with some color functionality|
Feel free to commit to this device list via pull Request.

And you can add presets yourself at the top of the code to use it elsewhere:
```js
dmx.deviceTemplates[name] = {
	channels: ['r','g','b'],
	programs: {

	}
	...
}
```
### Programs
Programs are ways to add shortcuts for certain actions to a device.
They are defined as a **function** in the programs object like this:
```js
var dimmer = dmx.addDevice({
	channels: ['value'],
    programs: {
      dimIn: function(time = 2000){
        return this.dim(0,255,time).run()
      }
    }
})
```
You can then run this program by:
```js
dimmer.dimIn(1000)
```
In the function you have access to the device and its native functions by using `this` and you can insert arguments like `time`.
**Important** : For the http api it is important to **return** the current state (consider `return this.getState()` too)
## Groups
Groups are a way to group multiple devices together and control them all at once.
Initialize an instance with `new dmx.Group(devices, options)`
or `dmx.addDevice(new dmx.Group(devices, options))` to use it with the http api.

The group must have its **own** `name` property and can have seperate `programs`
**Example:**
```js
var group = dmx.addDevice( new Group([rgbDevice, dimmer], {
	name: 'device-group',
	programs: {
		allOneOn: function(){
			this.devices[0].setChannels([255,255,255])
		}
	}
}) )
```
In the programs you can access the whole group with `this` again and then an array of devices with `this.devices`.

The groups have the same methods as the devices, but just apply it to every device.
## Methods and Functionality
Enough of setting up! Here we'll talk about controlling your set up devices and universes actually.
**dmx.getUniverse(name)**

Returns the node-dmx universe object

**dmx.getUniverse(name).update(object)**

Update single channels of a universe
* `object`  - Object containing the channels as keys and values

**dmx.nodeDmx**

Get the original node-dmx instance and perform actions: [node-dmx](https://github.com/wiedi/node-dmx#library-api)

**Device.setChannels(channels)**

Updates the channels of a device.
`channels` can be:
* an Array of values in Order of the device channels
* a Object with channel-value pairs

**Device.set(channel, value)**

Sets a channel or more to a value or more. Part of animation.
`channel`  can be:
* String - the channel name
* Number - the channels index in Device.channels
* Array - an Array of values in Order of the device channels (value argument does not matter)
* Object - with channel-value pairs(value argument does not matter)

**Device.dim(channel, value,duration,[easing])**

Animates a channel/channels from the previous value to another in a given duration. Part of animation.
* `channel` - look at `Device.set`
* `duration`Number - the time it takes to animate in ms
* `easing`one of the following easing methods (optional)

All easing methods:
-   inear (default)
-   inQuad
-   outQuad
-   inOutQuad
-   inCubic
-   outCubic
-   inOutCubic
-   inQuart
-   outQuart
-   inOutQuart
-   inQuint
-   outQuint
-   inOutQuint
-   inSine
-   outSine
-   inOutSine
-   inExpo
-   outExpo
-   inOutExpo
-   inCirc
-   outCirc
-   inOutCirc
-   inElastic
-   outElastic
-   inOutElastic
-   inBack
-   outBack
-   inOutBack
-   inBounce
-   outBounce
-   inOutBounce

**Device.delay(duration)**

Delays the next step of the animation by the given `duration` in ms. Part of animation.

**Device.execute(callback)**

Executes a javascript function `callback` when reached in animation. Part of animation.
This can be used to animate multiple devices at one, log the progress or whatever.

Example: see below
**"Part of animation"**

Everything labeled "Part of animation" is not ran on run call, but can be chained e.g:
```js
dimmer
	.set(0,255)
	.dim(0, 130, 2000)
	.execute(() => {
		console.log('dim finished')
	})
	.delay(1000)
	.dim(0, 0,5000)
```
And to execute the whole chain of actions step by step, you need to run
**Device.run(callback)**

Part of animation. This starts the previous defined animation chain and calls the `callback` on Finish:
```js
dimmer.run(function() {
	console.log("Finished")
})
```
**Device.stopAnimation()**

Stops the current animation.

**Device.blackout()**

Sets all channels to 0.

**Device.getChannelState()**

Returns the current values for the given channels as Object.

**Device.getPrograms()**

Returns all defined programs for the device.
## Sequences
You can define a sequence of different actions, animations and programs with
**dmx.addSequence(name,function,[config])**

`name` String - The name of the sequence
`function` Javascript Function - This runs on sequence call
`config` Object - (optional) configuration e.g `{duration: 2000}`

If you return a animation object, it automatically calculates the duration for that.
Else wise configure it yourself.
You can also put arguments into your sequence function which can be inserted on call:

**dmx.runSeq(name, ...args)**

Runs the sequence with the name and inserts arguments.

**dmx.stopSeq(name)**

Stops a sequence again.
