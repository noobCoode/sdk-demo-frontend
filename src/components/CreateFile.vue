<template>
  <div>
    <el-form>
      <el-input v-model="title" placeholder="please input your file title"></el-input>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="please input your file content"
        v-model="content">
      </el-input>
      <el-button
        type="info"
        v-on:click="submit">
        提交
      </el-button>
      <el-button
        type="warn"
        v-on:click="goNext">
        查看文件列表
      </el-button>
    </el-form>
  </div>

</template>

<script>
  export default {
    name: "CreateFile.vue",
    data() {
      return {
        title: "",
        content: ""
      }
    },
    methods: {
      submit() {
        this.$axios.post(
          this.$host,
          {
            title: this.title,
            content: this.content
          })
          .then(resp => {
            alert("save success")
          })
          .catch(error => {
            alert(error)
          })
      },

      goNext() {
        this.$router.push("/FileList")
      }
    }
  }
</script>

<style scoped>

</style>
