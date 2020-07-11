import { defineComponent, h, onMounted, ref, computed } from '@vue/runtime-core'
import StartPage from './page/StartPage'
import RestartPage from './page/RestartPage'
import GamePage from './page/GamePage'
import BallPage from './page/BallPage'

export default defineComponent({
  setup() {
    const currentPageName = ref('StartPage')
    const currentPage = computed(() => {
      if (currentPageName.value === 'GamePage') {
        return GamePage
      } else if (currentPageName.value === 'RestartPage') {
        return RestartPage
      } else if (currentPageName.value === 'BallPage') {
        return BallPage
      } else {
        return StartPage
      }
    })
    return {
      currentPageName,
      currentPage,
    }
  },
  render(ctx) {
    const vnode = h('Container', [h(ctx.currentPage, {
      onChangePage(page) {
        ctx.currentPageName = page
      }
    })])
    return vnode
  },
})
