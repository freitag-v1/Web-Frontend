import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import SignUp from '../views/SignUp.vue'
import Account from '../views/AccountAuthentication.vue'
import Project from '../views/Project.vue'
import Mypage from '../views/Mypage.vue'
import MypageModify from '../views/MypageModify.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/login',
    name: 'Login',
    component: Login
  },
  {
    path:'/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path:'/signup/account',
    name: 'Account',
    component: Account
  },
  {
    path:'/project',
    name: 'Project',
    component: Project
  },
  {
    path:'/mypage',
    name: 'Mypage',
    component: Mypage
  },
  {
    path:'/mypage/modify',
    name: 'MypageModify',
    component: MypageModify
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
