import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


// console.log(window.localStorage.getItem('username'))
export default new Vuex.Store({
    state: {
        curUser: {
            power: parseInt(window.sessionStorage.getItem('power')),
            username:window.sessionStorage.getItem('username'),
            pic: window.sessionStorage.getItem('pic')
        }

    },
    getters: {
        GET_USER(state) {
            return state.curUser
        }
    },
    mutations: {
        SET_USER(state, obj) {     
            state.curUser = {
                pic: obj.pic || null,
                username: obj.username,
                power: obj.power || state.curUser.power,
            };
            window.sessionStorage.setItem('pic', state.curUser.pic);
            window.sessionStorage.setItem('username', state.curUser.username);
            window.sessionStorage.setItem('power', state.curUser.power);
        }
    }
})