<template>
  <input :type="type" :placeholder="placeholder" :value="value" @input="handleInput" />
</template>

<script setup lang="ts">
let value = defineModel()

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  maxlength: String,
  minlength: String,
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  placeholder: String,
  clearable: {
    type: Boolean,
    default: false,
  },
  clearIcon: String,
  formatter: Function,
  parser: Function,
  showPassword: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: Number,
  prefixIcon: String,
  suffixIcon: String,
  rows: {
    type: Number,
    default: 2,
  },
  autosize: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  name: String,
  readonly: {
    type: Boolean,
    default: false,
  },
  // max,
  // min,
  // step,
  resize: String,
  autofocus: {
    type: Boolean,
    default: false,
  },
  form: String,
  ariaLabel: String,
  tabindex: String,
  validateEvent: {
    type: Boolean,
    default: true,
  },
  inputStyle: {
    type: String,
    default: '{}',
  },
  label: String,
  inputmode: String,
})

const emits = defineEmits(['input', 'delete'])

const handleInput = (event: Event) => {
  value.value = (<HTMLInputElement>event.target).value
  emits('input', value.value)
}
</script>

<style lang="scss" scoped></style>
