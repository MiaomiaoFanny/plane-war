import { ref, onUnmounted } from '@vue/runtime-core'
import { handleKeydown, handleKeyup, addTicker } from '../utils'

export const isReachEdge = (range, value, dir) => {
  return (!dir || dir < 0) && (value <= range[0]) ||
         (!dir || dir > 0) && (value >= range[1])
}

/**
 * 键盘移动飞机
 * @param x 初始化 x 坐标值
 * @param y 初始化 y 坐标值
 * @param speed 移动速度
 * @param topLine 上边界
 * @param buttomLine 下边界
 * @param leftLine 左边界
 * @param rightLine 右边界
 */

const keyboardMovePlane = (x, y, speed, topLine, buttomLine, leftLine, rightLine) => {
  const moveX = ref(x)
  const moveY = ref(y)

  // 保存生效的移动命令
  const savedCommands = []
  // 分横纵向两种类型
  const commandType = {
    UPDOWN: Symbol(),
    LEFTRIGHT: Symbol(),
  }
  const commandMap = {
    ArrowDown: { id: 1, dir: 1, type: commandType.UPDOWN },
    ArrowUp: { id: 2, dir: -1, type: commandType.UPDOWN },
    ArrowRight: { id: 3, dir: 1, type: commandType.LEFTRIGHT },
    ArrowLeft: { id: 4, dir: -1,type: commandType.LEFTRIGHT },
  }

  const findCommandUpDown = () => {
    return savedCommands.find(c => c.type === commandType.UPDOWN)
  }
  const findCommandLeftRight = () => {
    return savedCommands.find(c => c.type === commandType.LEFTRIGHT)
  }
  const isExistCommand = (command) => {
    return savedCommands.some(c => c.id === command.id)
  }
  const deleteCommand = (command) => {
    const index = savedCommands.findIndex(c => c.id === command.id)
    savedCommands.splice(index, 1)
  }

  const handleTicker = () => {
    let command = findCommandLeftRight()
    if (command && !isReachEdge([leftLine, rightLine], moveX.value, command.dir))
      moveX.value += speed * command.dir

    command = findCommandUpDown()
    if (command && !isReachEdge([topLine, buttomLine], moveY.value, command.dir))
      moveY.value += speed * command.dir
  }

  const recordCommand = (e) => {
    const command = commandMap[e.code]
    if (command && !isExistCommand(command)) {
      savedCommands.unshift(command)
    }
  }

  const removeCommand = (e) => {
    const command = commandMap[e.code]
    if (command) {
      deleteCommand(command)
    }
  }

  handleKeydown(recordCommand)
  handleKeyup(removeCommand)
  addTicker(handleTicker)
  onUnmounted( () => { savedCommands.length = 0 } )
  return {
    x: moveX,
    y: moveY,
  }
}


// 另一种实现方法
const keyboardMovePlane2 = (x, y, speed, topLine, buttomLine, leftLine, rightLine) => {
  const moveX = ref(x)
  const moveY = ref(y)
  const commandType = {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
  }

    // 让飞机移动
  let command = {
    UpDown: { active: false, dir: -1 },
    LeftRight: { active: false, dir: -1 },
  }
  const recordMove = (e) => {
    switch (e.code) {
      case commandType.ArrowUp:
        command.UpDown.active = true,
        command.UpDown.dir = -1
        break;
      case commandType.ArrowDown:
        command.UpDown.active = true,
        command.UpDown.dir = 1
        break
      case commandType.ArrowLeft:
        command.LeftRight.active = true
        command.LeftRight.dir = -1
        break
      case commandType.ArrowRight:
        command.LeftRight.active = true
        command.LeftRight.dir = 1
        break
    }
  }
  const clearMove = (e) => {
    switch (e.code) {
      case commandType.ArrowUp: case commandType.ArrowDown:
        command.UpDown.active = false
        break
      case commandType.ArrowLeft: case commandType.ArrowRight:
        command.LeftRight.active = false
        break
    }
  }
  const moveSelfPlane = () => {
    if (command.LeftRight.active && !isReachEdge([leftLine, rightLine], moveX.value, command.LeftRight.dir)) {
      moveX.value += (speed * command.LeftRight.dir)
    }

    if (command.UpDown.active && !isReachEdge([topLine, buttomLine], moveY.value, command.UpDown.dir)) {
      moveY.value += (speed * command.UpDown.dir)
    }
  }
  handleKeydown(recordMove)
  handleKeyup(clearMove)
  addTicker(moveSelfPlane)
  return {
    x: moveX,
    y: moveY,
  }
}

export default keyboardMovePlane
