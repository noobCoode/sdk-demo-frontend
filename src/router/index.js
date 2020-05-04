import Vue from 'vue'
import Router from 'vue-router'
import CreateFile from '@/components/CreateFile'
import FileList from '@/components/FileList'
import EditFile from '@/components/EditFile'
import Hello from "@/components/Hello"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CreateFile',
      component: CreateFile
    },{
      path: '/FileList',
      name: 'FileList',
      component: FileList
    },{
      path: '/EditFile/:id',
      name: 'EditFile',
      component: EditFile
    },{
      path: '/Hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
