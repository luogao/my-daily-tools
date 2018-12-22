const MY_STORE_KEY = "todolist"

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const Store = {
  save(data, successCB, failCB, completeCB) {
    wx.setStorage({
      key: MY_STORE_KEY,
      data: data,
      success: typeof successCB === 'function' ? successCB : null,
      fail: typeof failCB === 'function' ? failCB : null,
      complete: typeof completeCB === 'function' ? completeCB : null
    })
  },
  fetch(successCB, failCB, completeCB) {
    wx.getStorage({
      key: MY_STORE_KEY,
      success: typeof successCB === 'function' ? successCB : null,
      fail: typeof failCB === 'function' ? failCB : null,
      complete: typeof completeCB === 'function' ? completeCB : null
    })
  }
}

const getImageInfo = src => new Promise((resolve, reject) => {
  wx.getImageInfo({
    src,
    success(res) {
      resolve(res)
    },
    fail(err) {
      reject(err)
    }
  })
})

const simpleThrottle = function(fn, delay, atleast) {
  let timer = null;
  let previous = null;
  // eslint-disable-next-line
  return function () {
    const now = +new Date();
    if (!previous) previous = now;

    if (now - previous > atleast) {
      fn();
      // 重置上一次开始时间为本次结束时间
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn();
      }, delay);
    }
  };
}

module.exports = {
  formatTime: formatTime,
  Store: Store,
  getImageInfo,
  simpleThrottle
}