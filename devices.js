
module.exports = {
  "rbg-led-par56":{
    isRgb: true,
    channels: ['r','g','b','dimmer','effect'],
    reactSound: ['r','g','b'],
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
  },
  "basic-rgb":{
    isRgb: true,
    channels: ['r','g','b'],
    reactSound: ['r','g','b'],
    programs: {
      setColor: function(r = 0,g = 0,b = 0,intense = 255){
        intense = intense / 255
        return this.setChannels([r * intense,g * intense,b * intense])
      }
    },
    hidePrograms: ['setColor']
  },
  "basic-dimmer":{
    channels: ['value'],
    reactSound: ['value'],
    programs: {
      dimOut: function(time = 2000){
        return this.dim(0,0,time).run()
      },
      dimIn: function(value = 255, time = 2000){
        return this.dim(0,value,time).run()
      }
    },
    hidePrograms: ['setColor']
  },
  "4ch-dimmer":{
    channels: ['1','2','3','4'],
    reactSound: ['1','2','3','4'],
    programs: {
      dimAllOut: function(time = 2000){
        return this.dim([0,0,0,0],undefined,time).run()
      },
      dimAllIn: function(value = 255, time = 2000){
        return this.dim([value,value,value,value],undefined,time).run()
      }
    },
    hidePrograms: ['setColor']
  },
  "mania-scx500":{
    channels: ['mode','dimmer','color','gobo','pan','tilt'],
    reactSound: ['pan','tilt'],
    programs: {
      setColor: function(color){
        let colors = {white: 3, blue: 15, orange: 27, red: 38,lightYellow: 50, pink: 63, midBlue: 75, lightRed: 87, lightGreen: 99, blue2: 110,pink2: 123,lightBlue: 135, yellow: 146, red2: 159,green: 170}
        this.setChannels({color: colors[color]})
        return this.getChannelState()
      },
      setwhite : function(){
        return this.setColor('white')
      },
      setblue : function(){
        return this.setColor('blue')
      },
      setorange : function(){
        return this.setColor('orange')
      },
      setred : function(){
        return this.setColor('red')
      },
      setgreen : function(){
        return this.setColor('green')
      },
      setlightYellow : function(){
        return this.setColor('lightYellow')
      },
      setpink : function(){
        return this.setColor('pink')
      },
      setmidBlue : function(){
        return this.setColor('midBlue')
      },
      setlightRed : function(){
        return this.setColor('lightRed')
      },
      setlightGreen : function(){
        return this.setColor('lightGreen')
      },
      setblue2 : function(){
        return this.setColor('blue2')
      },
      setpink2 : function(){
        return this.setColor('pink2')
      },
      setlightBlue : function(){
        return this.setColor('lightBlue')
      },
      setred2 : function(){
        return this.setColor('red2')
      },
    },
    hidePrograms: ['setColor']
  },
  "stairville Power Strobe 1500": {
    channels: ['freqency','dimmer'],
    reactSound: ['dimmer'],
    programs: {
      dimOut(dur = 1000){
        this.dim('dimmer',0,dur).run()
      }
    }
  },
  "eurolight ts-150": {
    channels:['pan','tilt','gobo','color','shutter','dimmer'],
    reactSound: ['pan','tilt'],
    programs: {
      setColor: function(color){
        let colors = {white: 25, blue: 130,darkorange: 80,lightorange: 190, orange: 210, red: 150,cyan: 220, rose: 40, lightGreen: 115,magenta: 100, yellow: 25, pink: 170,green: 60}
        this.setChannels({color: colors[color]})
        return this.getChannelState()
      },
      setwhite : function(){
        return this.setColor('white')
      },
      setblue : function(){
        return this.setColor('blue')
      },
      setorange : function(){
        return this.setColor('orange')
      },
      setred : function(){
        return this.setColor('red')
      },
      setgreen : function(){
        return this.setColor('green')
      },
      setyellow : function(){
        return this.setColor('yellow')
      },
      setpink : function(){
        return this.setColor('pink')
      },
      setmagenta : function(){
        return this.setColor('magenta')
      },
      setdarkorange : function(){
        return this.setColor('darkorange')
      },
      setlightGreen : function(){
        return this.setColor('lightGreen')
      },
      setlightorange : function(){
        return this.setColor('lightorange')
      },
      setcyan : function(){
        return this.setColor('cyan')
      },
      setrose : function(){
        return this.setColor('rose')
      },
    },
    hidePrograms: ['setColor']
  }
}
