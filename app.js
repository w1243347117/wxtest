//app.js
var t = Date.now();
App({
  buf2hex: function(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
  },
  buf2string: function(buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },
  onLaunch: function() {
    this.globalData.SystemInfo = wx.getSystemInfoSync()
    //console.log(this.globalData.SystemInfo)
  },
  //暂停
  sleep: function(d) {
    while (Date.now() - t <= d);
  },

  globalData: {
    SystemInfo: {}
  }
})