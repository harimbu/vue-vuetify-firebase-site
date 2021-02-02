import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/firebase'

Vue.config.productionTip = false

Vue.config.errorHandler = e => {
  console.table(e.message)
  Vue.prototype.$toast(e.message, {
    color: 'indigo darken-3'
  })
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
