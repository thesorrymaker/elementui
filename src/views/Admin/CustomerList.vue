<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="SearchClick">search</el-button>
                <el-button type="warning" size="mini" @click="ResetClick" icon="el-icon-s-promotion">reset</el-button>
            </div>
            <div class="tb-body">
                <el-form ref="searchFormRef" :model="searchForm" :inline="true" label-width="120px" :style="`flex:1;`">
                    <el-form-item label="Owner's name" prop="OwnerName">
                        <el-input v-model.trim="searchForm.OwnerName" placeholder="Please enter the name of the shipper"
                            :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="eyeColor" prop="EyeColor">
                      <el-select v-model="searchForm.EyeColor" placeholder="Please select">
                        <el-option key="RED" label="RED" value="RED">
                        </el-option>
                        <el-option key="BLACK" label="BLACK" value="BLACK">
                        </el-option>
                        <el-option key="YELLOW" label="YELLOW" value="YELLOW">
                        </el-option>
                        <el-option key="BROWN" label="BROWN" value="BROWN">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="hairColor" prop="HairColor">
                      <el-select v-model="searchForm.HairColor" placeholder="Please select">
                        <el-option key="RED" label="RED" value="RED">
                        </el-option>
                        <el-option key="BLACK" label="BLACK" value="BLACK">
                        </el-option>
                        <el-option key="YELLOW" label="YELLOW" value="YELLOW">
                        </el-option>
                        <el-option key="BROWN" label="BROWN" value="BROWN">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="height" prop="Height">
                      <el-input v-model.trim="searchForm.Height" placeholder="Please enter your height" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="nationality" prop="Nationality">
                      <el-select v-model="searchForm.Nationality" placeholder="Please select">
                        <el-option key="UNITED_KINGDOM" label="UNITED_KINGDOM" value="UNITED_KINGDOM">
                        </el-option>
                        <el-option key="CHINA" label="CHINA" value="CHINA">
                        </el-option>
                        <el-option key="SOUTH_KOREA" label="SOUTH_KOREA" value="SOUTH_KOREA">
                        </el-option>
                      </el-select>
                    </el-form-item>

                </el-form>
            </div>

        </el-card>


        <el-dialog :title="formData.Id ? 'Modify owner' : 'Add owner'" :visible.sync="editorShow" width="50%" :lock-scroll="true"
            height="800px">
            <el-form v-if="editorShow == true" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="mini">
                <el-row :gutter="10" class="EditFromBody">
                    <el-col :span="24">
                        <el-form-item label="Organization" prop="WarehouseId">
                            <SigleSelect url="/Warehouse/List" columnName="Name" columnValue="Id" :disabled="true"
                                v-model="formData.WarehouseId">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Owner" prop="OwnerName">
                            <el-input type="text" v-model.trim="formData.OwnerName" placeholder="Please enter the name of the shipper"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>



                  <el-col :span="24">
                        <el-form-item label="eyeColor" prop="EyeColor">
                          <el-select v-model="formData.EyeColor" placeholder="Please select">
                            <el-option key="RED" label="RED" value="RED">
                            </el-option>
                            <el-option key="BLACK" label="BLACK" value="BLACK">
                            </el-option>
                            <el-option key="YELLOW" label="YELLOW" value="YELLOW">
                            </el-option>
                            <el-option key="BROWN" label="BROWN" value="BROWN">
                            </el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="hairColor" prop="HairColor">
                          <el-select v-model="formData.HairColor" placeholder="Please select">
                            <el-option key="RED" label="RED" value="RED">
                            </el-option>
                            <el-option key="BLACK" label="BLACK" value="BLACK">
                            </el-option>
                            <el-option key="YELLOW" label="YELLOW" value="YELLOW">
                            </el-option>
                            <el-option key="BROWN" label="BROWN" value="BROWN">
                            </el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="height" prop="Height">
                            <el-input type="text" v-model.trim="formData.Height" placeholder="Please enter your Height Nationality"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="nationality" prop="Nationality">
                      <el-select v-model="formData.Nationality" placeholder="Please select">
                        <el-option key="UNITED_KINGDOM" label="UNITED_KINGDOM" value="UNITED_KINGDOM">
                        </el-option>
                        <el-option key="CHINA" label="CHINA" value="CHINA">
                        </el-option>
                        <el-option key="SOUTH_KOREA" label="SOUTH_KOREA" value="SOUTH_KOREA">
                        </el-option>
                      </el-select>
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


        <PaginationTable ref="PaginationTableId" url="/Customer/List" :column="dataColum" :where="where">
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
import { mapGetters } from 'vuex';
export default {
    name: "CustomerList",
    computed: {
        ...mapGetters([
            'Token', 'UserInfo', 'RoleType', 'HasUserInfo', 'ColumnType', "UserId", "CurrentWarehouseId"
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
                    key: "OwnerName",
                    title: "OwnerName",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "EyeColor",
                    title: "eyeColor",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "HairColor",
                    title: "hairColor",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "Height",
                    title: "height",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "Nationality",
                    title: "nationality",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    key: "WarehouseId",
                    hidden: true,
                },
                {
                    key: "WarehouseDto.Name",
                    title: "Organization",

                    type: store.getters.ColumnType.SHORTTEXT,
                },
                {
                    title: "操作",
                    width: "300px",
                    key: "Operate",
                    type: store.getters.ColumnType.USERDEFINED,
                },
            ],
            editModalFormRules: {
                "WarehouseId": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
                "OwnerName": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
                "EyeColor": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
                "HairColor": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
                "Height": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
                "Nationality": [
                    { required: true, message: 'This field is required', trigger: 'blur' },
                ],
            },
            formData: {

            },//保存或者修改定义的数据对象
            editorShow: false,

        };
    },
    created() {
        this.where.WarehouseId = this.CurrentWarehouseId;
    },
    methods: {
        //修改属性
        async UpdateEntityAsync(Id, title, data) {
            let { Data } = await this.$PostSigleUpdate(`/Customer/Get`, `/Customer/CreateOrEdit`, Id, title, data);

            this.$refs.PaginationTableId.Reload(this.searchForm);
        },
        /**
         * 点击新增或者编辑的时候会触发
         */
        async ShowEditModal(Id) {

            let { Data } = await this.$Post(`/Customer/Get`, { Id: Id });
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
                    var { Success } = await this.$Post(`/Customer/CreateOrEdit`, this.formData);

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
            await this.$PostDelete(`/Customer/Delete`, { Id: Id });
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
            await this.$PostDelete(`/Customer/BatchDelete`, { Ids: ids });

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