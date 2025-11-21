import { type FunctionalComponent, h } from 'vue'
export const VueSlot: FunctionalComponent<{ foo: Function }> = (props, { slots }) => {
  return h('div', null, [props.foo(), slots?.header?.({ title: 'hello' }), slots.default ? slots.default() : '默认内容', slots?.footer?.()])
}
