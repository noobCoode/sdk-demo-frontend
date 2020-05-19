<template>
  <div>
    <el-form>
      <el-input v-model="title" disabled></el-input>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入文件内容"
        v-model="content"
        @input="sendMessage"
        :disabled="!canWrite"
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
  let websocket = null
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
      this.establishWebsocket()

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

      establishWebsocket() {
        if (websocket == null) {
          websocket = new WebSocket(`ws://localhost:8081/websocket/${this.getLastPathInUrl(window.location.href)}/${getCookie("Session_id")}`)
          websocket.onopen = () => {
            console.log("已连接")
          }
          websocket.onmessage = (msg) => {
            let msgInfo=eval(`(${msg.data})`)
            console.log(msgInfo)
            //如果是锁消息
            if (msgInfo.lockMsg) {
              console.log(msgInfo.jSessionId === getCookie("Session_id"))
              this.canWrite = msgInfo.jSessionId === getCookie("Session_id")
            } else {
              this.content =msgInfo.msg
            }
          }
        }
      },

      sendMessage() {
        let msgInfo={
          "jSessionId":getCookie("Session_id"),
          "msg":this.content,
          "isLockMsg":false
        }
        websocket.send(JSON.stringify(msgInfo))
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


  function getCookie(cookie_name) {
    var allcookies = document.cookie;
    //索引长度，开始索引的位置
    var cookie_pos = allcookies.indexOf(cookie_name);

    // 如果找到了索引，就代表cookie存在,否则不存在
    if (cookie_pos !== -1) {
      // 把cookie_pos放在值的开始，只要给值加1即可
      //计算取cookie值得开始索引，加的1为“=”
      cookie_pos = cookie_pos + cookie_name.length + 1;
      //计算取cookie值得结束索引
      var cookie_end = allcookies.indexOf(";", cookie_pos);

      if (cookie_end === -1) {
        cookie_end = allcookies.length;

      }
      //得到想要的cookie的值
      var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
  }
</script>

<style scoped>

</style>
