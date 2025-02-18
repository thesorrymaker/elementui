<template>
  <div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">

        <el-row>
          <el-button type="primary" size="mini" @click="SearchClick">search</el-button>
          <el-button type="warning" size="mini" @click="ResetClick">Clear</el-button>

        </el-row>
      </div>
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="name">
            <el-input v-model="searchForm.Name" placeholder="Please enter your name"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="searchForm.Email" placeholder="Please enter your email address"></el-input>
          </el-form-item>
          <el-form-item label="telephone number">
            <el-input v-model="searchForm.PhoneNumber" placeholder="Please enter your mobile phone number"></el-input>
          </el-form-item>
          <el-form-item label="role" prop="RoleType">
            <SigleSelect v-model="searchForm.RoleType" url="/Select/RoleType" columnName="Name"
                         columnValue="Code" columnLabel="Label"></SigleSelect>
          </el-form-item>


        </el-form>
      </div>
    </el-card>


    <PaginationTable ref="PaginationTableId" url="/User/List" :column="dataColum">
      <template v-slot:header>
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="ShowEditModal()">add</el-button>
        <ExportButton exportUrl="/User/Export" :where="searchForm"></ExportButton>

        <el-upload
            class="upload-demo"
            action="http://localhost:7245/User/import"
            :headers="headers"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :multiple="false"
        :limit="1"
        accept=".xls,.xlsx"
        >
        <el-button size="mini" type="primary" >
          <el-icon><Upload /></el-icon>
          Excel
        </el-button>
        </el-upload>

        <el-table :data="importHistory" border style="margin-top: 20px;">
          <el-table-column prop="Id" label="ID" width="80"></el-table-column>
          <el-table-column prop="Upload_time" label="上传时间"></el-table-column>
          <el-table-column prop="Status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.Status === '成功' ? 'success' : 'danger'">
                {{ row.Status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

      </template>


      <template v-slot:Operate="scope">
        <el-button type="primary" size="mini" @click="ShowEditModal(scope.row.Id)">modify</el-button>
        <el-button type="danger" size="mini" @click="ShowDeleteModal(scope.row.Id)"
                   v-if="scope.row.RoleTypeFormat == 'user' && RoleType == 'admin'">delete
        </el-button>

      </template>
    </PaginationTable>


    <el-dialog :title="formData.Id ? 'Modify User' : 'Add User'" :visible.sync="editorShow" width="80%"
               :lock-scroll="true"
               min-height="800px">
      <el-form v-if="editorShow == true" ref="editModalForm" :rules="editModalFormRules" :model="formData"
               label-width="140px" size="mini">

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="username" prop="UserName" placeholder="Please enter your account number">
              <el-input v-model.trim="formData.UserName" :disabled='formData.Id != null'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="password" prop="Password">
              <el-input type="password" v-model.trim="formData.Password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="role" prop="RoleType">
              <SigleSelect v-model="formData.RoleType" url="/Select/RoleType" columnName="Name"
                           columnValue="Code" columnLabel="Label"></SigleSelect>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="email" prop="Email" placeholder="Please enter your email address">
              <el-input v-model.trim="formData.Email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PhoneNumber" prop="PhoneNumber" placeholder="Please enter your phoneNumber">
              <el-input v-model.trim="formData.PhoneNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="date of birth" prop="Birth" placeholder="Please enter the time of birth">
              <el-date-picker v-model="formData.Birth" align="right" type="date" placeholder="Select time of birth"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="name" prop="Name" placeholder="Please enter your name">
              <el-input v-model.trim="formData.Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="photo" prop="ImageUrls">
              <UploadImages :limit="1" v-model="formData.ImageUrls"></UploadImages>
            </el-form-item>
          </el-col>


        </el-row>


        <el-row type="flex" justify="end" align="bottom">
          <el-form-item>
            <el-button type="primary" plain @click="CreateOrEditForm()">confirm</el-button>
            <el-button @click="editorShow = false">Cancel</el-button>
          </el-form-item>
        </el-row>
      </el-form>

    </el-dialog>


  </div>
</template>


<script>
import store from '@/store';
import {mapGetters} from 'vuex'
import axios from "axios";

export default {
  name: "UserList",
  computed: {
    ...mapGetters([
      'Token', 'UserInfo', 'RoleType', 'HasUserInfo', 'ColumnType', "UserId"
    ])
  },
  data() {
    return {
      importHistory: [],
      searchForm: {},
      editorShow: false,
      dataColum: [
        {
          key: "Id",
          hidden: true,

        },
        {
          key: "RoleType",
          hidden: true,

        },
        {
          key: "UserName",
          title: "UserName",
          type: store.getters.ColumnType.SHORTTEXT,

        },

        {
          key: "Password",
          title: "Password",
          type: store.getters.ColumnType.SHORTTEXT,

        },
        {
          key: "Email",
          title: "Email",
          type: store.getters.ColumnType.SHORTTEXT,

        },
        {
          key: "Name",
          title: "Name",
          type: store.getters.ColumnType.SHORTTEXT,

        },

        {
          key: "ImageUrls",
          title: "ImageUrls",
          type: store.getters.ColumnType.IMAGES,

        },

        {
          key: "PhoneNumber",
          title: "PhoneNumber",
          type: store.getters.ColumnType.PHONE,

        },
        {
          key: "Birth",
          title: "Birth",
          type: store.getters.ColumnType.DATE,

        },
        {
          key: "RoleTypeFormat",
          title: "RoleTypeFormat",
          type: store.getters.ColumnType.SHORTTEXT,

        },
        {
          title: "Operate",
          width: "300px",
          key: "Operate",
          type: store.getters.ColumnType.USERDEFINED,
        },
      ],
      formData: {},
      editModalFormRules: {
        "UserName": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "Password": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "Email": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "ImageUrls": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "Name": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],

        "PhoneNumber": [
          {required: true, message: 'This field is required', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              var reg = /^1[34578]\d{9}$/;
              if (!value || !reg.test(value)) {
                callback(new Error('Please enter the correct mobile phone number'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          },
        ],
        "Birth": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "RoleType": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],

      },

      listLoading: false,
    }
  },
  created() {

  },
  methods: {
    /**
     * 点击新增或者编辑的时候会触发
     */
    async ShowEditModal(Id) {

      let {Data} = await this.$Post(`/User/Get`, {Id: Id});
      this.formData = Data;
      this.editorShow = true;

    },
    async getImportHistory() {
      try {
        const res = await axios.get("http://localhost:7245/User/importHistory");
        console.log("从后端获取的数据:", res.data);

        if (res.data && res.data.Success && res.data.Data) {
          this.importHistory = res.data.Data; // 确保赋值的是正确的数组
        } else {
          this.importHistory = []; // 防止赋值错误
        }
      } catch (error) {
        console.error("获取导入历史失败:", error);
        this.importHistory = [];
      }
    },




    /**
     * 点击保存的时候会触发
     */
    async CreateOrEditForm() {

      this.$refs.editModalForm.validate(async valid => {
        if (valid) {
          var {Success} = await this.$Post(`/User/CreateOrEdit`, this.formData);
          if (Success) {
            this.editorShow = false;
            this.$refs.PaginationTableId.Reload(this.searchForm);
          }
        }
      })
    },

    async SearchClick() {
      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
    /**
     * 点击清空表单会触发
     */
    async ResetClick() {
      this.searchForm = {};
      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
    /**
     * 单个删除的时候会触发
     */
    async ShowDeleteModal(Id) {
      await this.$PostDelete(`/User/Delete`, {Id: Id});
      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
  },
  mounted() {
    this.getImportHistory(); // 页面加载时获取历史记录
  },
}

</script>

<style scoped></style>