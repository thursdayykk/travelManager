<template>
  <div class="default-wra">
    <el-container style="height:100%;">
      <el-header style="height:80px;background:#545c64;box-shadow:2px 2px 5px #333;">
        <h1
          style="text-align:center;line-height:80px;color:#fff;letter-spacing: 5px;
    font-size: 30px;"
        >游厦门后台管理系统</h1>
      </el-header>
      <el-container>
        <el-aside style="width:200px;background:rgb(94, 115, 144)">
          <el-card
            class="box-card"
            style="background:rgb(94, 115, 144);height:100px;border:none;border-bottom:1px solid #e5e5e5"
          >
            <div class="text item" style="font-size:24px;text-align:center;color:#fff">管理员</div>
            <p style="text-align:right;">
              <el-button type="text">[登出]</el-button>
            </p>
          </el-card>
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="rgb(94, 115, 144)"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened="true"
          >
            <el-menu-item index="1" style="font-size:18px;">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'user'}" tag="span">用户管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="2" style="font-size:18px;">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'scenery'}" tag="span">景区管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="3" style="font-size:18px;">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'hotel'}" tag="span">酒店管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="4" style="font-size:18px;">
              <i class="el-icon-menu"></i>
              <span slot="title">
                <router-link :to="{name:'blog'}" tag="span">攻略管理</router-link>
              </span>
            </el-menu-item>
            <el-menu-item index="5" style="font-size:18px;">
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
export default {
  //怎么做面包屑？用vuex 路由变换时，push
  data() {
    return {
      breadcrumbList: []
    };
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    }
  },
  mounted() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta.title);
      this.breadcrumbList = matched;
    }
  }
};
</script>
<style scoped>
.default-wra {
  height: 100%;
}
</style>

