<template>
  <table class="my-table">
    <thead>
    <tr>
      <th v-for="(item, index) in tHead" :key="index">{{ item.text }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in tBody" :key="item.id">
      <td v-for="(value,key) in item" :key="key" @click.stop="showEditInput($event,key,index)">{{ value }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import type { App } from 'vue'
import { createApp, reactive, toRefs } from 'vue'
import EditInput from './components/EditInput.vue'

let editInputApp: App
const state = reactive({
  key: '',
  value: '',
  index: -1,
  text: ''
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      tHead: [],
      tBody: []
    })
  }
})

const { tHead, tBody } = toRefs(props.data)

const emit = defineEmits([ 'submit' ])

const showEditInput = (event, key, index) => {
  removeEditInputApp()
  if(!checkEditable(key)) {
    return
  }
  const target = event.target
  const oFrag = document.createDocumentFragment()

  editInputApp = createApp(EditInput, {
    value: target.textContent,
    setValue
  })

  if(editInputApp) {
    editInputApp.mount(oFrag)
    target.appendChild(oFrag)
    target.querySelector('.edit-input').select()
  }
  setData({ index, key, text: findText(key) })
}

const setData = ({ index, key, text, value = '' }) => {
  state.key = key
  state.index = index
  state.value = value
  state.text = text
}

const setValue = (value) => {
  state.value = value
  emit('submit', { ...state }, removeEditInputApp)
}

const findText = (key) => {
  const { text } = tHead.value.find(item => item.key === key)
  return text
}

const removeEditInputApp = () => {
  editInputApp && editInputApp.unmount()
  setData({
    index: -1,
    key: '',
    value: '',
    text: ''
  })
}

const checkEditable = (key) => {
  const { editable } = tHead.value.find(item => item.key === key)
  return editable
}

window.addEventListener('click', removeEditInputApp)
</script>

<style lang="scss" scoped>
.my-table {
  border-collapse: collapse;
  width: 100%;

  th, td {
    border: 1px solid #ccc;
    cursor: pointer;
    position: relative;
    text-align: center;
  }

  tr {
    line-height: 44px;
  }
}
</style>
