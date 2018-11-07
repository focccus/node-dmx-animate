var DMX = require('dmx')
var ease = require('dmx/easing.js').ease
var A = DMX.Animation
var Device = require('./Device.js')
var Group = require('./Group.js')
var dmx = new DMX()
var deviceTemplates = require('./devices')
module.exports = class {
  constructor(config){
    this.seqences = config.seqences || {}
    if(config.universes){
      this.universes = []
      config.universes.forEach(x => {
        if(x.name && x.driver && x.serialPath && !this.universes[x.name]) this.universes[x.name] = (dmx.addUniverse(x.name, x.driver, x.serialPath))
      })
    }
    this.dmx = dmx
    this.animate = A
    this.devices = config.sequences || []
    this.Device = Device(this)
    this.Group = Group(this)
  }
  addDevices(devices,universe = 0){
    return devices.map(x => this.addDevice(x,universe))
  }
  addDevice(device,universe = 0){
    device.universe = universe
    if(!(device instanceof this.Device || device instanceof this.Group)) device = new this.Device(device)
    this.devices.push(device)
    return device
  }
  addSequence(name,funct,config = {}){
    this.seqences[name] = config
    if(!config.duration){
      this.devices.forEach(x => x.getDur = true)
      try {
        this.seqences[name].duration = funct()
      } catch(err){
        this.seqences[name].duration = 100
      }
      this.devices.forEach(x => x.getDur = false)
    }
    this.seqences[name].run = funct
    return this.seqences
  }
  runSeq(name,...args){
    if(this.seqences[name]){
      this.seqences[name].run(...args)
      return true
    }
    return false
  }
  stopSeq(name){
    let seq = this.seqences[name]
    if(!seq || !seq.onStop) return false
    seq.onStop.forEach(device => {
      device.stopAnimation()
      device.blackout()
    })
    return true
  }
  getUniverse(universe){
    if(universe >= 0) return Object.values(this.universes)[universe]
    if(universe.substr) return  this.universes[universe]
    return universe
  }
  getUniverseString(universe){
    if(universe >= 0) return Object.keys(this.universes)[universe]
    if(typeof universe == 'string') return  universe
    return Object.keys(this.universes).find(key => this.universes[key] === universe);
  }
}
module.exports.devices = deviceTemplates
