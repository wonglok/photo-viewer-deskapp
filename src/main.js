import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { router } from './router.js'
import './assets/inter/InterWeb/inter.css'
import './assets/css/tailwind.postcss'
import './assets/@fortawesome/fontawesome-free/css/all.css'

Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

if (window.location.href === 'app://./index.html') {
  router.push('/')
}

// if (process.env.NODE_ENV === 'production') {
//   let unregister = async () => {
//     try {
//       if ('serviceWorker' in navigator) {
//         let registrations = await navigator.serviceWorker.getRegistrations()
//         for (let registration of registrations) {
//           // await registration.update()
//           await registration.unregister()
//         }
//       }
//     } catch (e) {
//       console.error(e)
//     }
//   }
//   unregister()
// }
