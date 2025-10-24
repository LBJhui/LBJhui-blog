import { ref, computed } from 'vue'
// 全局loading
const _loadingCount = ref(0)

const loading = computed({
  get() {
    return _loadingCount.value > 0
  },
  set(val) {
    _loadingCount.value += val ? 1 : -1
    _loadingCount.value = Math.max(0, _loadingCount.value)
  },
})

export default loading
