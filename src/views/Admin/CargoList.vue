<template>
    <div class="app-container">

        <el-card class="box-card">

            <div slot="header" class="clearfix">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="SearchClick">search</el-button>
                <el-button type="warning" size="mini" @click="ResetClick" icon="el-icon-s-promotion">重 置</el-button>
            </div>
            <div class="tb-body">
                <el-form ref="searchFormRef" :model="searchForm" :inline="true" label-width="120px" :style="`flex:1;`">
                    <el-form-item label="Product Name" prop="Name">
                        <el-input v-model.trim="searchForm.Name" placeholder="Please enter the product name" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="price" prop="Price">
                        <el-input v-model.trim="searchForm.Price" placeholder="Please enter the price" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="manufactureCost" prop="ManufactureCost" label-width="160px">
                        <el-input v-model.trim="searchForm.ManufactureCost" placeholder="Please enter the manufactureCost" :clearable="true"></el-input>
                    </el-form-item>

                    <el-form-item label="owner of goods">
                        <SigleSelect url="/Customer/List" columnName="OwnerName" :clearable="true" columnValue="Id"
                            v-model="searchForm.CustomerId" :where="{ WarehouseId: CurrentWarehouseId }">
                        </SigleSelect>
                    </el-form-item>
                    <el-form-item label="unitOfMeasure">
                        <SigleSelect url="/CargoType/List" columnName="Name" :clearable="true" columnValue="Id"
                            v-model="searchForm.UnitOfMeasure" :where="{ WarehouseId: CurrentWarehouseId }">
                        </SigleSelect>
                    </el-form-item>

                </el-form>
            </div>

        </el-card>


        <el-dialog :title="formData.Id ? 'Modify Product' : 'Add Product'" :visible.sync="editorShow" width="50%" :lock-scroll="true"
            height="800px">
            <el-form v-if="editorShow == true" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="mini">
                <el-row :gutter="10" class="EditFromBody" style="max-height: 600px;overflow-y: scroll">
                    <el-col :span="24">
                        <el-form-item label="Product Name" prop="Name">
                            <el-input type="text" v-model.trim="formData.Name" placeholder="Please enter the product name"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>

                  <el-col :span="24">
                    <el-form-item label="owner of goods" prop="CustomerId">
                      <SigleSelect url="/Customer/List" columnName="OwnerName" columnValue="Id"
                                   v-model="formData.CustomerId" :where="{ WarehouseId: CurrentWarehouseId }">
                      </SigleSelect>
                    </el-form-item>
                  </el-col>



                    <el-col :span="24">
                        <el-form-item label="unitOfMeasure" prop="UnitOfMeasure">
                            <SigleSelect url="/CargoType/List" columnName="Name" columnValue="Id"
                                v-model="formData.UnitOfMeasure" :where="{ WarehouseId: CurrentWarehouseId }">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="price" prop="Price">
                            <el-input type="text" v-model.trim="formData.Price" placeholder="Please enter the price"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="manufactureCost" prop="ManufactureCost">
                            <el-input type="text" v-model.trim="formData.ManufactureCost" placeholder="Please enter a manufactureCost"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="rating" prop="Rating">
                            <el-input type="text" v-model.trim="formData.Rating" placeholder="Please enter the rating"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="partNumber" prop="PartNumber">
                            <el-input type="text" v-model.trim="formData.PartNumber" placeholder="Please enter the partNumber"
                                :clearable="true"></el-input>
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


        <PaginationTable ref="PaginationTableId" url="/Cargo/List" :column="dataColum" :where="where">
            <template v-slot:header>
                <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="ShowEditModal()">add</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="ShowBatchDeleteModal()">Batch Delete</el-button>
            </template>
            <template v-slot:Operate="scope">
                <el-button class="margin-top-xs" type="primary" size="mini" @click="ShowEditModal(scope.row.Id)">modify</el-button>
                <el-button class="margin-top-xs" type="danger" size="mini" @click="ShowDeleteModal(scope.row.Id)">deletion</el-button>
            </template>
        </PaginationTable>
    </div>
