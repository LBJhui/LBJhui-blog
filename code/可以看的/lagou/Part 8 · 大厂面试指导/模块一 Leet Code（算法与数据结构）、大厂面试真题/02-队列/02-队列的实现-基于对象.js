class Queue {
  constructor() {
    this.queue = {}
    this.rear = 0
    // 用于记录队首的键
    this.head = 0
  }
  // 入队方法
  enQueue(item) {
    this.queue[this.rear++] = item
  }
  // 出队方法
  deQueue() {
    if (this.isEmpty()) {
      return
    }
    const headData = this.queue[this.head]
    delete this.queue[this.head]
    this.head++
    return headData
  }
  length() {
    return this.rear - this.head
  }
  isEmpty() {
    return this.length() === 0
  }
  clear() {
    this.queue = {}
    this.rear = 0
    this.head = 0
  }
}

const q = new Queue()
