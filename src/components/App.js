import reactive from '../core/reactivity.js'
import { h } from '../core/runtime.js'
export default {
  data: reactive({
    count: 0
  }),
  render() {
    return h('div', {
      onClick: () => {
        this.data.count++
      }
    }, String(this.data.count))
  }
}