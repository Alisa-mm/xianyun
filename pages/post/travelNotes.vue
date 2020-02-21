<template>
  <!-- 整个页面布局 -->
  <div class="container">
    <el-row type="flex" justify="space-between" class="el-row">
      <!-- 主体布局 -->
      <div class="main">
        <h2>发表新攻略</h2>
        <p>分享你的个人游记，让更多人看到哦!</p>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <!-- 标题 -->
          <el-form-item prop="title">
            <el-input placeholder="请输入标题" v-model="form.title"></el-input>
          </el-form-item>
          <!-- vu2-editor 编辑器 -->
          <el-form-item class="quillWrapper" ref="vueEditor" prop="content">
            <client-only>
              <vue-editor
                v-model="form.content"
                @image-added="handleImageAdded"
                useCustomImageHandler
              ></vue-editor>
            </client-only>
          </el-form-item>
          <!-- 选择城市 -->
          <el-form-item label="选择城市" class="checkCity" prop="city">
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
            <el-button type="primary" @click="publishNotes">发布</el-button>
            <span>
              或者
              <a href="#" @click="saveDraft">保存到草稿</a>
            </span>
          </el-form-item>
        </el-form>
      </div>
      <!-- 侧边栏草稿箱 -->
      <div class="draftAside">
        <div class="draftBox">
          <h4>草稿箱</h4>
          <!-- 草稿列表 -->
          <div class="draftsList" v-for="(item,index) in this.$store.state.post.draft" :key="index">
           <div class="content1">
              <div class="content">
              {{item.title}}
              <i class="iconfont el-icon-edit" @click="editorDraft(index)"></i>
            </div>
            <span>{{item.time}}</span>
           </div>
            <el-button type="danger" icon="el-icon-delete" class="del" @click="delDraft(index)"></el-button>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
//引入日期插件
import moment from "moment";
export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        city: ""
      },
      // 城市列表
      cityData: [],
      //rules规则校验表单
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        city: [{ required: true, message: "请输入正确城市", trigger: "blur" }],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /* 功能部分 */
    // 1.编辑器添加图片功能完成
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("files", file);
      console.log(FormData);
      this.$axios({
        url: "/upload",
        method: "POST",
        data: formData
      })
        .then(result => {
          let url = this.$axios.defaults.baseURL + result.data[0].url; // Get url from response
          console.log(url);
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 2.选择城市功能完成 */
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
        // console.log(res);
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
      // console.log(this.cityData);
      this.form.city = this.cityData[0].value;
    },
    /* 3.发布攻略功能完成 */
    //发布攻略
    publishNotes() {
      //校验表单 表单全部验证通过之后才发请求
      this.$refs.form.validate(valid => {
        console.log(this.form);
        if (valid) {
          this.$axios({
            url: "/posts",
            method: "POST",
            headers: {
              Authorization: `Bearer ` + this.$store.state.user.userInfo.token
            },
            data: this.form
          }).then(res => {
            console.log(res);
            //如果发布成功，提示用户发布成功，并且清空输入框内容
            if (res.status == 200) {
              this.$message.success("文章发布成功,审核中...");
              //  清空输入框内容
              (this.form.title = ""),
                (this.form.content = ""),
                (this.form.city = "");
              // 跳转到攻略首页
              setTimeout(() => {
                this.$router.push("/post/");
              }, 3000);
            }
          });
        }
      });
    },
    /* 4.文章保存到草稿功能 */
    saveDraft() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //校验通过,获取到内容把内容保存到store中
          // 把time添加到form表单里
          this.form.time = new Date();
          this.form.time = moment(this.form.time).format("YYYY-MM-DD");
          // 调用commit方法
          this.$store.commit("post/setDraft", this.form);
        }
      });
    },
    //5.编辑草稿功能
    editorDraft(index){
      //选中哪个草稿 就把内容返回到表单里
      this.form={
        title:this.$store.state.post.draft[index].title,
        content:this.$store.state.post.draft[index].content
      }
    },
    //6.删除草稿功能
    delDraft(index){
      this.$store.commit("post/delDraftData", index);
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
  width: 350px;
  .draftBox {
    border: 1px solid #ddd;
    padding: 10px;
    h4 {
      margin-bottom: 10px;
      font-weight: 400;
      color: #666;
    }
    .draftsList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content1{
        display: flex;
        flex-direction: column;
         .content {
        cursor: pointer;
        &:hover {
          color: #ffa500;
        }
      }
      }
     
      .del {
        margin-bottom: 10px;
      }
    }
  }
}
</style>