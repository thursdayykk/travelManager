<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera">添加景区</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table :data="tableData" style="width: 100%" max-height="400">
          <el-table-column prop="name" label="景区名" width="200" fixed></el-table-column>
          <el-table-column prop="pic" label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:130px;height:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="area" label="所属区域" width="100"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="traffic" label="交通" width="300"></el-table-column>
          <el-table-column prop="opentime" label="营业时间" width="150"></el-table-column>
          <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >移除</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >编辑</el-button>
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
      <h3 style="text-align:center;margin-bottom:20px;">添加景区</h3>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style="width:500px;margin:0 auto;"
      >
        <el-form-item label="景区名" prop="name">
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
        <el-form-item label="景区介绍" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="phone">
          <el-input v-model="ruleForm.opentime"></el-input>
        </el-form-item>
        <el-form-item label="交通" prop="traffic">
          <el-input type="textarea" v-model="ruleForm.traffic" :rows="2"></el-input>
        </el-form-item>

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
      tableData: [
        {
          name: "金泉港IMAX国际影城",
          address: "朝阳区大屯里金泉购物中心318号楼4层",
          pic:
            "//p1.meituan.net/msmerchant/4ed6d6a4910447a8477202ee9e91d977383566.jpg@515w_291h_1e_1c",
          area: "集美区",
          traffic: "918路，959路,959路至鼓浪屿站",
          opentime: "周一至周日8：30-22：30",
          phone: "12855-25654161"
        }
      ],
      ruleForm: {
        name: "",
        pic: "",
        content: "",
        traffic: "",
        opentime: "",
        area: "",
        phone: "",
        address: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
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
</style>

