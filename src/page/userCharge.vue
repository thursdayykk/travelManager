<template>
  <div>
    <div v-show="showOpera">
      <el-row style="padding-bottom:10px;">
        <el-button type="primary" size="small" @click="showOpera = !showOpera">创建用户</el-button>
      </el-row>
      <el-row>
        <el-table :data="tableData" style="width: 100%" max-height="400" border stripe>
          <el-table-column fixed prop="date" label="创建日期" width="200"></el-table-column>
          <el-table-column prop="id" label="用户id" width="120"></el-table-column>
          <el-table-column prop="power" label="用户权限" width="150"></el-table-column>
          <el-table-column prop="username" label="用户名" width="200"></el-table-column>
          <el-table-column prop="password" label="密码" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text">删除</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text">修改</el-button>
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
    <div class="addUser" v-show="!showOpera">
      <h3 style="text-align:center;margin-bottom:20px;">添加用户</h3>
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
          <el-input type="text" v-model="ruleForm2.username" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="power">
          <el-select v-model="ruleForm2.power" placeholder="选择身份">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <router-link :to="{name:'detail',params:{id:1}}">xxx</router-link>
  </div>
</template>
<script>
export default {
  methods: {
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
      this.showOpera = !this.showOpera
    }
  },
  data() {
    return {
      showOpera: true,
      currentPage: 1,
      totalData: 10,
      tableData: [
       {date:'2018-10-11 :12:24',id:1,username:'小王',password:'123456',power:'普通用户'}
      ],
      ruleForm2: {
        username: "",
        pass: "",
        power: ""
      },
      rules2: {
        username: [ 
          { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
        power:[ { required: true, message: '请选择用户权限', trigger: 'blur' }]
      }
    };
  }
};
</script>