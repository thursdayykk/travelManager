<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera;disabled= false;">添加美食</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          border
          highlight-current-row
        >
          <el-table-column prop="pic" label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:130px;height:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="店名" width="150"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
          <el-table-column prop="area" label="地区" width="80">
            <template slot-scope="scope">
              <span>{{areaList[scope.row.area_id]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.type_id]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="价格" width="80"></el-table-column>
          <el-table-column prop="opentime" label="营业时间" width="300"></el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >删除</el-button>
              <el-button
                @click.native.prevent="editRow(scope.$index, tableData)"
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
      <!-- <h3 style="text-align:center;margin-bottom:20px;">添加美食</h3> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        style
      >
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="店名" prop="name">
                  <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属地区" prop="areaId">
                  <el-select v-model="ruleForm.areaId" placeholder="请选择区域" :disabled="disabled">
                    <el-option label="集美区" value="1"></el-option>
                    <el-option label="湖里区" value="2"></el-option>
                    <el-option label="思明区" value="3"></el-option>
                    <el-option label="海沧区" value="4"></el-option>
                    <el-option label="同安区" value="5"></el-option>
                    <el-option label="翔安区" value="6"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" prop="typeId">
                  <el-select v-model="ruleForm.typeId" placeholder="请选择类型" :disabled="disabled">
                    <el-option label="西餐" value="1"></el-option>
                    <el-option label="中餐" value="2"></el-option>
                    <el-option label="粤菜" value="3"></el-option>
                    <el-option label="新疆菜" value="4"></el-option>
                    <el-option label="面馆" value="5"></el-option>
                    <el-option label="甜品" value="6"></el-option>
                    <el-option label="饮品" value="7"></el-option>
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
                  <el-input v-model="ruleForm.phone" :rows="6" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="营业时间" prop="opentime">
                  <el-input v-model="ruleForm.opentime" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="人均" prop="money">
                  <el-input v-model="ruleForm.money" type="number" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col>
                <el-form-item label="配图" prop="pic">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24"></el-col>
        </el-row>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="菜品管理" name="first">
            <el-row>
              <el-col :span="2" :offset="20">
                <el-button type="primary" @click="addFood" :disabled="disabled">添加</el-button>
              </el-col>
            </el-row>
            <el-table :data="foodList" stripe style="width: 100%">
              <el-table-column prop="title" label="菜名" width="260">
                <template slot-scope="{row,$index}">
                  <el-input v-model.number="foodList[$index].name" :disabled="disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="pic" label="图片">
                <template slot-scope="{row,$index}">
                  <input
                    type="file"
                    accept="image/gif, image/jpeg, image/jpg, image/png"
                    @change="uploadPhoto($event,'children',$index)"
                    :disabled="disabled"
                  >
                  <img :src="foodList[$index].pic" alt style="width:280px;height:140px;">
                </template>
              </el-table-column>
              <el-table-column prop="money" label="价格" width="150">
                <template slot-scope="{row,$index}">
                  <el-input v-model.number="foodList[$index].money" :disabled="disabled"></el-input>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteFood(scope.row)"
                    type="danger"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
            <el-tab-pane label="评论管理" name="second">
              <el-table :data="commentList" stripe style="width: 100%">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
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
        <el-row style="margin-top:50px">
          <el-col :span="6" :offset="6">
            <el-form-item>
              <el-button type="primary" @click="disabled = false;" v-show="disabled">编辑</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')" v-show="!disabled">提交</el-button>
              <el-button @click="resetForm('ruleForm')">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mode:'create',
      showOpera: true,
      activeName:'first',
            commentList: [],
      commentCount: 0,
      commentPage: 1,
      commentPageSize: 10,
      activeName: "first",
      currentPage: 1,
      totalData: 10,
      mode: "create",
      disabled: false,
      foodList: [],
      tableData: [
     
      ],
      areaList: {
        1: "集美区",
        2: "湖里区",
        3: "思明区",
        4: "海沧区",
        5: "同安区",
        6: "翔安区"
      },
      typeList: {
        1: "西餐",
        2: "中餐",
        3: "粤菜",
        4: "新疆菜",
        7: "面馆",
        5: "甜品",
        6: "饮品"
      },
      ruleForm: {
        name: "",
        pic: "",
        opentime: "",
        address: "",
        areaId: "",
        typeId: "",
        money: "",
        phone: "",
        updateFoodList: [],
        addFoodList: []
      },
      rules: {
        name: [{ required: true, message: "请填写店名", trigger: "blur" }],
        areaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        typeId: [{ required: true, message: "请选类型", trigger: "blur" }],
        pic: [{ required: true, message: "请选择封面", trigger: "blur" }],
        money: [{ required: true, message: "请填写人均费用", trigger: "blur" }],
        opentime: [{ required: true, message: "请营业时间", trigger: "blur" }],
        phone: [
          { required: true, message: "请填写店联系方式", trigger: "blur" }
        ],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters({ getUser: "GET_USER" })
  },
  created() {
    this.getTable();
  },
  methods: {
    uploadPhoto(e, type, index) {
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
        if (type == "children") {
          root.getFoodBase64(imgcode, index);
        } else {
          root.getStoreBase64(imgcode);
        }
      };
    },
    getStoreBase64(imgcode) {
      var root = this;
      root.canvasDataURL(imgcode, res => {
        //压缩
        // console.log("压缩后", res.length);
        root.ruleForm.pic = res;
      });
    },
    getFoodBase64(imgcode, index) {
      var root = this;
      root.canvasDataURL(imgcode, res => {
        //压缩
        // console.log("压缩后", res.length);
        root.foodList[index].pic = res;
      });
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
    getTable() {
      this.$axios
        .get("/getStoreByUserId?uId=" + window.sessionStorage.getItem("id"))
        .then(res => {
          this.tableData = res.data.data;
          this.$message.success("查询成功！");
        })
        .catch(res => {
          this.$message.error("查询失败！");
        });
    },
    deleteRow(index, rows) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get("/deleteStore?id=" + rows[index].id)
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
      this.ruleForm =JSON.parse(JSON.stringify(rows[index]));;
      this.ruleForm.areaId = rows[index].area_id + "";
      this.ruleForm.typeId = rows[index].type_id + "";
      this.$axios
        .get("/getFood?sId=" + this.ruleForm.id)
        .then(res => {
          this.foodList = res.data.data;
        })
        .catch(res => {});
      this.disabled = true;
      this.showOpera = !this.showOpera;
       this.mode = "edit";
       this.getComment(this.ruleForm.id);
      // rows.splice(index, 1);
    },
     getComment(id) {
      // console.log(id);
      this.$axios
        .get(
          "/getCommentByStoreId?storeId=" +
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
          this.commentCount = res.data.data.count;
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
          this.ruleForm.updateFoodList = [];
          this.ruleForm.addFoodList = [];
          if (this.foodList.length > 0) {
            for (let i = 0; i < this.foodList.length; i++) {
              if (this.foodList[i].id) {
                this.ruleForm.updateFoodList.push(this.foodList[i]);
              } else {
                this.ruleForm.addFoodList.push(this.foodList[i]);
              }
            }
          }
          if (!this.ruleForm.id) {
            //无id 则创建
            this.ruleForm.uId = window.sessionStorage.getItem("id");
            console.log("添加：", this.ruleForm);
            this.createStore();
          } else {
            //有id 则更新
            this.updateStore();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showOpera = !this.showOpera;
      this.getTable();
      this.foodList = [];
      this.ruleForm = {
        name: "",
        pic: "",
        opentime: "",
        address: "",
        areaId: "",
        typeId: "",
        money: "",
        phone: ""
      };
      this.mode="create"
    },
    createStore() {
      console.log(this.ruleForm);
      this.$axios
        .post("/addStore", this.ruleForm)
        .then(res => {
          console.log(res);
          this.$message.success("创建成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("创建失败！");
        });
    },
    updateStore() {
      this.$axios
        .post("/updateStore", this.ruleForm)
        .then(res => {
          console.log(res);
          this.$message.success("创建成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("创建失败！");
        });
    },
    addFood() {
      this.foodList.push({
        name: "",
        pic: "",
        money: ""
      });
    },
    deleteFood(food) {
      this.$confirm("此操作将永久删除以及相关菜品信息， 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var deleteId = [];
          this.foodList.forEach((el, index) => {
            el.idx = index;
          });
          if (food.id) {
            deleteId.push(parseInt(food.id));
            food.id = null;
          }
          if (!food.id) {
            console.log(food.idx);
            this.foodList.splice(food.idx, 1);
            this.foodList.forEach((el, index) => {
              el.idx = index;
            });
          }

          if (deleteId.length > 0) {
            this.$axios
              .get("/deleteFoodById?foodId=" + deleteId[0])
              .then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              })
              .catch(res => {
                this.$message({
                  type: "error",
                  message: "删除失败！"
                });
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
  margin-top: 5px;
}
</style>
