/* 
    Für das Routing zwischen den Seiten wird der Vue-Router genutzt.
    Der Index ist als LOGIN-Seite festgelegt, da das System nur von Mitarbeitern genutzt wird.
*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import register from '../components/account/register.vue'
import index from '../components/account/index.vue'
import service from '../components/service/service.vue'
import customer from '../components/customer/customer.vue'
import projects from '../components/projects/projects.vue'
import personal from '../components/personal/personal.vue'


Vue.use(VueRouter)


const routes = [
  { path: '/', name: 'index', component: index },
  { path: '/register', name: 'register',component: register },
  { path: '/service', name: 'service', component: service},
  { path: '/customer', name: 'customer', component: customer},
  { path: '/projects', name: 'projects', component: projects},
  { path: '/personal', name: 'personal', component: personal}
]

const router = new VueRouter({
  routes
})

export default router
