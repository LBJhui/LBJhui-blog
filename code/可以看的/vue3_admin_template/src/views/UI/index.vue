<template>
  <div>UI组件二次封装</div>
  <MyInput ref="inputRef" v-model="data" placeholder="地址">
    <template #prefix>
      <el-icon class="el-input__icon">
        <search />
      </el-icon>
    </template>
  </MyInput>
  <button @click="clear">1111</button>
  <my-table :data="tableData" @submit="editData"></my-table>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import MyInput from './components/MyInput.vue'

let data = ref('')
let inputRef = ref()

onMounted(() => {
  if(inputRef.value) {
    inputRef.value.focus()
  }
})

const clear = () => {
  inputRef.value.clear()
}

const tableData = ref({
  tHead: [
    { key: 'id', text: '学号', editable: false },
    { key: 'name', text: '姓名', editable: false },
    { key: 'age', text: '年龄', editable: false },
    { key: 'chinese', text: '语文', editable: true },
    { key: 'math', text: '数学', editable: true },
    { key: 'english', text: '英语', editable: true },
  ],
  tBody: [
    {
      id: '1',
      name: '张三',
      age: 16,
      chinese: 88,
      math: 90,
      english: 100,
    },
    {
      id: '2',
      name: '李四',
      age: 17,
      chinese: 90,
      math: 100,
      english: 100,
    },
    {
      id: '3',
      name: '王五',
      age: 18,
      chinese: 100,
      math: 100,
      english: 100,
    },
    {
      id: '4',
      name: '赵六',
      age: 19,
      chinese: 100,
      math: 100,
      english: 100,
    },
  ]
})

const editData = ({ index, key, value, text }, removeInput) => {
  // 需要判断数据类型
  if(tableData.value.tBody[index][key] != value) {
    const cfm = window.confirm(`
      您确定要将数据下标为 ${ index } 项 ${ text }字段的内容修改为${ value }吗？
    `)
    if(cfm) {
      tableData.value.tBody = tableData.value.tBody.map((item, idx) => {
        index === idx && (item[key] = value)
        return item
      })
    } else {
      removeInput()
    }
  }
}
</script>

<style scoped></style>
