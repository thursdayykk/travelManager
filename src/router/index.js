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
import detail from '@/page/detail.vue'
import err from '@/page/404NOTFOUND.vue'
import userDetail from '@/components/userDetail.vue'
import blogDetail from '@/components/blogDetail.vue'
import hotelDetail from '@/components/hotelDetail.vue'
import sceneryDetail from '@/components/sceneryDetail.vue'
import storeDetail from '@/components/storeDetail.vue'



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
        component: userCharge
      }, {
        path: '/storeCharge',
        name: 'store',
        meta: { title: '美食管理' },
        component: storeCharge
      },{
        path: '/userMsg',
        name: 'userMsg',
        meta: { title: '个人资料' },
        component: userMsg
      }, {
        path: '/blogCharge',
        name: 'blog',
        meta: { title: '攻略管理' },
        component: blogCharge
      }, {
        path: '/hotelCharge',
        name: 'hotel',
        meta: { title: '酒店管理' },
        component: hotelCharge
      }, {
        path: '/sceneryCharge',
        name: 'scenery',
        meta: { title: '景区管理' },
        component: sceneryCharge
      }, {
        path: '/detail',
        name: 'detail',
        meta: { title: '详情' },
        component: detail,
        children: [
          {
            path: '/userDetail/:id?',
            name: 'userDetail',
            component: userDetail
          },
          {
            path: '/storeDetail/:id?',
            name: 'storeDetail',
            component: storeDetail
          },
          {
            path: '/sceneryDetail/:id?',
            name: 'sceneryDetail',
            component: sceneryDetail
          },
          {
            path: '/blogDetail/:id?',
            name: 'blogDetail',
            component: blogDetail
          },
          {
            path: '/hotelDetail/:id?',
            name: 'hotelDetail',
            component: hotelDetail
          }
        ]
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
  console.log(to,from)
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
