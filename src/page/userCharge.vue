<template>
  <div>
    <div v-show="showOpera">
      <el-row style="padding-bottom:10px;">
        <!-- <el-button type="primary" size="small" @click="showOpera = !showOpera">创建用户</el-button> -->
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400"
          border
          stripe
          :loading="loading"
        >
          <el-table-column prop="id" label="用户id" width="120"></el-table-column>
          <el-table-column prop="pic" label="头像" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.pic ==null?headpic:scope.row.pic" style="width:80px;
              height:80px;border-radius:50%;"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="power"
            label="用户权限"
            width="200"
            :filters="[{ text: '管理员', value: '-1' },
             { text: '普通用户', value: '0' },
             { text: '景区营业者', value: '1' },
            { text: '酒店商户', value: '2' },
            { text: '攻略作者', value: '3' },
            { text: '餐饮商户', value: '4' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.power == -1 ? 'primary' :scope.row.power > 0 ? 'warning':'info'"
                disable-transitions
              >{{powerList[scope.row.power]+''}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="200"></el-table-column>
          <el-table-column prop="password" label="密码" width="120"></el-table-column>
          <!-- <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text">删除</el-button>
              <el-button @click.native.prevent="editRow(scope.$index, tableData)" type="text">修改</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
      <el-row>
        <div class="block" style="text-align:center;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalData"
          ></el-pagination>
        </div>
      </el-row>
    </div>
    <div class="addUser" v-show="!showOpera">
      <!-- <h3 style="text-align:center;margin-bottom:20px;">添加用户</h3> -->
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
        style="width:500px;margin:0 auto;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm2.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="power">
          <el-select v-model="ruleForm2.power" placeholder="选择身份">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="-1"></el-option>
            <el-option label="景区营业者" value="1"></el-option>
            <el-option label="酒店商户" value="2"></el-option>
            <el-option label="攻略作者" value="3"></el-option>
            <el-option label="餐饮商户" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <router-link :to="{name:'detail',params:{id:1}}">xxx</router-link> -->
  </div>
</template>
<script>
import HEADPIC from "../assets/19.jpg";
export default {
  data() {
    return {
      loading: false,
      showOpera: true,
      currentPage: 1,
      pageSize: 10,
      totalData: 10,
      headpic:HEADPIC,
      tableData: [
        {
          date: "2018-10-11 :12:24",
          id: 1,
          username: "小王",
          password: "123456",
          power: "普通用户"
        }
      ],
      powerList: {
        "-1": "管理员",
        "0": "普通用户",
        "1": "景区营业者",
        "2": "酒店商户",
        "3": "攻略作者",
        "4": "餐饮商户"
      },
      ruleForm2: {
        username: "",
        pass: "",
        power: ""
      },
      rules2: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        power: [{ required: true, message: "请选择用户权限", trigger: "blur" }]
      }
    };
  },
  created() {
    // this.loading = true;
    console.log(typeof HEADPIC)
    this.currentPage = 1;
    this.getTable();
  },
  methods: {
    getTable() {
      this.loading = true;
      this.$axios
        .get(
          "/queryUser?page=" +
            (this.currentPage - 1) +
            "&pageSize=" +
            this.pageSize
        )
        .then(res => {
          // console.log(res)
          this.tableData = res.data.data.userList;
          this.totalData = res.data.data.count;
          // this.$message.success('查询成功！')
          this.loading = false;
        })
        .catch(res => {
          this.$message.error("查询失败！");
        });
    },
    filterTag(value, row) {
      return row.power == value;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    editRow(index, rows) {
      // rows.splice(index, 1);
      this.ruleForm2 = rows[index];
      this.ruleForm2.power = rows[index].power + '';
      this.showOpera =!this.showOpera;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTable();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          
          this.updateUser();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateUser(){
      this.$axios.post('/changeUserByUserId')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.showOpera = !this.showOpera;
    }
  }
};
</script>