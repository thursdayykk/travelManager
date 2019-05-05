<template>
  <div class="default-wra">
    <el-container style="height:100%;">
      <el-header style="height:80px;background:#545c64;box-shadow:2px 2px 5px #333;">
        <el-row>
          <el-col :span="20">
            <h1
              style="text-align:center;line-height:80px;color:#fff;letter-spacing: 5px;
    font-size: 30px;"
            >游厦门后台管理系统</h1>
          </el-col>
          <el-col :span="4">
            <div
              class="headpic"
              @click="showUserMessage"
              style="display:inline-block;margin-top:20px;height:50px;"
            >
              <img :src="pic" alt style="width:50px;height:50px;border-radius:50%;">
              <el-dropdown class="loginOut" style>
                <span class="el-dropdown-link">
                  {{getUser.username}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>登出</el-dropdown-item>
                  <el-dropdown-item>
                    <router-link :to="{name:'userMsg'}" tag="li">修改个人资料</router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside style="width:200px;background:rgb(94, 115, 144)">
          <!-- <el-card
            class="box-card"
            style="background:rgb(94, 115, 144);height:100px;border:none;border-bottom:1px solid #e5e5e5"
          >
            <div class="text item" style="font-size:24px;text-align:center;color:#fff">管理员</div>
            <p style="text-align:right;">
              <el-button type="text" @click="loginOut">[登出]</el-button>
            </p>
          </el-card>-->
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="rgb(94, 115, 144)"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1" style="font-size:18px;" v-if="power == -1">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'user'}" tag="span">用户管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="2" style="font-size:18px;" v-if="power == - 1||power == 1">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'scenery'}" tag="span">景区管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="3" style="font-size:18px;" v-if="power == -1 || power == 2">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'hotel'}" tag="span">酒店管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="4" style="font-size:18px;" v-if="power==-1 || power == 3">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'blog'}" tag="span">攻略管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="5" style="font-size:18px;" v-if="power== -1 || power == 4">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'store'}" tag="span">美食管理</router-link>
              </span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item
                  v-for="item in breadcrumbList"
                  :key="item.path"
                  :to="item.redirect||item.path"
                >{{item.meta.title}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="text item">
              <router-view/>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import HEADPIC from "../assets/19.jpg";
export default {
  //怎么做面包屑？用vuex 路由变换时，push
  data() {
    return {
      breadcrumbList: [],
      pic:
        window.localStorage.getItem("pic") == "null" &&
        window.localStorage.getItem("pic")
          ? HEADPIC
          : window.localStorage.getItem("pic")
    };
  },
  watch:{
    // pic(newVal,oldVal){
    //   // console.log(newVal,oldVal)
    // }
  },
  computed: {
    ...mapGetters({ getUser: "GET_USER" }),
    // pic(){
    //   return this.getUser.pic
    // },
    power() {
      return this.getUser.power;
    }
  },
  watch: {
    $route(to, from) {
      console.log("to======", to);
      console.log("from====", from);
      this.getBreadcrumb();
    }
  },
  mounted() {
    this.getBreadcrumb();
  },
  created() {
    console.log(typeof this.getUser.power, this.getUser.power);
    console.log(window.localStorage.getItem("pic"));
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta.title);
      this.breadcrumbList = matched;
    },
    loginOut() {
      document.cookie = "name=admin;max-age=-1";
      this.$router.push({ name: "login" });
    },
    showUserMessage() {}
  }
};
</script>
<style scoped>
.default-wra {
  height: 100%;
}
.loginOut {
  color: #fff;
  font-size: 18px;
  vertical-align: top;
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
}
.loginOut :hover {
  /* cursor: pointer; */
}
</style>

