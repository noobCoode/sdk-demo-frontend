<template>
  <div>
    <el-form>
      <el-input v-model="title" disabled></el-input>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入文件内容"
        v-model="content"
        @input="sendMsg"
      >
      </el-input>
      <el-button
        type="info"
        @click="goFileList">
        查看文件列表
      </el-button>
      <el-button
        type="info"
        @click="submit">
        提交文件
      </el-button>
    </el-form>
  </div>
</template>

<script>
  let stompClient = null
  import SockJs from 'sockjs-client'
  import Stomp from 'stompjs'

  export default {
    name: "EditFile.vue",
    data() {
      return {
        title: "",
        content: "",
        canWrite: false
      }
    },
    created() {
      this.initHttp()
      this.initWebSocket(stompClient)

    },
    methods: {
      initHttp() {
        this.$axios
          .get(`${this.$host}/${this.getLastPathInUrl(window.location.href)}`)
          .then(resp => {
            this.title = resp.data.result.title
            this.content = resp.data.result.content
          }).catch(error => {
          alert(error)
        })
      },

      initWebSocket() {
        let socket = new SockJs(`http://localhost:8081/socket`)
        stompClient = Stomp.over(socket)
        stompClient.connect({}, (frame) => {
          stompClient.subscribe(`/topic/files/${this.title}`, (message) => {
            console.log("message=" + message)
            this.content = JSON.parse(message.body).message
            this.canWrite = JSON.parse(message.body).canWrite
          })
          stompClient.subscribe(`/topic/files/${this.title}/who`, (message) => {
            alert(message)
          })
        })
      },

      sendMsg() {
        stompClient.send(`/app/files/${this.title}`, {}, this.content)
      },

      submit() {
        this.$axios.put(
          `${this.$host}/${this.title}`,
          {
            "title": this.title,
            "content": this.content
          }
        ).then(resp => {
          alert("success")
        }).catch(error => {
          alert(error.data.msg)
        })
      },

      goFileList() {
        this.$router.push("/FileList")
      },

      getLastPathInUrl(url) {
        let index = url.lastIndexOf("\/")
        return url.substring(index + 1, url.length)
      }
    },

  }
</script>

<style scoped>

</style>
