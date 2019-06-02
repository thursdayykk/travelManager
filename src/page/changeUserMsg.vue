<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="16">
              <el-form-item label="用户名" prop="username">
                <el-input
                  type="text"
                  v-model="ruleForm.username"
                  autocomplete="off"
                  :disabled="show"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="用户类型">
                <el-select v-model="ruleForm.power" disabled>
                  <el-option label="管理员" value="-1"></el-option>
                  <el-option label="普通用户" value="0"></el-option>
                  <el-option label="景区营业者" value="1"></el-option>
                  <el-option label="酒店商户" value="2"></el-option>
                  <el-option label="攻略作者" value="3"></el-option>
                  <el-option label="餐饮商户" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="注册时间" prop="ctime">
                <el-input v-model="ruleForm.ctime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <img
            :src="ruleForm.userPic ? ruleForm.userPic :pic"
            alt
            style="width:150px;height:150px;border-radius:50%;"
          >
          <input
            type="file"
            style="margin-top:10px;margin-bottom:10px;margin-left:10px;"
            :disabled="show"
            accept="image/gif, image/jpeg, image/jpg, image/png"
            @change="uploadPhoto($event)"
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="show = false" v-if="show">编辑</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" v-if="!show">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import HEADPIC from "../assets/19.jpg";
export default {
  data() {
    return {
      show: true,
      pic: HEADPIC,
      ruleForm: {
        id: "",
        userPic: "",
        ctime: "",
        username: "",
        power: ""
      },
      powerList: {
        "-1": "管理员",
        "0": "普通用户",
        "1": "景区营业者",
        "2": "酒店商户",
        "3": "攻略作者",
        "4": "餐饮商户"
      },
      rules: {
        username: [{ required: true, message: "请填写用户名", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters({ getUser: "GET_USER" })
  },
  created() {
      this.$axios
        .get(
          "/getUserByUsername?username=" +
            this.getUser.username +
            "&mode=" +
            "full"
        )
        .then(res => {
          if (res.data.data.length > 0) {
            
            let data = res.data.data[0];
            this.ruleForm.id = data.id;
            this.ruleForm.userPic = data.pic;
            this.ruleForm.power = this.powerList[data.power];
            this.ruleForm.username = data.username;
            this.ruleForm.ctime = this.imeFormatter(data.ctime);
          } else {
            alert("请重新登录！");
            this.$router.push({ name: "login" });
          }
        })
        .catch(res => {
          this.$message.error("个人信息请求失败！");
        });
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    uploadPhoto(e) {
      var root = this;
      // 利用fileReader对象获取file
      var file = e.target.files[0];
      var filesize = file.size;
      var filename = file.name;
      console.log("压缩前", file.size);
      // 2,621,440   2M
      100304;
      if (filesize > 2101440) {
        // 图片大于2MB
        return;
        this.$message.error("图片大小不能超过2M");
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        var imgcode = e.target.result;
        root.canvasDataURL(imgcode, res => {
          //压缩
          console.log("压缩后", res.length);
          root.ruleForm.userPic = res;
        });
      };
    },

    canvasDataURL(path, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = 400;
        var anh = document.createAttribute("height");
        anh.nodeValue = 220;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, 400, 220);
        // // 图像质量
        // if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        //   quality = obj.quality;
        // }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    imeFormatter(value) {
      var da = new Date(
        value
          .replace("/Date(", "")
          .replace(")/", "")
          .split("+")[0]
      );
      return (
        da.getFullYear() +
        "-" +
        (da.getMonth() + 1 < 10
          ? "0" + (da.getMonth() + 1)
          : da.getMonth() + 1) +
        "-" +
        (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) +
        " " +
        (da.getHours() < 10 ? "0" + da.getHours() : da.getHours()) +
        ":" +
        (da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes()) +
        ":" +
        (da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds())
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/changeUserMsg", {
              id: this.ruleForm.id,
              username: this.ruleForm.username,
              pic: this.ruleForm.userPic
            })
            .then(res => {
              this["SET_USER"]({
                id: this.ruleForm.id,
                username: this.ruleForm.username,
                pic: this.ruleForm.userPic
              });
              this.$message.success("修改成功！");
            })
            .catch(res => {
              this.$message.error("修改失败！");
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
    changePic() {}
  }
};
</script>
