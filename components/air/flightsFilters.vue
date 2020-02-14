<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departdate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item,index) in sizeOptions"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <span>{{filter}}</span>
  </div>
</template>
<script>
export default {
  props: {
    // 数据
    data: {
      type: Object,
      // 默认是空数组
      default: {}
    }
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小

      sizeOptions: [
        //机型大小的列表
        { name: "大", size: "L" },
        { name: "中", size: "M" },
        { name: "小", size: "S" }
      ]
    };
  },
  computed: {
    filter(){
      const newData = this.data.flights.filter(v=>{
        // 假设当前数据都符合条件
        let valid = true;
        // 航空公司
        if(this.company && v.airline_name!==this.company){
          valid = false;
        }
        // 机场
        if(this.airport && v.org_airport_name!==this.airport){
          vaild=false;
        }
        // 机型大小
        if(this.airSize&& v.plane_size!==this.airSize){
          valid=false;
        }
        // 时间
        if(this.flightTimes){
          //选中的时间段
          const arr = this.flightTimes.split(",")//["6","12"]
          // 当前航班小时
          const hours = +v.dep_time.split(":")[0];
          // 如果出发时间不在时间段内 就是不合法
          if(hours<+arr[0] || hours>+arr[1]){
            valid = false;
          }
        }
        return valid
      })
        this.$emit("getAirData", newData);
        return "";
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      // const newData = this.data.flights.filter(v=>{
      //   return v.org_airport_name===value
      // });
      // this.$emit("getAirData",newData)
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
        //const from = +value.split(",")[0];
        //const to = +value.split(",")[1];
      //   const [from,to]=value.split(",")//[6,12]
      //   const newData = this.data.flights.filter(v=>{
      //     // 出发时间小时
      //     const start =+v.dep_time.split(":")[0]
      //     return start>=from&&start<to;
      // });
      // this.$emit("getAirData",newData)
        
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      //   const newData = this.data.flights.filter(v => {
      //   return v.airline_name == value;
      // });
      // this.$emit("getAirData", newData);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      //   const newData = this.data.flights.filter(v => {
      //   return v.plane_size === value;
      // });
      // this.$emit("getAirData", newData);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {}
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>