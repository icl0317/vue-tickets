;(function (wd, factory) {
  wd.selectSeat = [] // 已选座位
  wd.SeatMap = factory() // 构造函数

  wd.filters = {} // 过滤器

  /**
   * 时间格式转换
   * @param { date } dateTime 如 2018-10-10 12:20:30
   */
  filters.dateTimeFormat = function (dateTime) {
    var r = dateTime.replace(/-/g, '/')
    var oDate = new Date(r)
    return {
      Y: oDate.getFullYear(),
      M: filters.toDouble(oDate.getMonth() + 1),
      D: filters.toDouble(oDate.getDate()),
      h: filters.toDouble(oDate.getHours()),
      m: filters.toDouble(oDate.getMinutes()),
      s: filters.toDouble(oDate.getSeconds())
    }
  }

  /**
   * 不够两位补0
   * @param { number } n 数字
   */
  filters.toDouble = function (n) {
    return n * 1 < 10 ? '0' + n : n
  }
})(window, function () {
  'use strict'

  function SeatMap (obj, data) {
    this.data = data
    this.oSeatArea = obj
    this.oSeatWarp = this.oSeatArea.querySelector('.seat-wrap')
    this.oMap = this.oSeatArea.querySelector('.map')
    this.oMark = this.oSeatArea.querySelector('.mark')
    this.hammer = new Hammer(this.oSeatWarp)
    this.sw = 30 // 单个座位宽度 修改需要同步改css
    this.sh = 26 // 单个座位高度
    this.px = 4 // 座位之间水平距离
    this.py = 4 // 座位之间上下距离
    this.SEAT_STATUS = ['-1', '0', '1', '3'] // -1不可售 0可售 1已售 3锁定 9已选
  }

  /**
   * 初始化座位图
   **/
  SeatMap.prototype.initSeat = function (floor) {
    var _this = this
    var s = null,
      l = null,
      t = null
    var _w = this.sw + this.px
    var _h = this.sh + this.py
    this.floor = floor
    this.rowInMaxCol = {} // 每排最大列数
    this.colInMaxRow = {} // 每列最大行数
    this.maxRow = 0 // 最大排数
    this.maxCol = 0 // 最大列数
    this.oMap.innerHTML = this.oMark.innerHTML = ''
    var seatContent = document.createElement('div')
    var aM = null
    var oDiv = document.createElement('div')
    oDiv.className = 'xs'

    this.data.forEach(function (v, k) {
      if (v.floor == floor || v.floor === undefined) {
        s = document.createElement('span')
        if (v.seat_status == _this.SEAT_STATUS[1]) {
          s.className = 'keyong'
        }
        if (
          v.seat_status == _this.SEAT_STATUS[0] ||
          v.seat_status == _this.SEAT_STATUS[2] ||
          v.seat_status == _this.SEAT_STATUS[3]
        ) {
          s.className = 'bukeyong'
        }

        if (v.seat_status == 9) {
          s.className = 'yixuan'
        }
        s.setAttribute('seat_status', v.seat_status)
        s.setAttribute('gr', v.graph_row)
        s.setAttribute('gc', v.graph_col)
        s.setAttribute('seat_no', v.seat_no)
        s.setAttribute('seat_code', v.seat_code)
        s.setAttribute('index', k)

        // s.innerHTML = v.graph_row + "," + v.graph_col;
        l = (~~v.graph_col - 1) * _w
        t = (~~v.graph_row - 1) * _h
        s.style.WebkitTransform = 'translate(' + l + 'px,' + t + 'px)'
        s.style = 'WebkitTransform:translate(' + l + ',' + t + ')'
        s.style.transform = 'translate(' + l + 'px,' + t + 'px)'
        seatContent.appendChild(s)

        if (
          _this.rowInMaxCol[v.graph_row] === undefined ||
          Number(_this.rowInMaxCol[v.graph_row]) < Number(v.graph_col)
        ) { _this.rowInMaxCol[v.graph_row] = v.graph_col }
        if (
          _this.colInMaxRow[v.graph_col] === undefined ||
          Number(_this.colInMaxRow[v.graph_col]) < Number(v.graph_row)
        ) { _this.colInMaxRow[v.graph_col] = v.graph_row }

        if (Number(v.graph_row) > Number(_this.maxRow)) { _this.maxRow = v.graph_row }
        if (Number(v.graph_col) > Number(_this.maxCol)) { _this.maxCol = v.graph_col }

        // 计算标识
        if (!oDiv.children[v.graph_row]) {
          aM = document.createElement('div')
          aM.className = 'row_mark'
          oDiv.appendChild(aM)
          oDiv.children[v.graph_row].innerHTML = v.seat_row
        }
      } else {
        _this.isTwoFloor = true
      }
    })

    this.deviceWidth = document.body.clientWidth // 设备宽度
    this.seatWidth = _this.maxCol * _w - this.px
    this.SeatHeight = _this.maxRow * _h
    this.scale = (this.deviceWidth / this.seatWidth).toFixed(1) // 默认整屏比例
    if (this.scale > 1.6) this.scale = 1.6
    if (this.scale < 0.6) this.scale = 0.6
    this.oMap.style.width = this.oSeatWarp.style.width = this.seatWidth + 'px'
    this.oMap.style.height = this.SeatHeight + 'px'
    this.oSeatWarp.style.transform =
      'translate3d(' +
      (this.deviceWidth - this.seatWidth) / 2 +
      'px,' +
      30 +
      'px, 0px)' // 居中
    this.oMap.style.transform = 'scale(' + this.scale + ')'
    this.oMap.style.transformOrigin = '50% 0'

    this.oMap.appendChild(seatContent)
    var oP = document.createElement('p')
    oP.className = 'c-line'
    this.oMap.appendChild(oP)
    this.oMark.style.top = '30px'

    oDiv.style.height = this.SeatHeight * this.scale + 'px'
    this.oMark.style.WebkitTransform =
      'translate3d(' + 0 + 'px,' + '30' + 'px,0)'
    this.oMark.style.transform = 'translate3d(' + 0 + 'px,' + '30' + 'px,0)'

    this.oMark.appendChild(oDiv)

    this.dragMove() // 拖拽
    this.delSeat() // 删除座位
    this.seatScale()

    return this
  }

  /**
   * 拖动
   */
  SeatMap.prototype.dragMove = function () {
    var _this = this
    var disX = 0,
      disY = 0
    this.hammer.off('panstart')
    this.hammer.off('panmove')
    this.hammer.off('panend')
    this.hammer.on('panstart', function (ev) {
      // 获取当前偏移量
      var getInitPos = _this.oSeatWarp.style.transform
        .match(/[-+]?[0-9]+(\.[0-9]+)?px, [-+]?[0-9]+(\.[0-9]+)?px, [0-9]px/)[0]
        .split(',')
      disX = parseInt(getInitPos[0])
      disY = parseInt(getInitPos[1])
    })

    this.hammer.on('panmove', function (ev) {
      _this.dx = ev.deltaX + disX
      _this.dy = ev.deltaY + disY

      _this.oSeatWarp.style.WebkitTransform =
        'translate3d(' + _this.dx + 'px,' + _this.dy + 'px,0)'
      _this.oSeatWarp.style.transform =
        'translate3d(' + _this.dx + 'px,' + _this.dy + 'px,0)'

      _this.oMark.style.WebkitTransform =
        'translate3d(' + 0 + 'px,' + _this.dy + 'px,0)'
      _this.oMark.style.transform =
        'translate3d(' + 0 + 'px,' + _this.dy + 'px,0)'
    })

    this.hammer.on('panend', function (ev) {
      _this.oSeatWarp.style.WebkitTransform =
        'translate3d(' + _this.dx + 'px,' + _this.dy + 'px,0)'
      _this.oSeatWarp.style.transform =
        'translate3d(' + _this.dx + 'px,' + _this.dy + 'px,0)'
      var scaleCha = _this.seatWidth * (1 - _this.scale) / -2

      if (_this.seatWidth * _this.scale > _this.deviceWidth) {
        // 宽度超出一屏
        var left = scaleCha + 20

        if (_this.dx > left) {
          _this.dx = left
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + left + 'px,' + _this.dy + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + left + 'px,' + _this.dy + 'px,0)'
        }
        var right = _this.deviceWidth - scaleCha - _this.seatWidth - 10

        if (_this.dx < right) {
          _this.dx = right
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + right + 'px,' + _this.dy + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + right + 'px,' + _this.dy + 'px,0)'
        }
      } else {
        // 宽度一屏内
        if (_this.dx < scaleCha) {
          _this.dx = (scaleCha + 20)
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + (scaleCha + 20) + 'px,' + _this.dy + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + (scaleCha + 20) + 'px,' + _this.dy + 'px,0)'
        }

        if (_this.dx > _this.deviceWidth - _this.seatWidth - scaleCha) {
          _this.dx = (_this.deviceWidth - _this.seatWidth - scaleCha - 10)
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + (_this.deviceWidth - _this.seatWidth - scaleCha - 10) + 'px,' + _this.dy + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + (_this.deviceWidth - _this.seatWidth - scaleCha - 10) + 'px,' + _this.dy + 'px,0)'
        }
      }
      var viewHeight = document.querySelector('.seat-area').offsetHeight - 100

      if (_this.SeatHeight * _this.scale > viewHeight) {
        // 高度超出一屏
        if (_this.dy > 30) {
          _this.dy = 30
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + _this.dx + 'px,' + 30 + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + _this.dx + 'px,' + 30 + 'px,0)'
          _this.oMark.style.WebkitTransform = 'translate3d(' + 0 + 'px,' + 30 + 'px,0)'
          _this.oMark.style.transform = 'translate3d(' + 0 + 'px,' + 30 + 'px,0)'
        }
        var bottom = viewHeight - _this.SeatHeight - 30 + _this.SeatHeight * (1 - _this.scale)
        if (_this.dy < bottom) {
          _this.dy = bottom
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + _this.dx + 'px,' + bottom + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + _this.dx + 'px,' + bottom + 'px,0)'
          _this.oMark.style.WebkitTransform = 'translate3d(' + 0 + 'px,' + bottom + 'px,0)'
          _this.oMark.style.transform = 'translate3d(' + 0 + 'px,' + bottom + 'px,0)'
        }
      } else {
        // 高度一屏内
        if (_this.dy < 30) {
          _this.dy = 0
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + _this.dx + 'px,' + 0 + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + _this.dx + 'px,' + 0 + 'px,0)'
          _this.oMark.style.WebkitTransform = 'translate3d(' + 0 + 'px,' + 0 + 'px,0)'
          _this.oMark.style.transform = 'translate3d(' + 0 + 'px,' + 0 + 'px,0)'
        }
        var bottom = viewHeight - _this.SeatHeight - 30 + _this.SeatHeight * (1 - _this.scale)
        if (_this.dy > bottom) {
          _this.dy = bottom
          _this.oSeatWarp.style.WebkitTransform = 'translate3d(' + _this.dx + 'px,' + bottom + 'px,0)'
          _this.oSeatWarp.style.transform = 'translate3d(' + _this.dx + 'px,' + bottom + 'px,0)'
          _this.oMark.style.WebkitTransform = 'translate3d(' + 0 + 'px,' + bottom + 'px,0)'
          _this.oMark.style.transform = 'translate3d(' + 0 + 'px,' + bottom + 'px,0)'
        }
      }
    })
  }

  /**
   * 缩放
   */
  SeatMap.prototype.seatScale = function () {
    var _this = this
    this.hammer.get('pinch').set({
      enable: true
    })
    var s = 0
    var oXs = null
    this.hammer.off('pinchstart')
    this.hammer.off('pinchmove')
    this.hammer.off('pinchend')
    this.hammer.on('pinchstart', function (e) {
      s = _this.scale
      oXs = document.querySelector('.xs')
    })
    this.hammer.on('pinchmove', function (e) {
      _this.scale = s * 1 + 1 * (e.scale - 1)
      if (_this.scale > 2) _this.scale = 2
      if (_this.scale < 0.3) _this.scale = 0.3
      _this.oMap.style.transform = 'scale(' + _this.scale + ')'
      oXs.style.height = _this.SeatHeight * _this.scale + 'px'
      _this.oMap.style.transformOrigin = '50% 0'
    })

    this.hammer.on('pinchend', function (e) {
      _this.scale = s * 1 + 1 * (e.scale - 1)
      if (_this.scale > 1.4) _this.scale = 1.4
      if (_this.scale < 0.6) _this.scale = 0.6
      _this.oMap.style.transform = 'scale(' + _this.scale + ')'
      oXs.style.height = _this.SeatHeight * _this.scale + 'px'
      _this.oMap.style.transformOrigin = '50% 0'
    })
  }
  /**
   * 点选座位
   * @param {number} limit 最大购票数
   */
  SeatMap.prototype.selectSeat = function (limit) {
    var _this = this
    this.hammer.off('tap')
    this.hammer.on('tap', function (ev) {
      _this.pushSeat(ev, limit)
      _this.showSeat()
    })
  }

  /**
   * 单体存取座位及状态更改
   * @param {ev, numver} ev limit最大购票数
   */
  SeatMap.prototype.pushSeat = function (event, limit) {
    var _this = this
    var oTarget = event.target
    if (oTarget.tagName.toUpperCase() === 'SPAN') {
      if (oTarget.getAttribute('seat_status') == _this.SEAT_STATUS[1]) {
        if (window.selectSeat.length === limit) {
          alert('最多' + limit)
          return
        }
        oTarget.className = 'yixuan'
        oTarget.setAttribute('seat_status', 9)
        _this.data[oTarget.getAttribute('index')].seat_status = 9
      } else if (oTarget.getAttribute('seat_status') == 9) {
        oTarget.className = 'keyong'
        oTarget.setAttribute('seat_status', _this.SEAT_STATUS[1])
        _this.data[oTarget.getAttribute('index')].seat_status =
          _this.SEAT_STATUS[1]
      } else {
        return
      }
      var seat_no = oTarget.getAttribute('seat_no')

      if (seat_no !== undefined) {
        var sameIndex = window.selectSeat.indexOf(seat_no)
        if (sameIndex !== -1) {
          window.selectSeat.splice(sameIndex, 1)
        } else {
          window.selectSeat.push(seat_no)
        }
      }
    }
  }

  /**
   * 单体选座购买
   * @param {number} max 个人最大买票数
   */
  SeatMap.prototype.personalSeat = function (max) {
    var limit = max || 4
    this.selectSeat(limit)
  }

  /**
   * 团体票推荐座位
   * @param {number} quantity需要推荐座位数量
   */
  SeatMap.prototype.groupSeat = function (quantity) {
    var limit = quantity || 6
    var sort = ['l', 't', 'r', 'b'] // 顺时针螺旋方向
    var _this = this

    this.oSeatWarp.onclick = function (ev) {
      if (ev.target.tagName.toUpperCase() !== 'SPAN') return
      var oTarget = ev.target
      var aSpans = _this.oMap.children[0];

      // 是否开启自选模式，如果已选座位达到团体个数则推荐模式(true)，否则自选模式(false)
      (window.selectSeat.length === limit || window.selectSeat.length === 0) &&
      oTarget.getAttribute('seat_status') == _this.SEAT_STATUS[1]
        ? IntelligentSelect()
        : _this.pushSeat(ev, limit)

      function IntelligentSelect () {
        var arr = []
        var odd = -1
        var even = 0
        var i = -1
        var keyongCount = 0 // 统计可用座位数 ps.包含所有层
        var floorKeyongCount = 0 // 当前层可用座位数

        // 每次清空已推荐座位数据
        for (var j = 0; j < _this.data.length; j++) {
          if (_this.data[j].seat_status == '9') {
            _this.data[j].seat_status = _this.SEAT_STATUS[1] // 清空data status
          }
          if (_this.data[j].seat_status == _this.SEAT_STATUS[1]) {
            keyongCount++
          }
        }
        // 每次清空已推荐的dom属性
        for (var j = 0; j < aSpans.children.length; j++) {
          if (aSpans.children[j].getAttribute('seat_status') === '9') {
            aSpans.children[j].setAttribute(
              'seat_status',
              _this.SEAT_STATUS[1]
            ) // 清空dom status
            aSpans.children[j].className = 'keyong' // 清空dom class
          }
          if (
            aSpans.children[j].getAttribute('seat_status') ==
            _this.SEAT_STATUS[1]
          ) {
            floorKeyongCount++
          }
        }

        if (limit > keyongCount) {
          // 总体座位数不够推荐
          alert('目前余座' + keyongCount + '，不够推荐座位')
          window.selectSeat = []
          return
        } else if (limit > floorKeyongCount && limit <= keyongCount) {
          // 当前楼层座位数不够推荐，但总体够推荐
          alert('当前楼层不够推荐个数，另外一层请手动选择')
          window.selectSeat = []
          _this.data.forEach(function (v) {
            if (v.floor == _this.floor) {
              v.seat_status = 9
              window.selectSeat.push(v.seat_no)
            }
          })
          for (var j = 0; j < aSpans.children.length; j++) {
            aSpans.children[j].setAttribute('seat_status', 9)
            aSpans.children[j].className = 'yixuan'
          }
          return
        }

        // 螺旋推荐
        oTarget.className = 'yixuan'
        oTarget.setAttribute('seat_status', 9)
        var row = oTarget.getAttribute('gr')
        var col = oTarget.getAttribute('gc')
        _this.data[oTarget.getAttribute('index')].seat_status = 9
        arr.push(oTarget.getAttribute('seat_no'))

        while (arr.length < limit) {
          i++
          i = i % 4
          if (i === 0) {
            odd += 2
            even += 2
          }

          if ('lt'.indexOf(sort[i]) != -1) {
            for (var j = 0; j < odd; j++) {
              if (arr.length < limit) {
                var json = {}
                if (sort[i] == 'l') {
                  col = Number(col) - 1
                }
                if (sort[i] == 't') {
                  row = Number(row) - 1
                }

                if (
                  col <= 0 ||
                  row <= 0 ||
                  col > Number(_this.rowInMaxCol[row]) ||
                  row > Number(_this.colInMaxRow[col])
                ) { continue }
                _this.data.forEach(function (v, j) {
                  if (
                    v.seat_status == _this.SEAT_STATUS[1] &&
                    v.floor == _this.floor &&
                    v.graph_col == col &&
                    v.graph_row == row
                  ) {
                    aSpans.children[j].className = 'yixuan'
                    aSpans.children[j].setAttribute('seat_status', 9)
                    _this.data[
                      aSpans.children[j].getAttribute('index')
                    ].seat_status = 9
                    arr.push(aSpans.children[j].getAttribute('seat_no'))
                  }
                })
              }
            }
          }

          if ('rb'.indexOf(sort[i]) != -1) {
            for (var j = 0; j < even; j++) {
              if (arr.length < limit) {
                var json = {}
                if (sort[i] == 'r') {
                  col = Number(col) + 1
                }
                if (sort[i] == 'b') {
                  row = Number(row) + 1
                }
                if (
                  col <= 0 ||
                  row <= 0 ||
                  col > Number(_this.rowInMaxCol[row]) ||
                  row > Number(_this.colInMaxRow[col])
                ) { continue }

                _this.data.forEach(function (v, j) {
                  if (
                    v.seat_status == _this.SEAT_STATUS[1] &&
                    v.floor == _this.floor &&
                    v.graph_col == col &&
                    v.graph_row == row
                  ) {
                    aSpans.children[j].className = 'yixuan'
                    aSpans.children[j].setAttribute('seat_status', 9)
                    _this.data[
                      aSpans.children[j].getAttribute('index')
                    ].seat_status = 9
                    arr.push(aSpans.children[j].getAttribute('seat_no'))
                  }
                })
              }
            }
          }
        }
        window.selectSeat = arr
      }
    }
  }

  /**
   * 展示已选座位
   */
  SeatMap.prototype.showSeat = function () {
    var _this = this
    var str = ''

    window.selectSeat.forEach(function (v) {
      _this.data.forEach(function (item, i) {
        if (v === item.seat_no && !_this.isTwoFloor) {
          str +=
            '<li seat_no="' +
            item.seat_no +
            '" index="' +
            i +
            '"><span seat_no="' +
            item.seat_no +
            '" index="' +
            i +
            '">' +
            item.seat_row +
            '排' +
            item.seat_col +
            '座</span></li>'
        } else if (v === item.seat_no && _this.isTwoFloor) {
          str +=
            '<li seat_no="' +
            item.seat_no +
            '" index="' +
            i +
            '"><span seat_no="' +
            item.seat_no +
            '" index="' +
            i +
            '">' +
            item.floor +
            '层' +
            item.seat_row +
            '排' +
            item.seat_col +
            '座</span></li>'
        }
      })
    })

    document.querySelector('.selected_show').innerHTML = str
  }

  /**
   * 删除已选座位
   */
  SeatMap.prototype.delSeat = function () {
    var _this = this
    document.querySelector('.selected_show').onclick = function (ev) {
      var getSeatNo = ev.target.getAttribute('seat_no')
      var getIndex = ev.target.getAttribute('index')
      if (getSeatNo) {
        var aSpans = _this.oMap.children[0].children
        var sameIndex = window.selectSeat.indexOf(getSeatNo)
        window.selectSeat.splice(sameIndex, 1)
        for (var i = 0; i < aSpans.length; i++) {
          if (aSpans[i].getAttribute('seat_no') === getSeatNo) {
            aSpans[i].setAttribute('seat_status', _this.SEAT_STATUS[1])
            aSpans[i].className = 'keyong'
          }
        }
        _this.data[getIndex].seat_status = _this.SEAT_STATUS[1]
      }
      _this.showSeat()
    }
  }

  return SeatMap
})
