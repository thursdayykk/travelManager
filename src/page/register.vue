<template>
  <div>
    <el-card class="box-card" style="margin-top:50px;">
      <div slot="header" class="clearfix">
        <h1 style="text-align:center">注册</h1>
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
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item label="验证码" prop="code">
                <el-input type="password" v-model="ruleForm2.code" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <span v-html="randomCode" @click="changeCode"></span>
            </el-col>
          </el-row>

          <el-form-item label="商户类型" prop="power">
            <el-select v-model="ruleForm2.power" placeholder="请选择商户类型">
              <el-option label="景区营业者" value="1"></el-option>
              <el-option label="酒店商户" value="2"></el-option>
              <el-option label="攻略作者" value="3"></el-option>
              <el-option label="餐饮商户" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="5" :offset="19">
              <router-link :to="{name:'login'}">已有账号？</router-link>
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
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (this.ruleForm2.code !== "") {
          if(this.ruleForm2.code != this.rightCode){
            callback(new Error("验证码错误，请重新输入"));
          }
          // this.$refs.ruleForm2.validateField("code");
        }
        callback();
      }
    };
     var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写用户名"));
      } else {
        if (this.ruleForm2.username !== "") {
          this.$axios.get('/getUserByUserName?username='+this.ruleForm2.username).then(res=>{
            // console.log("是否存在用户？",res)
            if(res.data.data.length > 0){
              // console.log('???');
              callback(new Error("已存在该用户！请重新填写"));
            }else{
              callback()
            }
          }).catch(res=>{
            this.$message.error('请求失败！')
          })
          // this.$refs.ruleForm2.validateField("username");
        }
        // callback();
      }
    };
    return {
      randomCode: "",
      rightCode: "",
      ruleForm2: {
        username: "",
        password: "",
        power: "",
        checkPass: "",
        code: ""
      },
      rules2: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
           { validator: validateUser, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [
          { required: true, message: "请再一次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        power: [
          { required: true, message: "请选择商户类型", trigger: "change" }
        ],
        code: [
          { required: true, message: "请填写验证码", trigger: "blur" },
          {
            validator: validateCode,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.changeCode();
  },
  methods: {
        ...mapMutations({
      setUser:'SET_USER'
    }),
    submitForm(formName) {
      var root = this;
      this.$refs[formName].validate(valid => {
        console.log(this.ruleForm2)
        if (valid) {
          root.$axios.post("/register", root.ruleForm2).then(res => {
            console.log(res)
            if (res.data.status == "success") {
              
              window.sessionStorage.setItem('id',res.data.data.insertId)
              window.sessionStorage.setItem('password',root.ruleForm2.password)
              window.sessionStorage.setItem('username',root.ruleForm2.username)
              this.$message.success(res.data.msg);
              root.setUser(root.ruleForm2)
              document.cookie = "name=" + root.ruleForm2.username + ";max-age=" + 10800;
              document.cookie = "power=" +root.ruleForm2.power + ";max-age="+10800;
              this.$router.push({ path: "/" });
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
    },
    changeCode() {
      var root = this;
      this.$axios
        .get("/getRandomCode")
        .then(res => {
          // console.log(res)
          this.randomCode = res.data.data.data;
          this.rightCode = res.data.data.text;
        })
        .catch(res => {
          console.log("请求失败！");
        });
    }
  }
};
</script>
