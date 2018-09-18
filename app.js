const AV = require('./libs/av-weapp-min.js');
AV.init({
  appId: 'GI0O5vgXWxCU6KYs7SjBeI63-gzGzoHsz',
  appKey: 'DdQuowYhIBniogCr0fe0W4EA',
});

//app.js
App({
  onLaunch: function() {
    // 获取用户信息
  },
  globalData: {
    isTodoNeedUpdate: false
  },
  changeTodoUpdateState(state) {
    this.globalData.isTodoNeedUpdate = state
  }
})