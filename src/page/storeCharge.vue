<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera">创建用户</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          border
          highlight-current-row
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="菜品">
                  <span
                    style="margin-right:10px;color:#f60;"
                    v-for="item in props.row.food"
                    :key="item"
                  >{{ item }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="pic" label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:130px;height:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="店名" width="150"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
          <el-table-column prop="area" label="地区" width="80"></el-table-column>
          <el-table-column prop="money" label="价格" width="80"></el-table-column>
          <el-table-column prop="opentime" label="营业时间" width="80"></el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >移除</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                size="small"
                type="text"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="block" style="text-align:center;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="totalData"
          ></el-pagination>
        </div>
      </el-row>
    </div>
    <div v-show="!showOpera">
      <h3 style="text-align:center;margin-bottom:20px;">添加美食</h3>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:500px;margin:0 auto;"
      >
        <el-form-item label="店名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属地区" prop="area">
          <el-select v-model="ruleForm.area" placeholder="请选择区域">
            <el-option label="集美区" value="1"></el-option>
            <el-option label="湖里区" value="2"></el-option>
            <el-option label="思明区" value="3"></el-option>
            <el-option label="海沧区" value="4"></el-option>
            <el-option label="同安区" value="5"></el-option>
            <el-option label="翔安区" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="配图">
          <input
            type="file"
            accept="image/gif, image/jpeg, image/jpg, image/png"
            @change="uploadPhoto($event)"
          >
          <img :src="ruleForm.pic" alt style="width:400px;height:220px;">
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="opentime">
          <el-input v-model="ruleForm.opentime"></el-input>
        </el-form-item>
        <el-form-item label="人均" prop="money">
          <el-input v-model="ruleForm.money"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜品">
              <!-- <el-input v-model="ruleForm.money"></el-input> -->
              <div style="margin-bottom:10px;">
                <el-input v-model="foodInp" style="width:200px;"></el-input>
                <el-button type="text" @click="foodList.push(foodInp)" :disabled="!foodInp">添加</el-button>
              </div>
              <template>
                <span class="tags" v-for="(item,index) in foodList" :key="index">{{item}}</span>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showOpera: true,
      currentPage: 1,
      totalData: 10,
      foodList: [],
      foodInp: "",
      tableData: [
        {
          name: "金泉港IMAX国际影城",
          address: "朝阳区大屯里金泉购物中心318号楼4层",
          pic:
            "//p1.meituan.net/msmerchant/4ed6d6a4910447a8477202ee9e91d977383566.jpg@515w_291h_1e_1c",
          area: "集美区",
          money: 128,
          opentime: "8：30-22：00",
          phone: "12855-25654161",
          food: [
            "aaa",
            "bbb",
            "ccc",
            "aaa",
            "bbb",
            "ccc",
            "aaa",
            "bbb",
            "ccc",
            "aaa",
            "bbb",
            "ccc"
          ]
        }
      ],
      ruleForm: {
        name: "",
        pic: "",
        opentime: "",
        address: "",
        area: "",
        money: "",
        phone: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    uploadPhoto(e) {
      var root = this;
      // 利用fileReader对象获取file
      console.log(e);
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
          root.ruleForm.pic = res;
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
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showOpera = !this.showOpera;
    }
  }
};
</script>
<style scoped>
.addBtn {
  padding-bottom: 10px;
}
.tableCon {
}
.page {
}
.tags {
  margin-right: 10px;
  display: inline-block;
  padding: 0px 10px;
  border-radius: 10px;
  background: #409eff;
  color: #fff;
  margin-top:5px;
}
</style>
