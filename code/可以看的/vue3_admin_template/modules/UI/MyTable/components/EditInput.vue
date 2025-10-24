<template>
  <input :value="value" class="edit-input" type="text" @blur="onBlur" @click="onClick"
         @input="onInput">
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  setValue: {
    type: Function,
    default: () => {}
  }
})
const inputValue = ref(props.value)

const onInput = (e) => {
  inputValue.value = e.target.value.trim()
}

const onClick = (e) => {
  e.stopPropagation()
}

const onBlur = () => {
  props.setValue(inputValue.value)
}
</script>

<style lang="scss" scoped>
.edit-input {
  border: 1px solid aqua;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  outline: none;
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;
}
</style>