import { onMounted, onUnmounted } from '@vue/runtime-core'

export const handleKeyboard = (type, action) => {
  const _action = (e) => {
    // console.log('[handleKeyboard]', type)
    if(typeof action === 'function') {
      action(e)
    } else if (action !== null && typeof action === 'object') {
      let handler = action[e.code] || action[e.key] || action[e.keyCode]
      if(handler) {
        handler(e)
      }
    }
  }
  onMounted(() => {
    window.addEventListener(type, _action)
  })
  onUnmounted(() => {
    window.removeEventListener(type, _action)
  })
}

export const handleKeydown = (action) => {
  handleKeyboard('keydown', action)
}

export const handleKeyup = (action) => {
  handleKeyboard('keyup', action)
}

