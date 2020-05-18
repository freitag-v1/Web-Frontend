import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import SignUp from '../views/SignUp.vue'
import Account from '../views/AccountAuthentication.vue'
import Project from '../views/Project.vue'
import Mypage from '../views/Mypage.vue'
import MypageModify from '../views/MypageModify.vue'
import CreateProject from '../views/CreateProject.vue'
import CreateCollection from '../views/CreateCollection.vue'
import CreateLabelling from '../views/CreateLabelling.vue'
import PointExchange from '../views/PointExchange.vue'
import ProjectPayment from '../views/ProjectPayment.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import AccountPayment from '../views/AccountPayment.vue'
import ImageCollection from '../views/ImageCollection.vue'
import AudioCollection from '../views/AudioCollection.vue'
import TextCollection from '../views/TextCollection.vue'
import ImageBoundingBox from '../views/ImageBoundingBox.vue'
import Classification from '../views/Classification.vue'

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
  {
    path:'/newProject',
    name: 'NewProject',
    component: CreateProject, 
  },
  {
    path:'/project/collection',
    name: 'CreateCollection',
    component: CreateCollection, 
  },
  {
    path:'/project/labelling',
    name: 'CreateLabelling',
    component: CreateLabelling, 
  },
  {
    path:'/mypage/exchange',
    name: 'PointExchange',
    component: PointExchange, 
  },
  {
    path:'/project/payment',
    name: 'ProjectPayment',
    component: ProjectPayment, 
  },
  {
    path:'/project/:idx/information',
    name: 'ProjectDetail',
    component: ProjectDetail, 
  },
  {
    path:'/project/payment/account',
    name: 'AccountPayment',
    component: AccountPayment, 
  },
  {
    path:'/project/collection/image/:idx',
    name: 'ImageCollection',
    component: ImageCollection,
  },
  {
    path:'/project/collection/audio/:idx',
    name: 'AudioCollection',
    component: AudioCollection,
  },
  {
    path:'/project/collection/text/:idx',
    name: 'TextCollection',
    component: TextCollection,
  },
  {
    path:'/project/labelling/boundingBox/:idx',
    name: 'ImageBoundingBox',
    component: ImageBoundingBox,
  },
  {
    path:'/project/labelling/classification/:idx',
    name: 'Classification',
    component: Classification,
  },



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
