<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="SearchClick">search</el-button>
                <el-button type="warning" size="mini" @click="ResetClick" icon="el-icon-s-promotion">reset</el-button>
            </div>
            <div class="tb-body">
                <el-form ref="searchFormRef" :model="searchForm" :inline="true" label-width="140px" :style="`flex:1;`">
                    <el-form-item label="Warehouse Name" prop="Name">
                        <el-input v-model.trim="searchForm.Name" placeholder="Please enter the warehouse name" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="Address" prop="Address">
                        <el-input v-model.trim="searchForm.Address" placeholder="Please enter your address" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="City" prop="City">
                        <el-input v-model.trim="searchForm.City" placeholder="Please enter a city" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="Country" prop="Country">
                        <el-input v-model.trim="searchForm.Country" placeholder="Please enter your country" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="annualTurnover" prop="AnnualTurnover">
                        <el-input v-model.trim="searchForm.AnnualTurnover" placeholder="Please enter a contact person"
                            :clearable="true"></el-input>
                    </el-form-item>

                  <el-form-item label="type" prop="Type">
                    <el-select v-model="searchForm.Type" placeholder="Please select">
                      <el-option key="PUBLIC" label="PUBLIC" value="PUBLIC">
                      </el-option>
                      <el-option key="GOVERNMENT" label="GOVERNMENT" value="GOVERNMENT">
                      </el-option>
                      <el-option key="PRIVATE_LIMITED_COMPANY" label="PRIVATE_LIMITED_COMPANY" value="PRIVATE_LIMITED_COMPANY">
                      </el-option>
                    </el-select>
                  </el-form-item>
                    <el-form-item label="rating" prop="Rating">
                        <el-input v-model.trim="searchForm.Rating" placeholder="Please enter the environmental conditions"
                            :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="employeesCount" prop="EmployeesCount">
                        <el-input v-model.trim="searchForm.EmployeesCount" placeholder="Please enter your contact number" :clearable="true"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </el-card>


        <el-dialog :title="formData.Id ? 'Modify the warehouse' : 'Add the warehouse'" :visible.sync="editorShow" width="50%" :lock-scroll="true"
            height="800px">
            <el-form v-if="editorShow == true" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="mini">
                <el-row :gutter="10" class="EditFromBody" style="max-height: 600px;overflow-y: scroll">
                    <el-col :span="24">
                        <el-form-item label="Name" prop="Name">
                            <el-input type="text" v-model.trim="formData.Name" placeholder="Please enter the warehouse name"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Address" prop="Address">
                            <el-input type="text" v-model.trim="formData.Address" placeholder="Please enter your address"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="City" prop="City">
                            <el-input type="text" v-model.trim="formData.City" placeholder="Please enter a city"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Country" prop="Country">
                            <el-input type="text" v-model.trim="formData.Country" placeholder="Please enter your country"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="annualTurnover" prop="AnnualTurnover">
                            <el-input type="text" v-model.trim="formData.AnnualTurnover" placeholder="Please enter a contact person"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="24">
                    <el-form-item label="type" prop="Type">
                      <el-select v-model="formData.Type" placeholder="Please select">
                        <el-option key="PUBLIC" label="PUBLIC" value="PUBLIC">
                        </el-option>
                        <el-option key="GOVERNMENT" label="GOVERNMENT" value="GOVERNMENT">
                        </el-option>
                        <el-option key="PRIVATE_LIMITED_COMPANY" label="PRIVATE_LIMITED_COMPANY" value="PRIVATE_LIMITED_COMPANY">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                    <el-col :span="24">
                        <el-form-item label="rating" prop="Rating">
                            <el-input type="text" v-model.trim="formData.Rating" placeholder="Please enter the environmental conditions"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="employeesCount" prop="EmployeesCount">
                            <el-input type="text" v-model.trim="formData.EmployeesCount" placeholder="Please enter your contact number"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>


                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button type="primary" plain @click="CreateOrEditForm()">confirm</el-button>
                        <el-button @click="editorShow = false">cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>

        </el-dialog>


        <PaginationTable ref="PaginationTableId" url="/Warehouse/List" :column="dataColum" :where="where">
            <template v-slot:header>
                <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="ShowEditModal()">add</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="ShowBatchDeleteModal()">Batch Delete</el-button>
            </template>
            <template v-slot:Operate="scope">
                <el-button class="margin-top-xs" type="primary" size="mini" @click="ShowEditModal(scope.row.Id)">modify</el-button>
                <el-button class="margin-top-xs" type="danger" size="mini" @click="ShowDeleteModal(scope.row.Id)">delete</el-button>
            </template>
        </PaginationTable>
    </div>
</template>

<script>
import store from '@/store';
import { mapGetters } from 'vuex';
export default {
    name: "WarehouseList",
    computed: {
        ...mapGetters([
            'Token', 'UserInfo', 'RoleType', 'HasUserInfo', 'ColumnType', "UserId"
        ])
    },
    data() {

        return {
            where: {},
            searchForm: {},//搜索定义的数据对象
            dataColum: [
                {
                    key: "Id",
                    hidden: true,

                },
                {
                    key: "Name",
                    title: "Name",
                    width: "120px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "Name",
                    title: "Name",
                    width: "120px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "City",
                    title: "City",
                    width: "120px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "Country",
                    title: "Country",
                    width: "120px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "AnnualTurnover",
                    title: "annualTurnoverAnnualTurnover",
                    width: "130px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },

                {
                    key: "Type",
                    title: "Type",


                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "Rating",
                    title: "rating",
                  width: "120px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "EmployeesCount",
                    title: "employeesCount",
                  width: "160px",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    title: "Operate",
                    width: "300px",
                    key: "Operate",
                    type: store.getters.ColumnType.USERDEFINED,
                },
            ],
            editModalFormRules: {
                "Name": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "Address": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "City": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "Country": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "AnnualTurnover": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "Type": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "Rating": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],
                "EmployeesCount": [
                    { required: true, message: 'This item is required', trigger: 'blur' },
                ],

            },
            formData: {

            },//保存或者修改定义的数据对象
            editorShow: false,

        };
    },
    created() {

    },
    methods: {
        //修改属性
        async UpdateEntityAsync(Id, title, data) {
            let { Data } = await this.$PostSigleUpdate(`/Warehouse/Get`, `/Warehouse/CreateOrEdit`, Id, title, data);

            this.$refs.PaginationTableId.Reload(this.searchForm);
        },
        /**
         * 点击新增或者编辑的时候会触发
         */
        async ShowEditModal(Id) {

            let { Data } = await this.$Post(`/Warehouse/Get`, { Id: Id });
            this.formData = Data;

            this.editorShow = true;

        },
        /**
         * 点击保存的时候会触发
         */
        async CreateOrEditForm() {

            this.$refs.editModalForm.validate(async valid => {
                if (valid) {
                    var { Success } = await this.$Post(`/Warehouse/CreateOrEdit`, this.formData);

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
            await this.$PostDelete(`/Warehouse/Delete`, { Id: Id });
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
            await this.$PostDelete(`/Warehouse/BatchDelete`, { Ids: ids });

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
};
</script>