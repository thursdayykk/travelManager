<template>
  <div class="blank-wra">
    <el-container>
        <el-header style="height:80px;background:#545c64;box-shadow:2px 2px 5px #333;">
            <h1 style="text-align:center;line-height:80px;color:#fff;letter-spacing: 5px;
    font-size: 30px;">游厦门后台管理系统</h1>
        </el-header>
      <el-main class="blank-content">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped>
.blank-wra {
  /* width:600px;
    margin: auto; */
}
.blank-content{
     width:600px;
    margin: auto;
}
</style>

