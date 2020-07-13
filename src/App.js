import { defineComponent, h, ref, computed } from '@vue/runtime-core'
import {getPageComponent, PAGE} from './page';

export default defineComponent({
  setup() {
    const currentPageName = ref(PAGE.StartPage)
    const currentPage = computed(() => getPageComponent(currentPageName.value))
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
