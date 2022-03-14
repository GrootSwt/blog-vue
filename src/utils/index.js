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
