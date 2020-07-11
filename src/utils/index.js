
export function hit(objA, objB) {
  if (!objA || !objB) {
    return false
  }
  return !(
    (objA.x + objA.width < objB.x) || // A 在 左
    (objB.x + objB.width < objA.x) || // A 在 右
    (objA.y + objA.height < objB.y) || // A 在 上
    (objB.y + objB.height < objA.y) // A 在 下
  )
}