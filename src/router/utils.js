// 深拷贝
const _getType = function (value) {
  return Object.prototype.toString.call(value).slice(8).slice(0, -1).toLowerCase()
}
let clone = {
  array (arr) {
    let newArr = []
    for (let item of arr) {
      newArr.push(this[_getType(item)](item))
    }
    return newArr
  },
  object (obj) {
    let newObj = {}
    for (let [key, value] of Object.entries(obj)) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = this[_getType(value)](value)
      }
    }
    return newObj
  }
}
for (let type of ['null', 'string', 'number', 'function', 'Promise', 'boolean']) {
  clone[type] = function (value) {
    return value
  }
}
// 多叉树遍历
const multiTree = function (node, flag) {
  let stack = []
  const pushStack = function (node) { // 将子节点加入栈
    let children = node.children
    if (children && children.length) {
      for (let subNode of children) {
        subNode.filter = function () { // 添加过滤函数
          children.splice(children.indexOf(this), 1)
        }
        stack.push(subNode)
      }
    }
  }
  pushStack(node)
  while (stack.length) {
    let item = stack.shift()
    let id = item.id
    if (flag.includes(id)) {
      item.filter = undefined
    } else {
      item.filter()
      continue
    }
    pushStack(item)
  }
  return node
}

export { clone, multiTree }
