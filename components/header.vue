<template>
  <div class="header-wrapper">
    <!-- 用el-row结合flex布局能解决flex的兼容问题 -->
    <el-row type="flex" justify="space-between" align="middle" class="header">
      <!-- 图片 -->
      <div class="logo">
        <img src="/logo.jpg" alt />
      </div>
      <!-- 菜单 -->
      <el-row type="flex" class="nav">
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>

      <!-- 用户中心 -->
        <!-- 如果用户存在则展示用户信息，用户数据来自store -->
        <el-dropdown v-if="$store.state.user.userInfo.token">
          <span class="el-dropdown-link">
            <nuxt-link to="#">
              <img :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar" />
              {{$store.state.user.userInfo.user.nickname}}
            </nuxt-link>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <nuxt-link to="#">个人中心</nuxt-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleLogout">退出</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 不存在用户信息展示登录注册链接 -->
        <nuxt-link to="/user/login" class="account-link" v-else>登录 / 注册</nuxt-link>
      
    </el-row>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.$store.state.user.userInfo.name);
  },
  methods: {
    //退出登录就回到首页
    handleLogout(){
        // 调用user里面的mutation方法中清除用户数据的方法
        this.$store.commit("user/clearUserInfo")
        this.$message.success("退出成功")
    }  
  }
};
</script>

<style scoped lang='less'>
.header-wrapper {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 3px 2px #f6f6f6;
  min-width: 1000px;
}
.header {
  width: 1000px;
  height: 60px;
  margin: 0 auto;

  .logo {
    img {
      width: 156px;
      height: 42px;
      display: block;
    }
  }
}
.nav {
  flex: 1;
  margin-left: 20px;
  a {
    display: block;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding: 0 20px;

    &:hover {
      border-bottom: 5px #409eff solid;
      color: #409eff;
    }
  }

  .nuxt-link-exact-active {
    background: #409eff;
    color: #fff;

    &:hover {
      color: #fff;
    }
  }
}
.el-dropdown-link img{
    width: 32px;
    height: 32px;
    vertical-align: middle;
    border: 2px solid #fff;
    border-radius: 50px;
}
</style>