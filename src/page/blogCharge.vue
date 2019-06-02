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
          <el-table-column label="天数" prop="dayNum" width="50"></el-table-column>
          <!-- <el-table-column label="途经景区数" prop="destNum"></el-table-column> -->
          <el-table-column label="交通" prop="traffic" width="200"></el-table-column>
          <el-table-column label="人均费用" prop="money"></el-table-column>
          <el-table-column label="标签" prop="tags">
            <!-- <template slot-scope="scope">
              <el-tag
                :type="'primary'"
                disable-transitions
                v-for="(item,index) in scope.row.tags.split(',')"
                :key="index"
              >{{item}}</el-tag>
            </template>-->
          </el-table-column>
          <el-table-column label="住宿" prop="live" width="200"></el-table-column>
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
      <!-- <h3 style="text-align:center;margin-bottom:20px;">添加攻略</h3> -->
      <el-steps :active="active" finish-status="success" style="width:80%;margin:0 auto;">
        <el-step title="攻略基本信息"></el-step>
        <el-step title="制订每日计划"></el-step>
        <el-step title="最后一步"></el-step>
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
            >
              <el-row>
                <el-col :span="12">
                  <el-row>
                    <el-col>
                      <el-form-item label="攻略标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <!-- <el-form-item label="途径地" prop="destinations">
                        <el-input v-model="ruleForm.destination"></el-input>
                      </el-form-item>-->
                    </el-col>
                    <el-col>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="途经景区数" prop="destNum">
                            <el-input-number v-model="ruleForm.destNum" :min="1"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="天数" prop="dayNum">
                            <el-input-number v-model="ruleForm.dayNum" :min="1"></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col>
                      <el-row>
                        <!-- <el-col :span="12">
                          <el-form-item label="所属地区" prop="areaId">
                            <el-select v-model="ruleForm.areaId" placeholder="请选择区域">
                              <el-option label="集美区" value="1"></el-option>
                              <el-option label="湖里区" value="2"></el-option>
                              <el-option label="思明区" value="3"></el-option>
                              <el-option label="海沧区" value="4"></el-option>
                              <el-option label="同安区" value="5"></el-option>
                              <el-option label="翔安区" value="6"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                          <el-form-item label="人均费用" prop="money">
                            <el-input v-model="ruleForm.money" type="number"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col>
                      <el-form-item label="交通" prop="traffic">
                        <el-input v-model="ruleForm.traffic" type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="住宿" prop="live">
                        <el-input v-model="ruleForm.live" type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="攻略简介" prop="content">
                    <el-input type="textarea" v-model="ruleForm.content"></el-input>
                  </el-form-item>
                  <el-form-item label="标签">
                    <!-- <el-input v-model="ruleForm.money"></el-input> -->
                    <div style="margin-bottom:10px;">
                      <el-input v-model="tagInp" style="width:200px;"></el-input>
                      <el-button
                        type="text"
                        @click="tagInp.trim() != '' && chooseTag.push(tagInp);tagInp=''"
                        :disabled="disabled || tagInp == ''"
                      >添加</el-button>
                    </div>
                    <template>
                      <span
                        class="tags"
                        v-for="(item,index) in chooseTag"
                        :key="index"
                        @click="deleteTag(index)"
                      >{{item}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="配图" prop="pic">
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/jpg, image/png"
                      @change="uploadPhoto($event)"
                    >
                    <img :src="ruleForm.pic" alt style="width:400px;height:220px;">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="active == 1 ? true : false">
            <el-row style="margin-bottom:20px;">
              <el-col :span="6" :offset="3">
                <el-button type="primary" icon="el-icon-plus" @click="addShedule">添加行程</el-button>
              </el-col>
            </el-row>

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
                <el-form
                  label-position="right"
                  label-width="80px"
                  :model="item"
                  :rules="sheduleRules"
                >
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="目的地" prop="destination">
                        <el-input v-model="item.destination"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="交通" prop="traffic">
                        <el-input v-model="item.traffic" type="textarea" :rows="2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="行程描述" prop="content">
                        <el-input v-model="item.content" type="textarea" :rows="4"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="周边美食">
                        <el-input v-model="item.store" placeholder="逗号分开"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4" :offset="20">
                      <el-button type="danger" @click="deleteShedule(index)">删除</el-button>
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
                ></el-tooltip>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="active == 2 ? true : false">
            <el-row>
              <el-col :span="8" :offset="10">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
      <el-row style="margin-bottom:20px;">
        <el-col :span="10" :offset="8">
          <el-button
            style="margin-top: 12px;"
            @click="prev"
            :disabled="active == 0 ? true:false"
          >上一步</el-button>
          <el-button
            style="margin-top: 12px;"
            @click="next"
            :disabled="active == 2 ? true:false"
          >下一步</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-col>
      </el-row>
      <el-row v-if="mode != 'create'">
        <el-col :span="20" :offset="2">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="评论管理" name="first">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagInp: "",
      mode: "add",
      showOpera: true,
      disabled: false,
      expandKeys: [] /** 新增 **/,
      currentPage: 1,
      totalData: 10,
      loading: false,
      // sheduleBtn: true,
      active: 0,
      chooseTag: [],
      activeNames: ["1"],
      sheduleList: [],
      tableData: [],
      subTableData: [],
      ruleForm: {
        title: "",
        pic: "",
        content: "",
        live: "",
        money: "",
        dayNum: "",
        destNum: "",
        destinations: "",
        traffic: "",
        tags: "",
        deleteTagList: []
      },
      rules: {
        title: [{ required: true, message: "请填写攻略名", trigger: "blur" }],
        pic: [{ required: true, message: "请上传攻略封面", trigger: "blur" }],
        content: [
          { required: true, message: "请填写攻略简介", trigger: "blur" }
        ],
        live: [{ required: true, message: "请填写住宿攻略", trigger: "blur" }],
        money: [{ required: true, message: "请填写人均费用", trigger: "blur" }],
        dayNum: [
          { required: true, message: "请填写游玩天数", trigger: "blur" }
        ],
        destNum: [
          { required: true, message: "请填写途径目的地个数", trigger: "blur" }
        ],
        // destinations: [
        //   { required: true, message: "请输入活动名称", trigger: "blur" }
        // ],
        traffic: [
          { required: true, message: "请填写交通攻略", trigger: "blur" }
        ]
        // areaId: [{ required: true, message: "请填写交通攻略", trigger: "blur" }]
      },
      sheduleRules: {
        content: [{ required: true, message: "请填写描述", trigger: "blur" }],
        traffic: [{ required: true, message: "请填写交通", trigger: "blur" }],
        destination: [
          { required: true, message: "请填写描述", trigger: "blur" }
        ]
      },
       commentList: [],
      commentCount: 0,
      commentPage: 1,
      commentPageSize: 10,
      activeName: "first"
    };
  },
  created() {
    this.getTable();
  },
  methods: {
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
    getTable() {
      this.$axios
        .get("/getBlogByUserId?uId=" + window.sessionStorage.getItem("id"))
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
       this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get("/deleteBlog?id=" + rows[index].id)
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.sheduleList.length; i++) {
            let item = this.sheduleList[i];
            if (!item.content || !item.traffic || !item.destination) {
              this.$message.error("第" + (i + 1) + "天的计划填写不完整！");
              return false;
            }
          }
          if (this.sheduleList.length != this.ruleForm.dayNum) {
            this.$message.error("计划天数与计划不一致！");
            return false;
          }
          //整理途径目的地
          let destStr = [];
          for (let i = 0; i < this.sheduleList.length; i++) {
            let item = this.sheduleList[i];
            destStr.push(item.destination);
          }
          this.ruleForm.destinations = destStr.join(",");

          //整理tag
          this.ruleForm.tags = this.chooseTag.join(",");

          if (this.ruleForm.id) {
            this.ruleForm.updateShedule = [];
            this.ruleForm.addShedule = [];
            for (let i = 0; i < this.sheduleList.length; i++) {
              this.sheduleList[i].day = i + 1;
              if (this.sheduleList[i].id) {
                this.ruleForm.updateShedule.push(this.sheduleList[i]);
              } else {
                this.ruleForm.addShedule.push(this.sheduleList[i]);
              }
            }
            this.updateBlog();
          } else {
            this.ruleForm.addShedule = [];
            for (let i = 0; i < this.sheduleList.length; i++) {
              this.sheduleList[i].day = i + 1;
              this.ruleForm.addShedule.push(this.sheduleList[i]);
            }
            this.createBlog();
          }
        } else {
          this.$message.error("请检查信息是否完整后再提交！");
          return false;
        }
      });
    },
     getComment(id) {
      // console.log(id);
      this.$axios
        .get(
          "/getCommentByBlogId?blogId=" +
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
    createBlog() {
      //
      this.ruleForm.uId = window.sessionStorage.getItem("id");
      this.$axios
        .post("/addBlog", this.ruleForm)
        .then(res => {
          console.log(res);
          this.$message.success("创建成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("创建失败！");
        });
    },
    updateBlog() {
      console.log("更新");
      this.$axios
        .post("/updateBlog", this.ruleForm)
        .then(res => {
          console.log(res);
          this.$message.success("更新成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {
          this.$message.error("更新失败！");
        });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showOpera = !this.showOpera;
      this.mode = "add";
      this.ruleForm = {
        title: "",
        pic: "",
        content: "",
        live: "",
        money: "",
        dayNum: "",
        destNum: "",
        destinations: "",
        traffic: "",
        tags: "",
        deleteTagList: []
      };
      this.tagInp = "";
      this.chooseTag = [];
      this.sheduleList = [];
      this.mode="create";
      this.active = 0;
    },
    expandChange(row, expandedRows) {
      // console.log(row, expandedRows);
      if (this.expandKeys.indexOf(row.id) >= 0) {
        //收起当前行
        this.expandKeys.shift();
        return;
      }
      let _this = this;
      //恢复默认值
      _this.loading = true;
      _this.subTableData = [];
      this.$axios
        .get("getSheduleByBlogId?bId=" + row.id)
        .then(function(res) {
          // console.log(res)
          _this.subTableData = res.data.data;
          _this.loading = false;
          _this.expandKeys.shift(); /** 新增 **/
          _this.expandKeys.push(row.id); /** 新增 **/
        })
        .catch(function(error) {
          this.$message.error("获取详细攻略信息失败！");
        });
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
    },
    deleteSedule(index) {
      this.$confirm("此操作将永久删除。 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.sheduleList[index].id) {
            //存在id 接口删
            //接口
            this.$axios
              .get("/deleteSheduleById?id=" + this.sheduleList[index].id)
              .then(res => {
                this.$message.success("删除行程成功！");
                this.sheduleList.splice(index, 1);
              })
              .catch(res => {
                this.$message.error("删除行程失败！");
              });
          } else {
            this.sheduleList.splice(index, 1);
          }
          //不存在 & 存在 都要直接列表剔除
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editRow(index, rows) {
      this.mode = "edit";
      this.ruleForm = JSON.parse(JSON.stringify(rows[index]));
      this.chooseTag = this.ruleForm.tags.split(",");
      this.ruleForm.deleteTagList = [];
      this.getComment(this.ruleForm.id)
      this.$axios
        .get("getSheduleByBlogId?bId=" + this.ruleForm.id)
        .then(res => {
          this.sheduleList = res.data.data;
          this.showOpera = !this.showOpera;
        })
        .catch(res => {
          this.$message.error("获取计划失败！");
        });
    },
    deleteTag(index) {
      //未写接口
      if (this.mode == "edit") {
        this.$confirm("此操作将永久删除。 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ruleForm.deleteTagList.push(this.chooseTag[index]);
            this.chooseTag.splice(index, 1);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else if (this.mode == "add") {
        this.chooseTag.splice(index, 1);
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
