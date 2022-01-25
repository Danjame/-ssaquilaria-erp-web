import { App } from '@vue/runtime-dom'
import * as Icons from '@element-plus/icons-vue'

export default {
  install (app: App) {
    Object.keys(Icons).forEach(key => {
      app.component(key, Icons[key as keyof typeof Icons])
    })
  }
}
