<template>
  <el-form ref="form" 
        :model="form" 
        :rules="rules" 
        class="form">
      <el-form-item class="form-item" prop="username">
          <el-input 
          placeholder="用户名/手机"
          v-model="form.username">
          </el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item class="form-item" prop="captcha">
          <el-input 
          placeholder="验证码"
          v-model="form.captcha"
          >
            <template slot="append">
                <el-button @click="handleSendCaptcha">
                    发送验证码
                </el-button>
            </template>
          </el-input>
      </el-form-item>
      <!-- 你的名字 -->
        <el-form-item class="form-item" prop="nickname">
          <el-input 
          placeholder="你的名字"
          v-model="form.nickname">
          </el-input>
      </el-form-item>
      <!-- 密码 -->
        <el-form-item class="form-item" prop="password">
          <el-input 
          placeholder="密码"
          type="password"
          v-model="form.password">
          </el-input>
      </el-form-item>
      <!-- 确认密码 -->
        <el-form-item class="form-item" prop="checkPassword">
          <el-input 
          placeholder="确认密码"
          type="password"
          v-model="form.checkPassword">
          </el-input>
      </el-form-item>
      <!-- 注册按钮 -->
       <el-form-item >
         <el-button 
         class="submit" 
        type="primary" 
        @click="handleRegSubmit">注册</el-button>
      </el-form-item>
  </el-form>
</template>

<script>
export default {
    data () {
      // rule:校验的规则 这里用不上
      // value:输入框的值
      // callback:回调函数 必须执行 如果传了错误对象 就显示错误提示
      // 用户名/手机号
      var validateUsername=(rule,value,callback)=>{
        // 通过value来验证手机号码的格式
        const isValid=/^1[3-9]\d{9}$/.test(value)
        if(!isValid){
          callback(new Error("手机号码格式错误"))
        }else{
          callback()
        }
      }
      // 密码
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.checkPassword !== '') {
            this.$refs.form.validateField('checkPassword');
          }
          callback();
        }
      };
      // 确认密码
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            // 表单数据
            form:{
                username:'',
                nickname:'',
                captcha:'',
                password:'',
                checkPassword:''
            },
            // 验证规则
            rules:{
              username:[
                { required: true, message: '请输入用户名', trigger: 'blur' }
              ],
               password: [{ 
                validator: validatePass, 
                trigger: 'blur' 
            }],
            checkPassword: [{ 
                validator: validateCheckPass, 
                trigger: 'blur' 
            }],
            nickname: [{ 
                required: true, 
                message: '请输入昵称', 
                trigger: 'blur' 
            }],
            captcha: [{ 
                required: true, 
                message: '请输入验证码', 
                trigger: 'blur' 
            }],

            }
        }
    },
    methods: {
        // 点击发送验证码
        handleSendCaptcha(){

        },
        //点击注册
        handleRegSubmit(){

        }
    }
}
</script>

<style scoped lang="less">
.form{
  padding:25px
}
.form-item{
  margin-bottom: 20px;
}
.form-text{
  font-size: 12px;
  color:#409EFF;
  text-align: right;
}
.submit{
  width:100%;
  margin-top:10px;
}
</style>