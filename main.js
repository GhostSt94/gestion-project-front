import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import HomePage from './components/HomePage.vue'
import AddProject from './components/AddProject.vue'
import ProjectDetails from './components/ProjectDetails.vue'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/ajouter',
            name: 'ajouter',
            component: AddProject
        },
        {
            path: '/project/:id',
            name: 'details',
            component: ProjectDetails
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/',
        },
    ]
})


createApp(App).use(router).mount('#app')
