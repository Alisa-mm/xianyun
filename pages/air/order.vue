<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <div class="main">
                <OrderForm/>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                          
            </div>
        </el-row>
    </div>
</template>

<script>
import OrderForm from "@/components/air/OrderForm"
export default {
    // 注册组件
    components:{
        OrderForm
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }
</style>