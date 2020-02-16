<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>

      <el-form class="member-info">
        <!-- 循环乘机人信息 -->
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <!-- 循环保险数据 -->
        <div class="insurance-item"
         v-for="(item, index) in infoData.insurances"
         :key="index">
          <el-checkbox :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
           @change="handleInsurance(item.id)"
           border></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        //  乘机人列表
        users: [
          {
            username: "",
            id: ""
          }
        ],
        insurances: [],
        contactName: "",
        contactPhone: "",
        captcha: "",
        invoice: false, //是否需要发票 默认为false
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      },
      //  当前机票的详细信息
      infoData: {}
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({
        username: "",
        id: ""
      });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },
    // 处理保险数据
    handleInsurance(id){
      //判断数组中是否存在这个id
      const index=this.form.insurances.indexOf(id);
      // 如果已经存在这个id 说明当前是取消状态
      if(index>-1){
        // 删除这个id
        this.form.insurances.splice(index,1)
      }else{
        // 如果没有这个id 就是新增状态
        this.form.insurances.push(id)
      }
      
    },
    // 发送手机验证码
    handleSendCaptcha() {
      //  console.log(this.form)
      if(!this.form.contactPhone){
        this.$message.error("手机号码不能为空")
        return;
      }
      // 调用store/user.js中发送验证码的方法
      this.$store.dispatch("user/SendCaptcha",this.form.contactPhone).then(res=>{
         this.$message.success("验证码发送成功：000000");
       })
    },

    // 提交订单
    handleSubmit() {
      // 自定义表单验证
      const rules = {
        // 校验用户列表
        user:{
          errMessage:"乘机人信息不能为空",
          // 校验的函数，该函数返回是true证明验证通过，如果是false验证失败
          validator:()=>{
            let valid = true;
            console.log(this.form.users);
            this.form.users.forEach(v=>{
              // console.log(this.form.users);
              // 只要有一个属性的值是空的话 表单验证就不通过
              if(!v.username || !v.id){
                valid = false;
              }
            })
            return valid;
          }
        },
        // 校验联系人
        contactName:{
          errMessage:"联系人不能为空",
          validator:()=>{
            // 两个!!是双重取反 把字符串转换为布尔值(如果空字符串就是false 有值就是true) 
            return !!this.form.contactName
          }
        },
        //校验手机号
        contactPhone:{
          errMessage:"手机号不能为空",
          validator:()=>{
            return !!this.form.contactPhone
          }
        },
        // 校验验证码
         captcha:{
          errMessage:"验证码不能为空",
          validator:()=>{
            return !!this.form.captcha
          }
        },

      };
      // 循环rules对象 调用validator 方法校验
      // console.log(Object.keys(rules)) //Object.keys(要循环的对象)循环对象的方法
      // 先假设所有字段都校验通过
        let valid= true;
      Object.keys(rules).forEach(v=>{
        // 如果有字段校验不通过 就不用继续校验了
        if(!valid) return;
        const item = rules[v];//rules[v]就对象里面的每一项
        // 执行每个字段 下的validator函数
        valid = item.validator();
        if(!valid){
          this.$message.error(item.errMessage)
        }

      });
       // 如果验证没通过，就直接返回
      if(!valid) return;
      // 调用订单接口
      this.$axios({
        url:"/airorders",
        method:'POST',
        data:this.form,
        headers:{
          //必须要在token前面加上`Bearer `字符串，后面有一个空格
          Authorization:`Bearer `+this.$store.state.user.userInfo.token
        }
      }).then(res=>{
        console.log(res);
        
      })
     
      
    }

  },
  mounted() {
    // 请求机票的详细信息
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: "/airs/" + id,
      params: {
        seat_xid
      }
    }).then(res => {
      console.log(res);
      
      // 赋值给机票的详细信息
      this.infoData = res.data;
    });
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>