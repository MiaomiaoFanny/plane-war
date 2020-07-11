import { defineComponent, h, ref, computed } from '@vue/runtime-core'
import {router, pages} from "./router";

export default defineComponent({
  setup() {
    const currentPageName = ref(pages.StartPage)
    const currentPage = computed(() => router[currentPageName.value])
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
