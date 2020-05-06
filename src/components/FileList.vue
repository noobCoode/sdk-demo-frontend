<template>
  <el-table
    :data="fileListView"
    style="width: 80%">
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="title"
      label="文件名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="option"
      label="操作">
      <template slot-scope="scope">
        <el-button @click="download(scope.row)" type="info" size="small">下载</el-button>
        <el-button @click="edit(scope.row)" type="text" size="small" >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "FileList.vue",
    data() {
      return {
        fileList: []
      }
    },
    /**
     *初始化时获取fileList
     */
    created() {
      this.$axios
        .get(this.$host)
        .then(resp => {
          this.fileList = resp.data.result
        }).catch(error => {
        alert(error)
      })
    },
    computed: {
      fileListView() {
        let fileListView = []
        this.fileList.forEach((file) => {
          let tmp = {
            "createTime": file.createTime.replace("T", " "),
            "lastEditTime": file.lastEditTime.replace("T", " "),
            "title": file.title,
            "content": file.content
          }
          fileListView.push(tmp)
        })
        return fileListView
      }
    },
    methods: {
      /**
       * 下载文件
       * 1、responseType设置为blob
       * 2、模拟出一个a标签点击事件实现下载
       * @param row
       */
      download(row) {
        this.$axios.get(`${this.$host}/download/${row.title}`)
        this.$axios({
          method: "get",
          url: `${this.$host}/download/${row.title}`,
          responseType: 'blob'
        }).then(res => {
          let url = window.URL.createObjectURL(res.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${row.title}.txt`)
          document.body.appendChild(link)
          link.click()
        })
      },
      /**
       * 编辑文件
       * @param row
       */
      edit(row) {
        this.$router.push({
          path: "/EditFile/" + row.title
        })
      }
    }
  }
</script>

<style scoped>

</style>
