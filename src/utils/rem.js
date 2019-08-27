;(function () {
  document.documentElement.style.fontSize = document.documentElement.clientWidth * 20 / 375 + 'px'
  window.onresize = function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth * 20 / 375 + 'px'
  }
})()
