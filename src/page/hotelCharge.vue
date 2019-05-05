<template>
  <div>
    <div v-show="showOpera">
      <el-row class="addBtn">
        <el-button type="primary" size="small" @click="showOpera = !showOpera;disabled = false">添加酒店</el-button>
      </el-row>
      <el-row class="tableCon">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          border
          highlight-current-row
          v-loading="loading"
        >
          <el-table-column prop="pic" label="图片" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt style="width:130px;height:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="酒店名" width="150"></el-table-column>
          <el-table-column prop="address" label="地址" width="300"></el-table-column>
          <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
          <el-table-column prop="area" label="地区" width="80"></el-table-column>
          <el-table-column prop="type_id" label="类型" width="80">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.type_id]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="价格" width="80"></el-table-column>
          <el-table-column prop="grade" label="评分" width="80"></el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >删除</el-button>
              <el-button
                @click.native.prevent="editRow(tableData[scope.$index])"
                size="small"
                type="text"
              >查看</el-button>
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
      <h3 style="margin-bottom:50px;">编辑酒店</h3>
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
              <el-form-item label="酒店名" prop="name">
                <el-input v-model="ruleForm.name" :disabled="disabled"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属地区" prop="area">
                  <el-select v-model="ruleForm.area" placeholder="请选择区域" :disabled="disabled">
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
                <el-form-item label="住宿类型" prop="typeId">
                  <el-select v-model="ruleForm.typeId" placeholder="请选择类型" :disabled="disabled">
                    <el-option label="经济酒店" value="1"></el-option>
                    <el-option label="星级酒店" value="2"></el-option>
                    <el-option label="民宿" value="3"></el-option>
                    <el-option label="豪华宾馆" value="4"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="ruleForm.address" :disabled="disabled"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="酒店详情" prop="content">
                <el-input type="textarea" v-model="ruleForm.content" :disabled="disabled"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="ruleForm.phone" :disabled="disabled"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="价格" prop="money">
                <el-input v-model.number="ruleForm.money" :disabled="disabled"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="设备">
                <div style="margin-bottom:10px;">
                  <el-input v-model="deviceInp" style="width:200px;" :disabled="disabled"></el-input>
                  <el-button
                    type="text"
                    @click="deviceInp.trim() != '' && device.push(deviceInp);deviceInp=''"
                    :disabled="disabled"
                  >添加</el-button>
                </div>
                <template>
                  <span
                    class="tags"
                    v-for="(item,index) in device"
                    :key="index"
                    @click="!disabled && device.splice(index,1)"
                  >{{item}}</span>
                </template>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配图">
              <input
                type="file"
                accept="image/gif, image/jpeg, image/jpg, image/png"
                @change="uploadPhoto($event,'main')"
                :disabled="disabled"
              >
              <img :src="ruleForm.pic" alt style="width:400px;height:220px;">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="mode != 'create'">
          <el-col :span="20" :offset="2">
            <el-tabs v-model="activeName" @tab-click="roomAndComment" type="border-card">
              <el-tab-pane label="房间管理" name="first">
                <el-row>
                  <el-col :span="2" :offset="20">
                    <el-button type="primary" @click="addChildren" :disabled="disabled">添加</el-button>
                  </el-col>
                  <!-- <el-col :span="2">
                    <el-button
                      type="danger"
                      @click="deleteChildren"
                      :disabled="disabled || !(this.multipleSelection.length > 0)"
                    >删除</el-button>
                  </el-col>-->
                </el-row>
                <el-table :data="childrenList" stripe style="width: 100%">
                  <el-table-column prop="title" label="房间类型" width="180">
                    <template slot-scope="{row,$index}">
                      <el-input v-model.number="childrenList[$index].title" :disabled="disabled"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="pic" label="图片" width="260">
                    <template slot-scope="{row,$index}">
                      <input
                        type="file"
                        accept="image/gif, image/jpeg, image/jpg, image/png"
                        @change="uploadPhoto($event,'children',$index)"
                        :disabled="disabled"
                      >
                      <img :src="childrenList[$index].pic" alt style="width:250px;height:120px;">
                    </template>
                  </el-table-column>
                  <el-table-column prop="money" label="价格">
                    <template slot-scope="{row,$index}">
                      <el-input v-model.number="childrenList[$index].money" :disabled="disabled"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="可出租数量">
                    <template slot-scope="{row,$index}">
                      <el-input v-model.number="childrenList[$index].num" :disabled="disabled"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="deleteRoom(scope.row)"
                        type="danger"
                        size="small"
                        :disabled="mode != 'edit'"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="评论管理" name="second">
                <el-row>
                  <el-col :span="2" :offset="22">
                    <el-button
                      type="danger"
                      @click="deleteComment"
                      :disabled="!(this.multipleSelection2.length > 0)"
                    >删除</el-button>
                  </el-col>
                </el-row>
                <el-table
                  :data="commentList"
                  stripe
                  style="width: 100%"
                  @selection-change="handleSelectionChange2"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="username" label="用户名" width="180"></el-table-column>
                  <el-table-column prop="content" label="内容" width="450"></el-table-column>
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
              <el-tab-pane label="租房管理" name="third">
                <el-table
                  :data="bookList"
                  stripe
                  style="width: 100%"
                  @selection-change="handleSelectionChange2"
                >
                  <el-table-column prop="username" label="用户名" width="80"></el-table-column>
                  <el-table-column prop="ctime" label="订单时间" width="150">
                    <template slot-scope="scope">
                      <span>{{imeFormatter(scope.row.ctime)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="房间" width="150"></el-table-column>
                  <el-table-column prop="dayNum" label="天数" width="80"></el-table-column>
                  <el-table-column prop="intime" label="入住时间" width="150">
                    <template slot-scope="scope">
                      <span>{{imeFormatter(scope.row.intime)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="订单状态" width="100">
                    <template slot-scope="scope">
                      <span>{{statusList[scope.row.status]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="changeStatus(scope.row.id, 1,scope.row)"
                        type="text success"
                        size="small"
                        :disabled="scope.row.status != 0 || scope.row.status == -1"
                      >接受</el-button>
                      <el-button
                        @click.native.prevent="changeStatus(scope.row.id, -1,scope.row)"
                        type="text"
                        size="small"
                        :disabled="scope.row.status != 0 || scope.row.status == -1"
                      >取消</el-button>
                      <el-button
                        @click.native.prevent="changeStatus(scope.row.id, 2,scope.row)"
                        type="text"
                        size="small"
                        :disabled="scope.row.status != 1 || scope.row.status == -1"
                      >完成</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-form-item style="margin-top:30px;">
          <el-button type="primary" @click="submitForm('ruleForm')" v-if="mode == 'create'">提交</el-button>
          <el-button
            type="primary"
            @click="mode = 'edit';disabled = false"
            v-if="mode == 'check'"
          >编辑</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" v-if="mode == 'edit'">提交</el-button>
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
      loading: false,
      showOpera: true,
      currentPage: 1,
      totalData: 10,
      device: [],
      deviceInp: "",
      tableData: [],
      mode: "create",
      disabled: false,
      childrenList: [],
      deleteChildrenId: [],
      deleteCommentId: [],
      commentList: [],
      bookList: [],
      multipleSelection: [],
      multipleSelection2: [],
      activeName: "first",
      areaList: {
        1: "集美区",
        2: "湖里区",
        3: "思明区",
        4: "海沧区",
        5: "同安区",
        6: "翔安区"
      },
      statusList: {
        0: "已预定",
        1: "入住中",
        2: "已完成",
        "-1": "已取消"
      },
      typeList: {
        1: "经济酒店",
        2: "星级酒店",
        3: "民宿",
        4: "豪华宾馆"
      },
      ruleForm: {
        typeId:"",
        userId: "",
        name: "金泉港IMAX国际影城",
        area: "6",
        pic: "",
        content: "哈哈哈哈哈哈",
        money: "198",
        address: "朝阳区大屯里金泉购物中心318号楼4层",
        phone: "12855-25654161",
        device: ""
      },
      rules: {
        name: [{ required: true, message: "请输入酒店名", trigger: "blur" }],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        content: [{ required: true, message: "请填写介绍", trigger: "change" }],
        money: [{ required: true, message: "请填写价格", trigger: "change" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "change" }
        ],
        phone: [{ required: true, message: "请填写电话", trigger: "change" }],
        typeId: [{ required: true, message: "请选择区域", trigger: "change" }]
      },
      commentCount: 0,
      commentPage: 1,
      commentPageSize: 10
    };
  },
  created() {
    this.getTable();
  },
  methods: {
    getTable() {
      this.loading = true;
      var userId = window.sessionStorage.getItem("id");
      this.$axios
        .get("/getHotelByUserId?userId=" + userId)
        .then(res => {
          console.log(res.data.data);
          this.tableData = res.data.data;
          for (var i = 0; i < res.data.data.length; i++) {
            this.tableData[i].area = this.areaList[res.data.data[i]["area_id"]];
          }
          this.loading = false;
        })
        .catch(res => {
          this.$message.error("获取酒店失败！");
        });
    },
    // getChildrenList() {
    //   this.childrenList = []
    //   this.$axios
    //     .get("/getRoomByHotelId?hotelId=" + this.ruleForm.id)
    //     .then(res => {})
    //     .catch(res => {});
    // },
    getComment() {
      this.commentList = [];
      // console.log(this.commentPage, this.commentPageSize);
      this.$axios
        .get(
          "/getCommentByHotelId?hotelId=" +
            this.ruleForm.id +
            "&page=" +
            (this.commentPage - 1) +
            "&pageSize=" +
            this.commentPageSize
        )
        .then(res => {
          this.commentCount = res.data.data.count;
          this.commentList = res.data.data.commentList;
          // console.log(res);
        })
        .catch(res => {});
    },
    getBook() {
      this.bookList = [];
      this.$axios
        .get("/getBookByHotelId?hotelId=" + this.ruleForm.id)
        .then(res => {
          console.log(res);
          this.bookList = res.data.data;
        })
        .catch(res => {
          console.log(res);
        });
    },
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
          root.getChildrenBase64(imgcode, index);
        } else {
          root.getHotelBase64(imgcode);
        }
      };
    },
    getHotelBase64(imgcode) {
      var root = this;
      root.canvasDataURL(imgcode, res => {
        //压缩
        console.log("压缩后", res.length);
        root.ruleForm.pic = res;
      });
    },
    getChildrenBase64(imgcode, index) {
      var root = this;
      root.canvasDataURL(imgcode, res => {
        //压缩
        console.log("压缩后", res.length);
        root.childrenList[index].pic = res;
      });
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
    editRow(row) {
      let data = row;
      this.device = data.device.split(",");
      this.$axios
        .get("/getRoomDetailByHotelId?hotelId=" + data.id)
        .then(res => {
          this.ruleForm = {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            area: data.area_id + "",
            pic: data.pic,
            typeId:data.type_id+"",
            content: data.introduction,
            money: data.money,
            address: data.address,
            phone: data.phone,
            device: data.device
          };
          this.childrenList = res.data.data;
          this.showOpera = !this.showOpera;
          this.mode = "check";
          this.disabled = true;
          this.getComment();
          this.getBook();
        })
        .catch(res => {
          this.$message.error("出错！");
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
          if (this.mode == "create") {
            console.log("创建");
            this.createHotel();
          } else if (this.mode == "edit") {
            console.log("更新");
            this.updateHotel();
          } else {
            console.log("出错");
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
      this.mode = "create";
      this.activeName = "first";
      this.getTable();
    },
    createHotel() {
      this.ruleForm.device = this.device.toString();
      this.ruleForm.userId = window.sessionStorage.getItem("id");
      this.$axios
        .post("/addHotel", {
          uId: this.ruleForm.userId,
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          pic: this.ruleForm.pic,
          address: this.ruleForm.address,
          money: this.ruleForm.money,
          areaId: this.ruleForm.area,
          typeId:this.ruleForm.typeId,
          introduction: this.ruleForm.content,
          device: this.ruleForm.device
        })
        .then(res => {
          this.$message.success("提交成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {});
    },
    updateHotel() {
      //更新
      this.ruleForm.device = this.device.toString();
      console.log(this.ruleForm);
      let addRoomList = [],
        updateRoomList = [];
      for (let i = 0; i < this.childrenList.length; i++) {
        if (!this.childrenList[i].id) {
          addRoomList.push(this.childrenList[i]);
        } else {
          updateRoomList.push(this.childrenList[i]);
        }
      }
      this.$axios
        .post("/updateHotel", {
          hotelId: this.ruleForm.id,
          uId: this.ruleForm.userId,
          name: this.ruleForm.name,
          phone: this.ruleForm.phone,
          pic: this.ruleForm.pic,
          address: this.ruleForm.address,
          money: this.ruleForm.money,
          areaId: this.ruleForm.area,
          typeId:this.ruleForm.typeId,
          introduction: this.ruleForm.content,
          device: this.ruleForm.device,
          // deleteRoomId: this.deleteChildrenIdId,
          addRoomList,
          updateRoomList
          // delelteCommentId: this.deleteCommentId
        })
        .then(res => {
          this.$message.success("操作成功！");
          this.resetForm("ruleForm");
        })
        .catch(res => {});
    },
    roomAndComment(tab, event) {
      // console.log(tab, event);
    },
    addChildren() {
      var len = this.childrenList.length;
      this.childrenList.push({
        hotel_id: this.ruleForm.id,
        title: "",
        pic: "",
        money: "",
        num: "",
        idx: len
      });
    },
    deleteRoom(room) {
      //删room
      this.$confirm(
        "此操作将永久删除以及相关订单信息,如果是新建房间,可无视此条信息。 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var deleteId = [];
          this.childrenList.forEach((el, index) => {
            el.idx = index;
          });
          if (room.id) {
            deleteId.push(parseInt(room.id));
            room.id = null;
          }
          if (!room.id) {
            console.log(room.idx);
            this.childrenList.splice(room.idx, 1);
            this.childrenList.forEach((el, index) => {
              el.idx = index;
            });
          }

          // let len = this.multipleSelection.length;
          // if (len > 0) {
          //   // ADD,DELETE,UPDATE
          //   var deleteId = [];
          //   for (var i = 0; i < len; i++) {
          //     //有id说明需要删除
          //     if (this.multipleSelection[i].id) {
          //       deleteId.push(parseInt(this.multipleSelection[i].id));
          //       this.multipleSelection[i].id = null;
          //       i--;
          //     } else if (!this.multipleSelection[i].id) {
          //       console.log(this.multipleSelection[i].idx);
          //       this.childrenList.splice(this.multipleSelection[i].idx, 1);
          //       this.childrenList.forEach((el, index) => {
          //         el.idx = index;
          //       });
          //     }
          //   }

          if (deleteId.length > 0) {
            this.$axios
              .get("/deleteBookByRoomId?rId=" + deleteId[0])
              .then(res => {
                this.$axios
                  .post("/deleteRoomDetail", {
                    deleteId
                  })
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
              })
              .catch(res => {});
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleSelectionChange2(val) {
      console.log(val);
      this.multipleSelection2 = val;
    },
    deleteComment() {
      let deleteId = [];
      if (this.multipleSelection2.length > 2) {
        this.multipleSelection2.forEach(el => {
          deleteId.push(el.id);
        });
        this.$axios
          .post("/deleteHotelCommentById", {
            deleteId
          })
          .then(res => {
            this.$message.success("删除成功！");
            this.commentPage = 1;
            this.getComment();
          })
          .catch(res => {
            this.$message.success("删除失败！");
          });
      }
      console.log(deleteId);
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
    currentCommentPage(curPage) {
      this.commentPage = curPage;
      this.getComment();
    },
    changeStatus(bookId, status, row) {
      console.log(this.ruleForm.id)
      this.$axios
        .get("/changeBookStatus?urId=" + bookId + "&status=" + status+"&hotelId="+this.ruleForm.id)
        .then(res => {
          console.log(res);
          row.status = status;
          this.$message.success("状态修改成功");
        })
        .catch(res => {
          this.$message.error("状态修改失败！");
        });
      // console.log(bookId,status)
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
  cursor: pointer;
}
</style>
