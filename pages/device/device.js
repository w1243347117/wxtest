const app = getApp()
Page({
  data: {
    inputText: 'Hello World!',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,
    writeServicweId: "", // 可写服务uuid
    writeCharacteristicsId: "", //可写特征值uuid
    readServicweId: "", // 可读服务uuid
    readCharacteristicsId: "", //可读特征值uuid
    notifyServicweId: "", //通知服务UUid
    notifyCharacteristicsId: "", //通知特征值UUID
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  Send: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.inputText.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.inputText.length; i++) {
        dataView[i] = that.data.inputText.charCodeAt(i)
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.writeServicweId,
        characteristicId: that.data.writeCharacteristicsId,
        value: buffer,
        success: function (res) {
          console.log('发送成功')
        },
        fail:function(e){
          console.log(e);
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    

    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log(res.services)
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: that.data.connectedDeviceId,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
          serviceId: that.data.services[0].uuid,
          success: function (res) {
            for (var i = 0; i < res.characteristics.length; i++) {
              if (res.characteristics[i].properties.notify) {
                console.log("11111111", that.data.services[0].uuid);
                console.log("22222222222222222", res.characteristics[i].uuid);
                that.setData({
                  notifyServicweId: that.data.services[0].uuid,
                  notifyCharacteristicsId: res.characteristics[i].uuid,
                })

                wx.notifyBLECharacteristicValueChange({
                  state: true,
                  deviceId: that.data.connectedDeviceId,
                  serviceId: that.data.notifyServicweId,
                  characteristicId: that.data.notifyCharacteristicsId,
                  success: function (res) {
                    console.log('启用notify成功')
                  }
                })
                break;
              }
              // if (res.characteristics[i].properties.write) {
              //   that.setData({
              //     writeServicweId: that.data.services[0].uuid,
              //     writeCharacteristicsId: res.characteristics[i].uuid,
              //   })

              // } else if (res.characteristics[i].properties.read) {
              //   that.setData({
              //     readServicweId: that.data.services[0].uuid,
              //     readCharacteristicsId: res.characteristics[i].uuid,
              //   })
              // }
            }
            console.log('device getBLEDeviceCharacteristics:', res.characteristics);
          },
          fail: function () {
            console.log("fail");
          },
          complete: function () {
            console.log("complete");
          }
        })

        wx.getBLEDeviceCharacteristics({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: that.data.connectedDeviceId,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
          serviceId: that.data.services[1].uuid,
          success: function (res) {
            for (var i = 0; i < res.characteristics.length; i++) {
              if (res.characteristics[i].properties.write && res.characteristics[i].properties.read) {
                that.setData({
                  writeServicweId: that.data.services[1].uuid,
                  writeCharacteristicsId: res.characteristics[i].uuid,
                  readServicweId: that.data.services[1].uuid,
                  readCharacteristicsId: res.characteristics[i].uuid,
                })
              }
            }
            console.log('device getBLEDeviceCharacteristics1:', res.characteristics);
          },
          fail: function () {
            console.log("fail1");
          },
          complete: function () {
            console.log("complete1");
          }
        })

        // wx.getBLEDeviceCharacteristics({
        //   deviceId: options.connectedDeviceId,
        //   serviceId: res.services[0].uuid,
        //   success: function (res) {
        //     console.log(res.characteristics)
        //     that.setData({
        //       characteristics: res.characteristics
        //     })
        //     wx.notifyBLECharacteristicValueChange({
        //       state: true,
        //       deviceId: options.connectedDeviceId,
        //       serviceId: that.data.services[0].uuid,
        //       characteristicId: that.data.characteristics[0].uuid,
        //       success: function (res) {
        //         console.log('启用notify成功')
        //       }
        //     })
        //   }
        // })
      }
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log("status:"+res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      console.log('接收到数据：' + receiveText)
      that.setData({
        receiveText: receiveText
      })
    })
  },
  read:function(){
    var that = this
    wx.onBLEConnectionStateChange(function (res) {
      console.log("status:" + res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      console.log('接收到数据：' + receiveText)
      that.setData({
        receiveText: receiveText
      })
      var result = app.buf2hex(res.value)
      console.log("接收到数据2：" + result)
    })
    wx.readBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.readServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: that.data.readCharacteristicsId,
      success: function (res) {
        console.log('readBLECharacteristicValue:', res.errMsg);
      },
      fail: function (e) {
        console.log("接收数据失败：" + e);
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  }
})