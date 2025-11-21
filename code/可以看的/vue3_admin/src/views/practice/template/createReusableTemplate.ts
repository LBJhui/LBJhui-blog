export function createReusableTemplate() {
  let render
  const DefineTemplate = {
    setup(_, { slots }) {
      return () => {
        render = slots.default
      }
    },
  }

  const UseTemplate = (props) => render(props)

  return [DefineTemplate, UseTemplate]
}
