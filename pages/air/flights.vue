<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
                <div>
                    
                </div>
                
                <!-- 航班头部布局 -->
                <FlightsListHead/>
                
                
                <!-- 航班信息列表 -->
                <FlightsItem
                v-for="(item,index) in flightsData.flights" :key="index"
                :data="item"/>
            </div>

            <!-- 侧边栏 -->
            <div class="aside">
                <!-- 侧边栏组件 -->
            </div>
        </el-row>
    </section>
</template>

<script>

import FlightsListHead from "@/components/air/flightsListHead.vue"
import FlightsItem from "@/components/air/flightsItem.vue"

export default {
    data(){
        return {
            flightsData:{},//航班总数据
            dataList:[]//航班列表数据，用于循环flightsItem组件 
        }
    },
    components: {
        FlightsListHead,FlightsItem
    },
    methods: {
        // 发送请求获取航班总数据
        getData(){
            this.$axios({
                url:'airs',
                method:"GET",
                params:this.$route.query
            }).then(res=>{
                console.log(res);
                this.flightsData=res.data,
                this.dataList=this.flightsData.flights
            })
        }
    },
    mounted () {
        // 页面加载获取航班数据
        this.getData()
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>