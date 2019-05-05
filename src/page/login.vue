<template>
  <div class="login-wra">
    <el-card class="box-card" style="margin-top:50px;">
      <div slot="header" class="clearfix">
        <h1 style="text-align:center">登录</h1>
      </div>
      <div class="text item">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="100px"
          class="demo-ruleForm"
          style="width:80%;"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm2.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="6" :offset="18">
              <router-link :to="{name:'register'}" type="li">注册成为商户</router-link>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import {mapMutations,mapGetters} from 'vuex'
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写用户名"));
      } else {
        if (this.ruleForm2.username !== "") {
          this.$axios.get('/getUserByUserName?username='+this.ruleForm2.username).then(res=>{
            // console.log("是否存在用户？",res)
            if(res.data.data.length > 0){
              // console.log('???');
              callback();
            }else{
              callback(new Error("不存在此用户名"))
            }
          }).catch(res=>{
            this.$message.error('请求失败！')
          })
          // this.$refs.ruleForm2.validateField("username");
        }
        // callback();
      }
    }
    return {
      ruleForm2: {
        username: window.sessionStorage.getItem('username'),
        password: window.sessionStorage.getItem('password')
      },
      rules2: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validateUser, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  computed:{
    ...mapGetters({
      getUser:'GET_USER'
      })
  },
  methods: {
    ...mapMutations({
      setUser:'SET_USER'
    }),
    submitForm(formName) {
      var root = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          window.sessionStorage.setItem('password',root.ruleForm2.password)
          root.$axios.post("/queryUserByUserName", root.ruleForm2).then(res => {
            if (res.data.status == "error") {
              root.$message.error(res.data.msg);
            } else if (res.data.status == "success") {
              root.$message.success(res.data.msg);
              root.setUser(res.data.data[0])
              window.sessionStorage.setItem('id',res.data.data[0].id)
              document.cookie = "name=" + root.getUser.username + ";max-age="+10800;
              document.cookie = "power=" +root.getUser.power + ";max-age="+10800;
              this.$router.push({path:"/"})
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

