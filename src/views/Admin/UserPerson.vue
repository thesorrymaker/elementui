<template>
    <div>

        <el-card class="margin-top-sm">
            <div slot="header" class="clearfix">
                <h2>Modify personal information</h2>
            </div>
            <div>
                <el-form ref="editModalForm" v-if="editShow == true" :model="formData" label-width="80px" size="mini"
                    :rules="rules">
                    <el-form-item label="UserName" prop="UserName">
                        <el-input v-model="formData.UserName" clearable :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="Email" prop="Email">
                        <el-input v-model="formData.Email" clearable> </el-input>
                    </el-form-item>
                    <el-form-item label="Name" prop="Name">
                        <el-input v-model="formData.Name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="PhoneNumber" prop="PhoneNumber">
                        <el-input v-model="formData.PhoneNumber" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="ImageUrls" prop="ImageUrls">
                        <UploadImages v-model="formData.ImageUrls"></UploadImages>
                    </el-form-item>

                    <el-form-item label="Birth" prop="Birth">
                        <el-date-picker type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="Select Date"
                            v-model="formData.Birth" clearable></el-date-picker>
                    </el-form-item>



                </el-form>
                <div style="display: flex;justify-content: flex-end;">
                    <el-button type="primary" @click="CreateOrEdit">confirm</el-button>
                </div>
            </div>
        </el-card>

    </div>
</template>

<script>
import store from "@/store/index.js"
import { mapGetters } from "vuex";
export default {

    computed: {
        ...mapGetters(["UserInfo", 'UserId'])
    },
    data() {
        return {
            editShow: false,
            formData: {},
            rules: {
                UserName: [
                    { required: true, message: 'Please enter your account number', trigger: 'blur' },
                ],
                Password: [
                    { required: true, message: 'Please enter your password', trigger: 'blur' },
                ],
                Email: [
                    { required: true, message: 'Please enter your email', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
                            if (!value || !reg.test(value)) {
                                callback(new Error('Please enter the correct email address'));
                            }
                            else {
                                callback();
                            }
                        }, trigger: 'blur'
                    },
                ],
                Name: [
                    { required: true, message: 'Please enter a name', trigger: 'blur' },
                ],
                PhoneNumber: [
                    { required: true, message: 'Please enter your mobile phone number', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            var reg = /^1[34578]\d{9}$/;
                            if (!value || !reg.test(value)) {
                                callback(new Error('Please enter the correct mobile phone number'));
                            }
                            else {
                                callback();
                            }
                        }, trigger: 'blur'
                    },
                ],
                Birth: [
                    { required: true, message: 'Please enter your year of birth', trigger: 'blur' },
                ],
                ImageUrls: [
                    { required: true, message: 'Please enter an avatar', trigger: 'blur' },
                ],
            },

        }
    },
    created() {
        this.ShowEditModal();
    },
    methods: {

        //获取用户信息
        async ShowEditModal() {

            let { Data } = await this.$Post("/User/Get", { Id: this.UserId })
            this.formData = Data;
            this.editShow = true;

        },
        //创建或者修改
        async CreateOrEdit() {
            this.$refs.editModalForm.validate(async (valid) => {
                if (valid) {
                    //保存数据到数据库
                    let { Success, Msg, Data } = await this.$Post("/User/CreateOrEdit", this.formData);
                    if (Success) {

                        this.$message.success("Modified successfully!");

                        store.dispatch("GetInfo");


                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    }
}
</script>

<style></style>