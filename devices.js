module.exports = {
  "rbg-led-par56":function(config){
    return {
      name: config.name,
      isRgb: true,
      channels: ['r','g','b','dimmer','effect'],
      startChannel: config.startChannel,
      programs: {
        setColor: function(r = 0,g = 0,b = 0,intense = 255){
          return this.setChannels([r,g,b,intense])
        },
        dance: function(speed = 450){
          let self = this
          this.danceTimer = setInterval(() => {
            self.set([Math.random() * 254 - 1,Math.random() * 254 - 1,Math.random() * 254 - 1]).run()
          },Math.random() * speed - 50)
          return this.getChannelState()
        },
        stopDance: function(){
          clearInterval(this.danceTimer)
          return this.getChannelState()
        }
      },
      hidePrograms: ['setColor']
    }
  },
  "basic-rgb":function(config){
    return {
      name: config.name,
      isRgb: true,
      channels: ['r','g','b'],
      startChannel: config.startChannel,
      programs: {
        setColor: function(r = 0,g = 0,b = 0,intense = 255){
          intense = intense / 255
          return this.setChannels([r * intense,g * intense,b * intense])
        }
      },
      hidePrograms: ['setColor']
    }
  },
  "basic-dimmer":function(config){
    return {
      name: config.name,
      isRgb: true,
      channels: ['r','g','b'],
      startChannel: config.startChannel,
      programs: {
        dimOut: function(time = 2000){
          return this.dim(0,0,time).run()
        },
        dimIn: function(value = 255, time = 2000){
          return this.dim(0,value,time).run()
        }
      },
      hidePrograms: ['setColor']
    }
  }
}
