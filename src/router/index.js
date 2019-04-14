import Vue from 'vue'
import Router from 'vue-router'
// import defaultPage from '@/layout/default.vue'
import blankPage from '@/layout/blank.vue'
import Login from '@/page/login.vue'
// import Register from '@/page/register.vue'
import userCharge from '@/page/userCharge.vue'
import storeCharge from '@/page/storeCharge.vue'
import hotelCharge from '@/page/hotelCharge.vue'
import blogCharge from '@/page/blogCharge.vue'
import sceneryCharge from '@/page/sceneryCharge.vue'



Vue.use(Router)
let config = {
  routes: [
    {
      path: '/',
      name: 'default',
      meta:{title:'首页'},
      component: resolve => require(['@/layout/default.vue'],resolve),
      redirect: '/userCharge',
      children:[{
        path: '/userCharge',
        name: 'user',
        meta:{title:'用户管理'},
        component: userCharge
      },{
        path: '/storeCharge',
        name: 'store',
        meta:{title:'美食管理'},
        component: storeCharge
      },,{
        path: '/blogCharge',
        name: 'blog',
        meta:{title:'攻略管理'},
        component: blogCharge
      },{
        path: '/hotelCharge',
        name: 'hotel',
        meta:{title:'酒店管理'},
        component: hotelCharge
      },{
        path: '/sceneryCharge',
        name: 'scenery',
        meta:{title:'景区管理'},
        component: sceneryCharge
      },{
        path: 'detail/:id',
        name: 'detail',
        meta:{title:'景区管理'},
        component: sceneryCharge
      }]
    },
    {
      path: '/blank',
      name: 'blank',
      component: blankPage,
      children: [{
        path: '/login',
        name: 'login',
        component: Login
      }]
    }
  ]
}
let router = new Router(config);


// router.beforeEach((to,from,next) =>{
//   // console.log(to,from)
//   //如果不执行next 路由不会发生跳转
//   console.log(to,from)
//   // console.log(document.cookie)
//   if(to.path == '/'){
//     console.log('hi')
//       next()
//   }else{
//     if(to.path != '/' ){
//       console.log('hahha')
//       var arr = document.cookie.split(";");
//       var val = ''
//       arr.forEach(el=>{
//         var temp = el.split('=');
//         if( temp[0]== 'name'){
//           val =temp[1] 
//         }
//       })
//       if(val === 'admin'){
//         console.log('in')
//         next()
//       }else{
//         console.log('to helllo')
//         next({name:'HelloWorld'})
//       }
      
//     }
      
  // }
  
  // 
  //参数：
  // false 从哪来回哪去（不允许跳转） next(false) 
  // 
// })
export default router;
