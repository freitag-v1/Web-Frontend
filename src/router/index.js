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
import StartProject  from '../views/StartProject.vue'
import CompleteProject  from '../views/CompleteProject.vue'
import RequestProject  from '../views/RequestProject.vue'
import StartLabelling  from '../views/StartLabellingProject.vue'
import RequestProjectDetail  from '../views/RequestProjectDetail.vue'

Vue.use(VueRouter)

const requireAuth = async (to, from, next) => {
  var loginStatus = await localStorage.getItem('loginState');
  if (loginStatus) return next()
  next({
    path: '/login',
    query: { redirect: to.fullPath }
  })
}

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
    component: SignUp,
    beforeRouteLeave (to, from, next) { 
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
      if (answer) 
      { 
        next() }
      else { 
        next(false) 
      } }
  },
  {
    path:'/signup/account',
    name: 'Account',
    component: Account,
   
  },
  {
    path:'/project',
    name: 'Project',
    component: Project
  },
  {
    path:'/mypage',
    name: 'Mypage',
    component: Mypage,
    beforeEnter: requireAuth
  },
  {
    path:'/mypage/modify',
    name: 'MypageModify',
    component: MypageModify,
    beforeEnter: requireAuth
  }, 
  {
    path:'/newProject',
    name: 'NewProject',
    component: CreateProject,
    beforeEnter: requireAuth
  },
  {
    path:'/project/collection',
    name: 'CreateCollection',
    component: CreateCollection,
    beforeEnter: requireAuth 
  },
  {
    path:'/project/labelling',
    name: 'CreateLabelling',
    component: CreateLabelling, 
    beforeEnter: requireAuth
  },
  {
    path:'/mypage/exchange',
    name: 'PointExchange',
    component: PointExchange, 
    beforeEnter: requireAuth
  },
  {
    path:'/project/payment',
    name: 'ProjectPayment',
    component: ProjectPayment, 
    beforeEnter: requireAuth
  },
  {
    path:'/project/:idx/information',
    name: 'ProjectDetail',
    component: ProjectDetail, 
    beforeEnter: requireAuth
  },
  {
    path:'/project/payment/account',
    name: 'AccountPayment',
    component: AccountPayment, 
    beforeEnter: requireAuth
  },
  {
    path:'/project/collection/image/:idx',
    name: 'ImageCollection',
    component: ImageCollection,
    beforeEnter: requireAuth
  },
  {
    path:'/project/collection/audio/:idx',
    name: 'AudioCollection',
    component: AudioCollection,
    beforeEnter: requireAuth
  },
  {
    path:'/project/collection/text/:idx',
    name: 'TextCollection',
    component: TextCollection,
    beforeEnter: requireAuth
  },
  {
    path:'/project/labelling/boundingBox/:idx/problem/:idx',
    name: 'ImageBoundingBox',
    component: ImageBoundingBox,
    beforeEnter: requireAuth
  },
  {
    path:'/project/labelling/classification',
    name: 'Classification',
    component: Classification,
    beforeEnter: requireAuth
  },
  {
    path:'/startProject',
    name: 'StartProject',
    component: StartProject,
    beforeEnter: requireAuth
  },
  {
    path:'/startProject',
    name: 'StartProject',
    component: StartProject,
    beforeEnter: requireAuth
  },
  {
    path: '/project/complete',
    name : 'CompleteProject',
    component : CompleteProject,
    beforeEnter: requireAuth,
  },
  {
    path: '/project/request',
    name : 'RequestProject',
    component : RequestProject,
    beforeEnter: requireAuth,
  },
  {
    path: '/project/startLabelling',
    name : 'StartLabelling',
    component : StartLabelling,
    beforeEnter: requireAuth,
  },
  {
    path: '/project/request/:idx/information',
    name : 'RequestProjectDetail',
    component : RequestProjectDetail,
    beforeEnter: requireAuth,
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
