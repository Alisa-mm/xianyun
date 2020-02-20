<template>
  <!-- 整个页面布局 -->
  <div class="container">
    <el-row type="flex" justify="space-between" class="el-row">
      <!-- 主体布局 -->
      <div class="main">
        <h2>发表新攻略</h2>
        <p>分享你的个人游记，让更多人看到哦!</p>
        <el-form ref="form" :model="form" label-width="80px">
          <!-- 标题 -->
          <el-form-item>
            <el-input placeholder="请输入标题" v-model="form.title"></el-input>
          </el-form-item>
          <!-- vu2-editor 编辑器 -->
          <el-form-item class="quillWrapper">
            <client-only>
              <vue-editor v-model="form.content"></vue-editor>
            </client-only>
          </el-form-item>
          <!-- 选择城市 -->
          <el-form-item label="选择城市" class="checkCity">
            <!-- fetch-suggesstions:监听输入框的输入，可以在这个事件中请求Api数据，类似input事件 -->
            <!-- select:点击选中建议项时触发 -->
            <el-autocomplete
              v-model="form.city"
              placeholder="请搜索游玩城市"
              :fetch-suggestions="searchVisitCity"
              @select="handleSelect"
              @blur="handleBlur"
            ></el-autocomplete>
          </el-form-item>
          <!-- 发布/保存到草稿 -->
          <el-form-item>
            <el-button type="primary">发布</el-button>
            <span>
              或者
              <a href="#">保存到草稿</a>
            </span>
          </el-form-item>
        </el-form>
      </div>
      <!-- 侧边栏草稿箱 -->
      <div class="draftAside">
        <div class="draftBox">
          <h4>草稿箱</h4>
          <!-- 草稿列表 -->
          <div class="draftsList">
            <div class="content">
              内容
              <i class="iconfont el-icon-edit"></i>
              <el-button type="danger" icon="el-icon-delete" class="del"></el-button>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        city: ""
      },
      // 城市列表
      cityData: []
    };
  },
  methods: {
    //搜索游玩城市时触发
    searchVisitCity(value, callback) {
      // 如果输入框，没有值就不执行 并且不显示下拉列表
      if (!value) {
        // 解决失焦之后城市还在的bug
        this.cityData = [];
        callback([]);
        return;
      }
      // 有value值才发请求 根据value值获取城市列表
      this.$axios({
        url: "/airs/city",
        method: "GET",
        // axios的get请求的参数使用params, 如果是post请求使用data
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        // 后台返回的数据中data是数组(里面是对象)，但是数组里面的对象中没有value值
        const { data } = res.data;
        // 给data中每一项都加上value属性（遍历数组 用map 会返回一个新数组）
        // v是数组中的每一项
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // callback把数组展示到列表中，数组中的每一项必须是对象 对象中必须有value属性
        // 把callback中展示的数据给到搜索的城市列表
        this.cityData = newData;
        callback(newData);
      });
    },
    //点击选择下拉列表城市时触发
    handleSelect(item) {
      this.form.city = item.value;
    },
    //失焦时触发
    handleBlur() {
      // console.log("aa");可以触发失焦事件
      if (this.cityData.length === 0) {
        return;
      }
      //失焦之后 如果用户不选下拉列表的城市 就默认获取数组中第一个城市
      console.log(this.cityData);
      this.form.city = this.cityData[0].value;
    }
  }
};
</script>

<style scoped lang="less">
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
  .main {
    h2 {
      font-weight: normal;
      font-size: 22px;
      margin: 0 0 10px 80px;
    }
    p {
      font-size: 12px;
      color: #999;
      margin: 0 0 10px 80px;
    }
    .quillWrapper {
      height: 400px;
    }
    .checkCity {
      margin-top: 110px;
      margin-left: 72px;
    }
    a {
      color: #ffa500;
      text-decoration: #ffa500;
    }
  }
}
.draftAside {
  margin-left: 50px;
  width: 300px;
  .draftBox {
    border: 1px solid #ddd;
    padding: 10px;
    h4 {
      margin-bottom: 10px;
      font-weight: 400;
      color: #666;
    }
    .content {
      cursor: pointer;
      &:hover {
        color: #ffa500;
      }
      .del {
        margin-left: 90px;
      }
    }
  }
}
</style>