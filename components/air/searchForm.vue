<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(index)"
        :class="{active:index===currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions: 监听输入框的输入，可以在这个事件中请求API数据,类似input事件 -->
        <!-- select: 点击展开列表选项时候触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @blur="handleDepartBlur"
          @select="handleDepartSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @blur="handleDestBlur"
          @select="handleDestSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          v-model="form.departDate"
          placeholder="请选择日期"
          style="width: 100%;"
          :picker-options="pickerOptions"
          @change="handleDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 引入日期插件
import moment from "moment";

export default {
  data() {
    return {
      tabs: [
        {
          icon: "iconfont icondancheng",
          name: "单程"
        },
        {
          icon: "iconfont iconshuangxian",
          name: "往返"
        }
      ],
      currentTab: 0,
      // form表单数据
      form: {
        departCity: "", //出发城市
        departCode: "", //出发城市代码
        destCity: "", //到达城市
        destCode: "", //到达城市代码
        departDate: "" //出发日期
      },
      //出发城市列表
      departData: [],
      // 到达城市列表
      destData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime()+3600 * 1000 * 24 < Date.now();
        }
      }
    };
  },
  methods: {
    // tab栏切换时触发
    handleSearchTab(index) {
      this.currentTab = index;
      if (index === 1) {
        this.$alert("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },

    //  出发城市和到达城市输入框变化时 获取城市下拉列表的代码是一样的 可以封装起来 方便调用

    getCityList(value, callback) {
      // 有value值才发请求 根据value值获取城市列表
      return this.$axios({
        url: "/airs/city",
        method: "GET",
        // axios的get请求的参数使用params, 如果是post请求使用data
        params: {
          name: value
        }
      }).then(res => {
        // console.log(res);
        // 后台返回的数据中data是数组(里面是对象)，但是数组里面的对象中没有value值
        const { data } = res.data;
        // 给data中每一项都加上value属性（遍历数组 用map 会返回一个新数组）
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
          console.log(newData);
        });
        return newData;
      });
    },
    // 出发城市输入框获得焦点时触发
    // value是输入框的值，callback回调函数 接收要展示的列表
    queryDepartSearch(value, callback) {
      // 如果输入框，没有值就直接返回
      if (!value) {
        // 没有输入值的时候 下拉列表不展示
        callback([]);
        return;
      }
      // 调用封装好的getCityList方法
      this.getCityList(value).then(newData => {
        // 把callback中展示的数据给到出发城市列表
        this.departData = newData;
        // callback把数组展示到列表中，数组中的每一项必须是对象 对象中必须有value属性
        callback(newData);
      });
      // // 如果输入框，没有值就直接返回
      // if(!value){
      //     return
      // }
      // // 有value值才发请求 根据value值获取城市列表
      // this.$axios({
      //     url:"/airs/city",
      //     method:'GET',
      //     // axios的get请求的参数使用params, 如果是post请求使用data
      //     params: {
      //         name: value
      //     }
      // }).then(res=>{
      //     console.log(res);
      //     // 后台返回的数据中data是数组(里面是对象)，但是数组里面的对象中没有value值
      //     const{data} = res.data;
      //     // 给data中每一项都加上value属性（遍历数组 用map 会返回一个新数组）
      //     const newData = data.map(v=>{
      //         v.value=v.name.replace("市","");
      //         return v
      //     })
      //     // callback把数组展示到列表中，数组中的每一项必须是对象 对象中必须有value属性
      //     callback(newData)
      // })
    },

    // 到达城市输入框获得焦点时触发
    queryDestSearch(value, callback) {
      // 如果输入框，没有值就直接返回
      if (!value) {
        // 解决失焦之后城市还在的bug
        // this.departData=[]
        callback([]);
        return;
      }
      this.getCityList(value).then(newData => {
        this.destData = newData;
        callback(newData);
      });
    },

    // 出发城市输入框失去焦点时候触发
    handleDepartBlur() {
      if (this.departData.length === 0) {
        return;
      }
      // 解决失焦的bug 如果输入框没有值就清空departData下拉列表
      if (this.form.departCity === "") {
        this.departData = [];
      } else {
        // 默认获取数组中第一个城市
        this.form.departCity = this.departData[0].value;
        this.form.departCode = this.departData[0].sort;
      }
    },

    // 到达城市输入框失去焦点时候触发
    handleDestBlur() {
      if (this.destData.length === 0) {
        return;
      }
      // 解决失焦的bug 放在
      if (this.form.departCity === "") {
        this.departData = [];
      } else {
        // 默认获取数组中第一个城市
        this.form.destCity = this.destData[0].value;
        this.form.destData = this.destData[0].sort;
      }
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 到达城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 出发和目标城市切换时触发
    handleReverse() {
      // 触发和目标城市切换时触发
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      // console.log(this.form);
      if (!this.form.departCity) {
        this.$message.error("请输入出发城市");
        return;
      }
      if (!this.form.destCity) {
        this.$message.error("请输入到达城市");
        return;
      }
      if (!this.form.departDate) {
        this.$message.error("请选择时间");
        return;
      }
      // 把form表单的数据存进state中
      // 通过commit方法调用
      this.$store.commit("air/setHistory",this.form)
      // 跳转到 /air/flights，保证该页面url的参数有5个参数
      this.$router.push({
        path: "/air/flights",
        // query是url的参数
        query: this.form
      });
    }
  }
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>