<template>
<!-- model:表单数据对象 -->
<!-- ref：获取domyu元素 -->
<!-- rules：表单校验规则 -->
    <el-form 
        :model="form" 
        ref="form"
        :rules="rules" 
        class="form">

        <el-form-item class="form-item" prop="username">
            <el-input 
            placeholder="用户名/手机"
            v-model="form.username">
            </el-input>
        </el-form-item>

        <el-form-item class="form-item" prop="password">
            <el-input 
            placeholder="密码" 
             v-model="form.password"
            type="password">
            </el-input>
        </el-form-item>

        <p class="form-text">
            <nuxt-link to="#">忘记密码</nuxt-link>
        </p>

        <el-button 
        class="submit"
        type="primary"
        @click="handleLoginSubmit">
            登录
        </el-button>
    </el-form>

</template>

<script>
export default {
    data(){
        // rule:校验的规则  这里用不上
        // value:输入框的值
        // callback:回调函数 必须要执行 如果传了错误对象 就显示错误提示 如果通过就不用传参数
        var validateUsername = (rule, value, callback) => {
            // 通过value来验证是否是手机号码
        const isValid=/^1[3-9]\d{9}$/.test(value)
            // 如果不是手机号码就报错
            if(!isValid){
                callback(new Error("手机号码格式错误"))
            }else{
                //是手机号码(符合正则规则)就通过
                callback();
            }

        };
        return {
            // 表单数据
            form: {
                username:'',
                password:''
            },
            // 表单规则
            rules: {
                username:[
                    {validator: validateUsername, trigger: 'blur'}
                ],
                password:[
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ]
            },
        }
    },
    methods: {
        // 提交登录
        handleLoginSubmit(){
            // valid是全部字段验证通过 才返回true
            console.log( this.$refs.form);
           this.$refs.form.validate(valid=>{
               if(valid){
                //    this.$axios({
                //        url:"accounts/login",
                //        method:"POST",
                //        data:this.form
                //    }).then(res=>{
                //        console.log(res)
                //        const{data}=res
                //     // 调用store/user.js中的mutations方法 把data存到store
                //     this.$store.commit("user/setUserInfo",data)

                //     // 把token值存在本地
                //     localStorage.setItem("xianyun_token",data.token)
                    
                //     // 登录成功跳转到首页
                //     this.$router.push('/')
                //    })
                // 通过dispatch调用actions中的方法
                this.$store.dispatch("user/login", this.form).then(res=>{
                    this.$message.success('登录成功')
                    //  登录成功跳转到首页
                    // this.$router.push('/')
                    // 如果this.$route.query.returnUrl没有值，跳转到首页
                    this.$router.replace(this.$route.query.returnUrl || "/")
                })
               }
           })
        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>