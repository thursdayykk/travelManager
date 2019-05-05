<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera">新增攻略</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          row-key="id"
          :expand-row-keys="expandKeys"
          @expand-change="expandChange"
        >
          <el-table-column type="expand">
            <template>
              <el-table v-loading="loading" :data="subTableData">
                <el-table-column label="第几天" prop="day"></el-table-column>
                <el-table-column label="目的地" prop="destination"></el-table-column>
                <el-table-column label="交通" prop="traffic"></el-table-column>
                <el-table-column label="周边美食" prop="store"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="攻略名" prop="title" width="150"></el-table-column>
          <el-table-column prop="pic" label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:130px;height:80px;">
            </template>
          </el-table-column>
          <!-- <el-table-column label="目的地" prop="destinations"></el-table-column> -->
          <el-table-column label="天数" prop="dayNum"></el-table-column>
          <!-- <el-table-column label="途经景区数" prop="destNum"></el-table-column> -->
          <el-table-column label="交通" prop="traffic"></el-table-column>
          <el-table-column label="人均费用" prop="money"></el-table-column>
          <el-table-column label="标签" prop="tags">
            <template slot-scope="scope">
              <el-tag
                :type="'primary'"
                disable-transitions
                v-for="(item,index) in scope.row.tags"
                :key="index"
              >{{item}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="住宿" prop="live"></el-table-column>
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
      <h3 style="text-align:center;margin-bottom:20px;">添加攻略</h3>
      <el-steps :active="active" finish-status="success">
        <el-step title="攻略基本信息"></el-step>
        <el-step title="每天计划"></el-step>
        <el-step title="提交"></el-step>
      </el-steps>
      <div style="margin-top: 20px;">
        <el-collapse-transition>
          <div v-show="active == 0 ? true : false">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              style="width:800px;"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item label="攻略标题" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="途径地" prop="destinations">
                    <el-input v-model="ruleForm.destination"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="途经景区数" prop="destNum">
                    <el-input v-model="ruleForm.destNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="天数" prop="dayNum">
                    <el-input v-model="ruleForm.dayNum"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
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
                </el-col>
                <el-col :span="8">
                  <el-form-item label="人均费用" prop="money">
                    <el-input v-model="ruleForm.money"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="交通" prop="traffic">
                    <el-input v-model="ruleForm.traffic" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="住宿" prop="live">
                    <el-input v-model="ruleForm.live" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="配图">
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/jpg, image/png"
                      @change="uploadPhoto($event)"
                    >
                    <img :src="ruleForm.pic" alt style="width:400px;height:220px;">
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="攻略简介" prop="content">
                    <el-input type="textarea" v-model="ruleForm.content"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="标签">
                    <!-- <el-input v-model="ruleForm.money"></el-input> -->
                    <div style="margin-bottom:10px;">
                      <el-input v-model="tagInp" style="width:200px;"></el-input>
                      <el-button type="text">添加</el-button>
                    </div>
                    <template>
                      <span class="tags" v-for="(item,index) in chooseTag" :key="index">{{item}}</span>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="active == 1 ? true : false">
            <el-collapse
              v-model="activeNames"
              @change="handleChange"
              v-if="sheduleList.length > 0"
              style="width:70%;margin:0 auto;"
            >
              <el-collapse-item
                :title="'Day' +  (index +1)"
                :name="index + 1"
                v-for="(item,index) in sheduleList"
                :key="index"
              >
                <el-form label-position="right" label-width="80px" :model="item">
                  <el-row>
                    <el-col :span="10" :offset="5">
                      <el-form-item label="目的地">
                        <el-input v-model="item.destination"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10" :offset="5">
                      <el-form-item label="行程描述">
                        <el-input v-model="item.content" type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10" :offset="5">
                      <el-form-item label="交通">
                        <el-input v-model="item.traffic"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10" :offset="5">
                      <el-form-item label="周边美食">
                        <el-input v-model="item.store" placeholder="逗号分开"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-row>
              <el-col :span="6" :offset="18">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="请确保行程天数与计划天数一致"
                  placement="top-start"
                >
                  <el-button type="text" @click="addShedule">添加行程</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="active == 2 ? true : false">
            <el-row>
              <el-col :span="8" :offset="10">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>

      <el-button style="margin-top: 12px;" @click="prev" :disabled="active == 0 ? true:false">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" :disabled="active == 2 ? true:false">下一步</el-button>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagInp: "",
      showOpera: true,
      expandKeys: [] /** 新增 **/,
      currentPage: 1,
      totalData: 10,
      loading: false,
      // sheduleBtn: true,
      active: 0,
      chooseTag: ["xxx", "bbb", "ccc"],
      activeNames: ["1"],
      sheduleList: [],
      tableData: [
        {
          id: "1",
          title: "鼓浪屿三日游",
          content: "xxxx",
          pic:
            "//p1.meituan.net/msmerchant/4ed6d6a4910447a8477202ee9e91d977383566.jpg@515w_291h_1e_1c",
          destinations: "xxxxx",
          dayNum: 0,
          destNum: 0,
          live: "xxxxxxxxx酒店",
          money: 1100,
          traffic: "918路，959路,959路至鼓浪屿站",
          tags: ["鼓浪屿", "三日游"]
        }
      ],
      subTableData: [
        {
          destination: "鼓浪屿1",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
          day: 1,
          traffic: "918路，959路,959路至鼓浪屿站",
          store: ["xxxx店", "aaaa店", "bbbb店"]
        },
        {
          destination: "鼓浪屿1",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
          day: 2,
          traffic: "918路，959路,959路至鼓浪屿站",
          store: ["xxxx店", "aaaa店", "bbbb店"]
        },
        {
          destination: "鼓浪屿1",
          content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
          day: 3,
          traffic: "918路，959路,959路至鼓浪屿站",
          store: ["xxxx店", "aaaa店", "bbbb店"]
        }
      ],
      ruleForm: {
        title: "",
        pic: "",
        content: "",
        live: "",
        money: "",
        money: "",
        dayNum: "",
        destNum: "",
        destinations: "",
        traffic: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        
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
    prev() {
      if (this.active-- < 0) this.active = 2;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
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
    },
    expandChange(row, expandedRows) {
      console.log(row, expandedRows);
      if (this.expandKeys.indexOf(row.id) >= 0) {
        //收起当前行
        this.expandKeys.shift();
        return;
      }
      let _this = this;
      //恢复默认值
      _this.loading = true;
      // _this.subTableData = [];
      //加载数据
      // axios
      //   .get("/subtable/data")
      //   .then(function(res) {
      //     _this.subTableData = res.data;
      _this.loading = false;
      //     _this.expandKeys.shift(); /** 新增 **/
      //     _this.expandKeys.push(row.id); /** 新增 **/
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
      if (expandedRows.length > 1) {
        //只展开当前选项
        expandedRows.shift();
      }
    },
    handleChange(val) {
      console.log(val);
    },
    addShedule() {
      if (this.sheduleList.length >= this.ruleForm.dayNum) {
        this.$message.error("请确保计划天数与行程天数一致！");
        return;
      } else {
        this.sheduleList.push({
          destination: "",
          content: "",
          traffic: "",
          store: ""
        });
      }
    }
  }
};
</script>
<style scoped>
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
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
}
</style>
