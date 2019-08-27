/**
 * 移动端拖拽
 * @params {obj1,obj2}  obj1拖拽的区域  obj2拖动的对象，两者可以使同一个
 */
export const mDrag = (downObj, dragObg) => {
  downObj.addEventListener('touchstart', function (ev) {
    let disX = ev.touches[0].clientX - dragObg.offsetLeft
    let disY = ev.touches[0].clientY - dragObg.offsetTop

    let oMove = ev => {
      dragObg.style.left = ev.touches[0].clientX - disX + 'px'
      dragObg.style.top = ev.touches[0].clientY - disY + 'px'
    }
    downObj.addEventListener('touchmove', oMove)

    let oEnd = ev => {
      downObj.removeEventListener('touchmove', oMove, false)
      downObj.removeEventListener('touchend', oEnd, false)
      dragObg.releaseCapture && dragObg.releaseCapture()
    }
    downObj.addEventListener('touchend', oEnd)
  })
}

/**
 * 数组对象删除相同元素
 * @param {array ,string, [object|string]}
 * arr需要去重的数组  key对象里需要对比的 键 名  obj要对比的对象或者字符串
 */
export const rmSameObj = (arr, key, obj) => {
  let _obj = obj[key] ? obj[key] : obj
  let _del = ''
  arr.forEach((v, i) => {
    if (v[key] === _obj) {
      _del = arr.splice(i, 1)
    }
  })

  return _del
}

/**
 * 移除重复数组对象
 * @param {Array} arr 包含对象数组
 * @param {String} key 要对比的键值
 */
export const rmSame = (arr, key) => {
  let obj = {}
  return arr.reduce((v, next) => {
    obj[next[key]] ? '' : (obj[next[key]] = true && v.push(next))
    return v
  }, [])
}

/**
 * 时间格式转换
 * @param { string | number } dt 10位时间戳或GMT时间
 * @param { string } [format] 要转成时间格式 {Y}-{M}-{D} {h}:{m}:{s} {w}
 */
export const parseDateTime = (dt, format = 'default') => {
  let dateime = null
  if (isNaN(dt)) {
    dateime = dt.replace(/-/g, '/')
  } else {
    dateime = dt.toString().length === 10 ? dt * 1000 : dt * 1
  }
  let oDate = new Date(dateime)
  let dateTimeObj = {
    Y: oDate.getFullYear(),
    M: toDouble(oDate.getMonth() + 1),
    D: toDouble(oDate.getDate()),
    h: toDouble(oDate.getHours()),
    m: toDouble(oDate.getMinutes()),
    s: toDouble(oDate.getSeconds()),
    w: oDate.getDay()
  }
  if (format === 'default') {
    return dateTimeObj
  } else {
    return format.replace(/{(Y|M|D|h|m|s|w)+}/g, (r, k) => {
      let val = dateTimeObj[k]
      if (k === 'w') {
        let week = ['日', '一', '二', '三', '四', '五', '六']
        val = week[val]
      }
      return val
    })
  }
}

/**
 * 时间转时间戳
 * @param { Date } 日期时间
 */
export const dateTime2Stamp = dateTime => {
  dateTime = dateTime.replace(/-/g, '/')
  return new Date(dateTime).getTime() / 1000
}
/**
 * 小于10前位补0
 * @param {number}
 */
export const toDouble = num => (num < 10 ? '0' + num : num)

/**
 * 数组对象查重
 * @param {array, object, string}
 *
 */
export const findInArr = (arr, newObj, key) => {
  let i = 0
  for (i; i < arr.length; i++) {
    if (arr[i][key] == newObj[key]) {
      return i
    }
  }
  return -1
}
