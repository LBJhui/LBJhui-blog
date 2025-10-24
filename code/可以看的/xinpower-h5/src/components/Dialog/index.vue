<template>
  <div></div>
</template>

<script setup lang="ts">
import { Dialog } from 'vant'
import { onMounted } from 'vue'

const emits = defineEmits(['confirmCallback', 'cancelCallback'])

interface Props {
  type?: string
  title?: string
  message: string
  confirmButtonColor?: string
  confirmButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmButtonColor: '#5870CB'
})

onMounted(() => {
  switch (props.type) {
    case 'confirm':
      Dialog.confirm({
        title: props.title,
        message: props.message,
        confirmButtonColor: props.confirmButtonColor,
        confirmButtonText: props.confirmButtonText,
        lockScroll: true
      })
        .then(() => {
          emits('confirmCallback')
        })
        .catch(() => {
          emits('cancelCallback')
        })
      break
    default:
      Dialog({
        title: props.title,
        message: props.message,
        confirmButtonColor: props.confirmButtonColor,
        confirmButtonText: props.confirmButtonText,
        lockScroll: true
      }).then(() => {
        emits('confirmCallback')
      })
  }
})
</script>

<style lang="less">
.van-dialog {
  width: 600px;
  background: #ffffff;
  box-shadow: 0px 16px 32px 0px rgba(28, 50, 122, 0.15);
  border-radius: 12px;
  font-family: PingFangSC-Semibold, PingFang SC;

  .van-dialog__header {
    font-size: 32px;
    font-weight: 600;
    color: #0f1a30;
    line-height: 48px;
    padding: 18px 0;
    border-bottom: 2px solid #e5e7ea;
    box-sizing: border-box;
  }

  .van-dialog__message {
    padding: 68px 119px;
    font-size: 28px;
    font-weight: 600;
    color: #313836;
    line-height: 44px;
  }

  .van-dialog__message--has-title {
    padding: 48px 79px;
  }

  .van-dialog__footer {
    border-top: 2px solid #e5e7ea;
  }

  .van-button__content {
    font-size: 28px;
    font-weight: 400;
    line-height: 80px;
  }

  .van-dialog__cancel {
    height: 84px;
    border-right: 2px solid #e5e7ea;
  }

  .van-dialog__confirm {
    height: 84px;
  }
}
</style>
