// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import CutPhoto from './components/CutPhoto'
import ChooseImage from './components/ChooseImage'

Vue.use(VueRouter)


const routes = [
    { path: '/cut', component: CutPhoto },
    { path: '/', component: ChooseImage }
]

var router = new VueRouter({routes})


const app = new Vue({
    router,
    template: '<App/>',
    components: { App }
}).$mount('#app')
