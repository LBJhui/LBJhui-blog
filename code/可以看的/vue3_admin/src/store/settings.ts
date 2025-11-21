import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const settingStore = defineStore('setting', {
  state: () => {
    return reactive({
      hidden: false,
    })
  },
  actions: {
    setHidden(value: boolean) {
      this.hidden = value
    },
  },
  getters: {},
})
