var DMX = require('dmx')
var ease = require('dmx/easing.js').ease
var A = DMX.Animation
module.exports = function(parent){
  return class Device {
    constructor(config){
      let inheritConfig = {}
      if(config.type && parent.deviceTemplates[config.type]) inheritConfig = parent.deviceTemplates[config.type]
      this.name = config.name
      this.reactSound = config.reactSound || inheritConfig.reactSound
      this.isRgb = config.isRgb || inheritConfig.isRgb
      this.getDur = false
      this.hidePrograms = (config.hidePrograms || [] ).concat(inheritConfig.hidePrograms || [])
      this.preDefined = ['blackout','stopAnimation']
      this.universe = parent.getUniverse(config.universe || 0)
      this.channels = config.channels || inheritConfig.channels || ['dim']
      this.startChannel = config.startChannel || 1
      this.animation = undefined
      this.animate = []
      this.programs = []
      if(inheritConfig.programs){
        this.programs = Object.keys(inheritConfig.programs)
        for(let program of Object.keys(inheritConfig.programs)){
          this[program] = inheritConfig.programs[program]
        }
      }
      if(config.programs){
        this.programs = this.programs.concat(Object.keys(config.programs))
        for(let program of Object.keys(config.programs)){
          this[program] = config.programs[program]
        }

      }
    }
    setChannels(channels){
      let opt = this.getChannelData(channels)
      this.universe.update(opt)
      return this
    }
    getPrograms(){
      if(!this.hidePrograms) return this.preDefined.concat(this.programs)
      return this.preDefined.concat(this.programs.filter(x => this.hidePrograms.indexOf(x) == -1))
    }
    getChannelState(){
      let obj = {}
      this.channels.forEach((channel,i) => {
        obj[channel] = this.universe.get(i + this.startChannel)
      })
      return obj
    }
    getChannelData(channels){
      let opt = {}
      if( channels instanceof Array) channels.forEach((channel,i) => {
        opt[i + this.startChannel] = channel
      })
      else this.channels.forEach((channel,i) => {
        if(channels[channel]) opt[i + this.startChannel] = channels[channel]
      })
      return opt
    }
    set(channel,value,easing){
      return this.dim(channel,value,1,easing)
    }
    delay(duration){
      this.animate.push({duration: duration || 1})
      return this
    }
    dim(channel,value,duration = 100,easing = 'linear'){
      let opt = {}
      if(channel instanceof Array || channel instanceof Object){
        opt = this.getChannelData(channel)
      } else if( typeof channel === 'string') opt[this.channels.indexOf(channel) + this.startChannel] = value
      else opt[channel + this.startChannel] = value
      this.animate.push({to: opt, duration: duration,options:{easing:easing}})
      return this
    }
    execute(funct){
      this.animate.push({execute: funct, duration: 1})
      return this
    }
    stopAnimation(){
      if(this.currentAnimation){
        this.currentAnimation.stop()
        return this.getChannelState()
      }
    }
    blackout(){
      this.setChannels(this.channels.map(x => 0))
      this.stopAnimation()
      return this.getChannelState()
    }
    run(onFinish){
      if(this.getDur){
        let dur = 0
        this.animate.forEach(x => {
          if(x.duration) dur += x.duration
        })
        this.animate = []
        return dur
      }
      this.currentAnimation = new A()

      this.currentAnimation.run = function(universe, onFinish) {
        var config = {}
        var t = 0
        var d = 0
        var resolution = 1
        var a

        var fx_stack = this.fx_stack;
        var ani_setup = function() {
          a = fx_stack.shift()
          t = 0
          if(a.execute) a.execute()
          d = a.duration
          config = {}
          for(var k in a.to) {
            config[k] = {
              'start': universe.get(k),
              'end':   a.to[k]
            }
          }
        }
        var ani_step = function() {
          var new_vals = {}
          for(var k in config) {
            new_vals[k] = Math.round(config[k].start + ease['linear'](t, 0, 1, d) * (config[k].end - config[k].start))
          }
          t = t + resolution
          universe.update(new_vals)
          if(t > d) {
            if(fx_stack.length > 0) {
              ani_setup()
            } else {
              clearInterval(iid)
              if(onFinish) onFinish()
            }
          }
        }

        ani_setup()
        var iid = this.interval = setInterval(ani_step, resolution)
      }

      this.currentAnimation.fx_stack = this.animate
      let self = this
      this.currentAnimation.run(this.universe, () => {
        self.animate = []
        delete self.currentAnimation
        if(onFinish) onFinish()
      })
    }
  }
}
