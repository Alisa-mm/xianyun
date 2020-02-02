<template>
<div class="header-wrapper">
<!-- 用el-row结合flex布局能解决flex的兼容问题 -->
<el-row type="flex" justify="space-between" align="middle" class="header">
      <!-- 图片 -->
      <div class="logo">
          <img src="/logo.jpg" alt="">
      </div>
      <!-- 菜单 -->
       <el-row type="flex" class="nav">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/post">旅游攻略</nuxt-link>
          <nuxt-link to="/hotel">酒店</nuxt-link>
          <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>
      <!-- 用户中心 -->
      <div>
          <nuxt-link to="/user/login">登录/注册</nuxt-link>
      </div>
  </el-row>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='less'>
.header-wrapper{
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    box-shadow: 0 3px 2px #f6f6f6;
    min-width: 1000px;
}
.header{
    width: 1000px;
    height: 60px;
    margin:0 auto;

     .logo{
        img{
            width: 156px;
            height:42px;
            display: block;
        }
    }
}
.nav{
    flex:1;
    margin-left: 20px;
       a{
            display: block;
            height: 60px;
            line-height: 60px;
            box-sizing: border-box;
            padding: 0 20px;

            &:hover{
                border-bottom: 5px #409eff solid;
                color: #409eff;
            }
        }
    
        .nuxt-link-exact-active{
        background: #409eff;
        color: #fff;
            
            &:hover {
                color:#fff;
                }
        }          
}

</style>