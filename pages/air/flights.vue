<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @getAirData="getAirData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息列表 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />

        <!-- 分页 -->
        <!-- current-page：当前页数
        page-size：当前的条数-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";

export default {
  data() {
    return {
      flightsData: {
        flights: [], //航班总数据
        info: {}, //航班信息
        options: {} //筛选选项
      },
      // 过滤条件触发时候需要修改数组列表`flightsData.flights`，这样原来的列表就会被覆盖了，所以需要缓存一份列表
      cacheFlightsData: {
        // 缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {}
      },
      //当前页数
      pageIndex: 1,
      //当前条数
      pageSize: 5,
      //总条数
      total: 0
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters
  },
  methods: {
    // 发送请求获取航班总数据
    getData() {
      this.$axios({
        url: "airs",
        method: "GET",
        params: this.$route.query
      }).then(res => {
        console.log(res);
        // 总数据
        this.flightsData = res.data,
        // 缓存一份新的列表数据数据，这个列表不会被修改
        // 而flightsData会被修改
        this.cacheFlightsData = {...res.data}
          // 总条数
          this.total = this.flightsData.total;
      });
    },
    // 切换条数时触发的事件
    handleSizeChange(index) {
      this.pageSize = index;
    },
    // 切换页面时触发的事件
    handleCurrentChange(index) {
      this.pageIndex = index;
    },
    // 获取过滤组件的过滤后的数组（arr就是过滤后的数组）
    getAirData(arr){
      this.flightsData.flights=arr;
      //总条数
      this.total=arr.length
    }
  },
  computed: {
    // 当前页面要展示的数组（要切割）
    dataList() {
      // 判断flightsData有没有值
      if (!this.flightsData.flights) {
        return [];
      }
      // 第一页展示0-5，第二页展示5-10
      const arr = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  mounted() {
    // 页面加载获取航班数据
    this.getData();
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>