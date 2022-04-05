/**
 * 功能：从树形结构中获取某一个节点的属性列表<br/>
 * 示例：getPropListFromTree(currentNode, idList, 'id', 'children')
 * @param tree 树形结构
 * @param propList 属性列表
 * @param prop 属性名；默认为id
 * @param children 子节点名；默认为children
 */
export function getPropListFromTree (tree, propList, prop, children) {
  propList.push(tree[prop])
  if (tree[children] && tree[children] instanceof Array && tree[children].length !== 0) {
    for (const childNode of tree[children]) {
      getPropListFromTree(childNode, propList, prop, children)
    }
  }
}

/**
 * 时间戳转字符串
 * @param timestamp 时间戳
 * @param format  字符串格式
 * @returns {*} 字符串时间
 */
function timestampToStr (timestamp, format) {
  const date = new Date(timestamp)
  const getTwo = (i) => {
    return i < 10 ? '0' + i : '' + i
  }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (i) => {
    switch (i) {
      case 'yyyy':
        return getTwo(date.getFullYear())
      case 'MM':
        return getTwo(date.getMonth() + 1)
      case 'dd':
        return getTwo(date.getDate())
      case 'HH':
        return getTwo(date.getHours())
      case 'mm':
        return getTwo(date.getMinutes())
      case 'ss':
        return getTwo(date.getSeconds())
    }
  })
}

// 时间戳转字符串日期
export function formatDate (timestamp, format = 'yyyy-MM-dd') {
  return timestampToStr(timestamp, format)
}

// 时间戳转字符串日期加时间
export function formatTime (timestamp, format = 'yyyy年MM月dd日 HH时mm分ss秒') {
  return timestampToStr(timestamp, format)
}
