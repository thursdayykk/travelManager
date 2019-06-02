import Vue from 'vue'
import Router from 'vue-router'
// import defaultPage from '@/layout/default.vue'
import blankPage from '@/layout/blank.vue'
import Login from '@/page/login.vue'
import Register from '@/page/register.vue'
import userCharge from '@/page/userCharge.vue'
import storeCharge from '@/page/storeCharge.vue'
import hotelCharge from '@/page/hotelCharge.vue'
import blogCharge from '@/page/blogCharge.vue'
import sceneryCharge from '@/page/sceneryCharge.vue'
import userMsg from '@/page/changeUserMsg.vue'

import err from '@/page/404NOTFOUND.vue'



Vue.use(Router)
let config = {
  routes: [
    {
      path: '/',
      name: 'default',
      // meta: { title: '首页' },
      component: resolve => require(['@/layout/default.vue'], resolve),
      redirect: '/userMsg',
      children: [{
        path: '/userCharge',
        name: 'user',
        meta: { title: '用户管理' },
        component: userCharge,  
        beforeEnter(to,form,next){
          if(window.sessionStorage.getItem('power') == -1  ){
            next()
          }else{
            next({name:'err'})
          }
        },
      }, {
        path: '/storeCharge',
        name: 'store',
        meta: { title: '美食管理' },
        component: storeCharge,
        beforeEnter(to,form,next){
          if(window.sessionStorage.getItem('power') == -1 || window.sessionStorage.getItem('power') == 4 ){
            next()
          }else{
            next({name:'err'})
          }
        },
      },{
        path: '/userMsg',
        name: 'userMsg',
        meta: { title: '个人资料' },
        component: userMsg
      }, {
        path: '/blogCharge',
        name: 'blog',
        meta: { title: '攻略管理' },
        component: blogCharge,
        beforeEnter(to,form,next){
          if(window.sessionStorage.getItem('power') == -1 || window.sessionStorage.getItem('power') == 3 ){
            next()
          }else{
            next({name:'err'})
          }
        },
      }, {
        path: '/hotelCharge',
        name: 'hotel',
        meta: { title: '酒店管理' },
        component: hotelCharge,
        beforeEnter(to,form,next){
          if(window.sessionStorage.getItem('power') == -1 || window.sessionStorage.getItem('power') == 2 ){
            next()
          }else{
            next({name:'err'})
          }
        },
      }, {
        path: '/sceneryCharge',
        name: 'scenery',
        meta: { title: '景区管理' },
        component: sceneryCharge,
        beforeEnter(to,form,next){
          if(window.sessionStorage.getItem('power') == -1 || window.sessionStorage.getItem('power') == 1 ){
            next()
          }else{
            next({name:'err'})
          }
        },
      }]
    },
    {
      path:'*',
      redirect:"/err"
    },
    {
      path: '/blank',
      name: 'blank',
      component: blankPage,
      children: [{
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path:'/err',
        name: 'err',
        component: err
      },
      {
        path: '/register',
        name: 'register',
        component: Register
      }]
    }
  ]
}
let router = new Router(config);


router.beforeEach((to,from,next) =>{
  // console.log(to,from)
  //如果不执行next 路由不会发生跳转
  // console.log(to,from)
  // console.log(document.cookie)
  if(to.path == '/login' || to.path == '/register'){
    // console.log('hi')
      next()
  }else{
    if(to.path != '/login' ){
      var arr = document.cookie.split(";");
      var val = ''
      arr.forEach(el=>{
        var temp = el.split('=');
        // console.log(temp[0].trim())
        if( temp[0].trim() == 'name'){
          // console.log('hhhh')
          val = temp[1];
        }
      })
      if(val){
        // console.log('admin')
        next()
      }else{
        // console.log(val)
        next({name:'login'});
        alert('请重新登录！')
      }

    }

}


// 参数：
// false 从哪来回哪去（不允许跳转） next(false) 

})
export default router;