</template>

<script>
import store from '@/store';
import {mapGetters} from 'vuex';


export default {
  name: "CargoList",
  computed: {
    ...mapGetters([
      'Token', 'UserInfo', 'RoleType', 'HasUserInfo', 'ColumnType', "UserId", "CurrentWarehouseId"
    ]),
    // 计算 rating 的总和

  },
  data() {

    return {
      where: {},
      searchForm: {},//搜索定义的数据对象
      dataColum: [
        {
          key: "Id",
          title: "Id",
          hidden: true,
        },
        {
          key: "CreationTime",
          title: "creationDate",
          width: "200px",
        },
        {
          key: "CargoTypeDto.Name",
          title: "unitOfMeasure",
          width: "200px",


          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "WarehouseId",
          hidden: true,
        },
        {
          key: "WarehouseDto.Name",
          title: "manufacturer",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "CustomerId",
          hidden: true,
        },
        {
          key: "CustomerDto.OwnerName",
          width: "160px",
          title: "Owner's name",
          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "Name",
          title: "Product Name",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "Price",
          title: "price",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "ManufactureCost",
          title: "manufactureCost",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "Rating",
          title: "rating",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },
        {
          key: "PartNumber",
          title: "partNumber",
          width: "160px",

          type: store.getters.ColumnType.SHORTTEXT,
        },

        {
          key: "UnitOfMeasure",
          hidden: true,
        },

        {
          title: "operate",
          width: "300px",
          key: "Operate",
          type: store.getters.ColumnType.USERDEFINED,
        },
      ],
      editModalFormRules: {
        "Name": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "WarehouseId": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "CustomerId": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "UnitOfMeasure": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "Price": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "ManufactureCost": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "Rating": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
        "PartNumber": [
          {required: true, message: 'This field is required', trigger: 'blur'},
        ],
      },
      formData: {},//保存或者修改定义的数据对象
      editorShow: false,

    };
  },
  created() {
    this.where.WarehouseId = this.CurrentWarehouseId;

  },
  methods: {
    //修改属性
    async UpdateEntityAsync(Id, title, data) {
      let {Data} = await this.$PostSigleUpdate(`/Cargo/Get`, `/Cargo/CreateOrEdit`, Id, title, data);

      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
    /**
     * 点击新增或者编辑的时候会触发
     */
    async ShowEditModal(Id) {

      let {Data} = await this.$Post(`/Cargo/Get`, {Id: Id});
      Data.WarehouseId = this.CurrentWarehouseId;
      this.formData = Data;

      this.editorShow = true;

    },
    /**
     * 点击保存的时候会触发
     */
    async CreateOrEditForm() {

      this.$refs.editModalForm.validate(async valid => {
        if (valid) {
          var {Success} = await this.$Post(`/Cargo/CreateOrEdit`, this.formData);

          if (Success) {
            this.editorShow = false;
            this.$refs.PaginationTableId.Reload(this.searchForm);
          }
        }
      })
    },
    /**
     * 单个删除的时候会触发
     */
    async ShowDeleteModal(Id) {
      await this.$PostDelete(`/Cargo/Delete`, {Id: Id});
      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
    /**
     * 批量删除的时候会触发
     */
    async ShowBatchDeleteModal() {
      var ids = this.$refs.PaginationTableId.GetSelectionRow().map(x => x.Id);
      if (ids.length == 0) {
        this.$message.error("你选择需要删除的记录");
        return;
      }
      await this.$PostDelete(`/Cargo/BatchDelete`, {Ids: ids});

      this.$refs.PaginationTableId.Reload(this.searchForm);
    },
    /**
     * 点击表格搜索按钮会触发
     */
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


  },
}

</script>
