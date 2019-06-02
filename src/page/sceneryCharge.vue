<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera">添加景区</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table :data="tableData" style="width: 100%" max-height="400">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="top" class="demo-table-expand">
                <el-form-item label="景区介绍">
                  <span>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item label="交通攻略">
                  <span>{{ props.row.traffic }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="pic" label="图片" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:180px;height:100px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="景区名" width="130"></el-table-column>
          <el-table-column prop="area" label="所属区域" width="80">
            <template slot-scope="scope">
              <span>{{areaList[scope.row.area_id]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址" width="200"></el-table-column>
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
                @click.native.prevent="editRow(scope.$index, tableData)"
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
      <!-- <h3 style="text-align:center;margin-bottom:20px;">添加景区</h3> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col>
                <el-form-item label="景区名" prop="name">
                  <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="所属地区" prop="areaId">
                  <el-select
                    v-model="ruleForm.areaId"
                    placeholder="请选择区域"
                    @change="changeArea"
                    :disabled="disabled"
                  >
                    <el-option label="集美区" value="1"></el-option>
                    <el-option label="湖里区" value="2"></el-option>
                    <el-option label="思明区" value="3"></el-option>
                    <el-option label="海沧区" value="4"></el-option>
                    <el-option label="同安区" value="5"></el-option>
                    <el-option label="翔安区" value="6"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="详细地址" prop="address">
                  <el-input v-model="ruleForm.address" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="联系方式" prop="phone">
                  <el-input v-model="ruleForm.phone" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="营业时间" prop="phone">
                  <el-input v-model="ruleForm.opentime" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="景区介绍" prop="content">
              <el-input type="textarea" v-model="ruleForm.content" :rows="4" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="交通" prop="traffic">
              <el-input type="textarea" v-model="ruleForm.traffic" :rows="2" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="配图">
              <input
                type="file"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="uploadPhoto($event)"
                :disabled="disabled"
              >
              <img :src="ruleForm.pic" alt style="width:400px;height:220px;">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="mode != 'create'">
          <el-col :span="20" :offset="2">
            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane label="评论管理" name="first">
                <el-table :data="commentList" stripe style="width: 100%">
                  <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                  <el-table-column prop="username" label="用户名" width="180"></el-table-column>
                  <el-table-column prop="content" label="内容" width="450">
                    <template slot-scope="scope">
                      <span>{{scope.row.content.length > 50 ?scope.row.content.substring(0,50)+'....':scope.row.content}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ctime" label="发布时间">
                    <template slot-scope="scope">
                      <span>{{imeFormatter(scope.row.ctime)}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :total="commentCount"
                  @current-change="currentCommentPage"
                ></el-pagination>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-form-item style="margin-top:20px;">
          <el-button type="primary" @click="disabled = false" v-show="disabled">编辑</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" v-show="!disabled">提交</el-button>
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
      mode: "create",
      showOpera: true,
      disabled: false,
      currentPage: 1,
      commentList: [],
      commentCount: 0,
      commentPage: 1,
      commentPageSize: 10,
      activeName: "first",
      totalData: 10,
      tableData: [],
      areaList: {
        1: "集美区",
        2: "湖里区",
        3: "思明区",
        4: "海沧区",
        5: "同安区",
        6: "翔安区"
      },
      ruleForm: {
        name: "",
        pic: "",
        content: "",
        traffic: "",
        opentime: "",
        areaId: "",
        phone: "",
        address: "",
        userId: ""
      },
      rules: {
        name: [{ required: true, message: "请填写景区名", trigger: "blur" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ],
        areaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        pic: [{ required: true, message: "请上传景区图片", trigger: "blur" }],
        phone: [{ required: true, message: "请填写联系方式", trigger: "blur" }],
        opentime: [
          { required: true, message: "请填写营业时间", trigger: "blur" }
        ],
        traffic: [{ required: true, message: "请填写交通", trigger: "blur" }],
        content: [
          { required: true, message: "请填写景区介绍", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTable();
  },
  methods: {
    changeArea(a) {
      this.ruleForm.areaId = a + "";
      this.ruleForm.area_id = a + "";
    },
    getTable() {
      this.$axios
        .get("/getSceneryByUserId?uId=" + window.sessionStorage.getItem("id"))
        .then(res => {
          console.log(res);
          this.tableData = res.data.data;
          this.$message.success("查询成功！");
        })
        .catch(res => {
          this.$message.error("查询失败！");
        });
    },
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
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get("/deleteScenery?id=" + rows[index].id)
            .then(res => {
              rows.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editRow(index, rows) {
      // rows.splice(index, 1);
      this.ruleForm = JSON.parse(JSON.stringify(rows[index]));
      this.ruleForm.areaId = rows[index].area_id + "";
      // console.log(this.ruleForm);
      this.showOpera = !this.showOpera;
      this.disabled = true;
      this.mode = "edit";
      this.getComment(this.ruleForm.id);
    },
    getComment(id) {
      // console.log(id);
      this.$axios
        .get(
          "/querySceneryCommentBySceneryId?sId=" +
            id +
            "&page=" +
            (this.commentPage - 1) +
            "&pageSize=" +
            this.commentPageSize
        )
        .then(res => {
          // console.log(this.currentCommentPage);
          console.log(res);
          console.log(this.commentPage);
          this.commentCount = res.data.data.commentCount;
          this.commentList = res.data.data.commentList;
        });
    },
    currentCommentPage(curPage) {
      console.log(curPage);
      this.commentPage = curPage;
      this.getComment(this.ruleForm.id);
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
          if (this.ruleForm.id) {
            this.updateScenery();
          } else {
            this.createScenery();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createScenery() {
      this.ruleForm.userId = window.sessionStorage.getItem("id");
      this.$axios
        .post("/addScenery", this.ruleForm)
        .then(res => {
          this.$message.success("创建成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("创建失败！");
        });
    },
    updateScenery() {
      console.log("更新", this.ruleForm);
      this.$axios
        .post("/updateScenery", this.ruleForm)
        .then(res => {
          this.$message.success("编辑成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("编辑失败！");
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        name: "",
        pic: "",
        content: "",
        traffic: "",
        opentime: "",
        areaId: "",
        phone: "",
        address: "",
        userId: ""
      };
      this.showOpera = !this.showOpera;
      this.disabled = false;
      this.mode = "create";
      this.getTable();
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

