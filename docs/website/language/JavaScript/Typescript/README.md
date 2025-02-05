# Typescript 小点知识总结

## 用发布订阅模式解耦

```Typescript
const eventNames = ['API:UN_AUTH', 'API:INVALID']
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listeners: Record<string, Set<Function>> = {
    'API:UN_AUTH': new Set(),
    'API:INVALID': new Set()
  }

  on(eventName: EventNames, listener: Function) {
    this.listeners[eventName].add(listener)
  }

  emit(eventName: EventNames, ...args: any[]) {
    this.listeners[eventName].forEach((listener) => listener(...args))
  }
}

export default new EventEmitter()
```
