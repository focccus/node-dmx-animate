
module.exports = function(parent){
  return class Group {
    constructor(devices,config = {}){
      this.devices = devices
      this.name = config.name
      this.preDefined = ['blackout','stopAnimation']
      this.hidePrograms = config.hidePrograms
      this.channels = devices[0].channels
      this.isRgb = config.isRgb
      this.isGroup = true
      this.universe = parent.getUniverse(config.universe || 0)
      if(config.programs){
        this.programs = Object.keys(config.programs)
        for(let program of Object.keys(config.programs)){
          this[program] = config.programs[program]
        }
      }
    }
    setChannels(channels){
      this.devices.forEach(device => device.setChannels(channels))
      return this
    }
    getChannelState(){
      return this.devices[0].getChannelState()
    }
    getPrograms(){
      if(!this.hidePrograms) return this.preDefined.concat(this.programs)
      return this.preDefined.concat(this.programs.filter(x => this.hidePrograms.indexOf(x) < 0))
    }
    set(channel,value,easing){
      this.devices.forEach(device => device.dim(channel,value,1,easing))
      return this
    }
    delay(duration){
      this.devices.forEach(device => device.delay(duration))
      return this
    }
    dim(channel,value,duration = 100,easing = 'linear'){
      this.devices.forEach(device => device.dim(channel,value,duration,easing))
      return this
    }
    stopAnimation(){
        this.devices.forEach(device => device.stopAnimation())
    }
    blackout(){
      this.devices.forEach(device => device.blackout())
    }
    execute(funct){
      this.devices[0].execute(funct)
      return this
    }
      run(onFinish = ()=>{}){
        this.devices.forEach((device,i) => device.run(i = this.devices.length - 1 ? onFinish : ()=>{}))
        return this
      }
  }
}
