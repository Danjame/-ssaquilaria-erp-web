import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss'
import Icon from './components/Icon'
import Dialog from './components/Dialog'
import Pagination from './components/Pagination'

createApp(App)
  .use(router)
  .use(store)
  .use(Icon)
  .use(Dialog)
  .use(Pagination)
  .mount('#app')
