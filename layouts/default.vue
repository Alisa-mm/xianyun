<template>
  <div>
      <!-- 头部组件 -->
   <Header></Header> 
    <!-- <nuxt/>相当于router-view -->
    <nuxt />
    <!-- 页脚组件 -->
    <Footer></Footer>
  </div>
</template>
<script>
// 引入头部和尾部组件
import Header from "@/components/header.vue"
import Footer from "@/components/footer.vue"
export default {
  // 注册组件
  components:{
    Header,Footer
  }
}
</script>
<style>
*{
  margin:0;
  padding:0;
}
ul,li,ol{
  list-style: none;
}
a{
  color:inherit;
  text-decoration: none;
}
a:hover{
  color:inherit
}
em,i{
  font-style: none
}
</style>
