import React, { Component } from 'react'

class TodoList extends Component {
  render() {
    const state = {
      list: [
        { id: '1', name: 'todo1', complete: false },
        { id: '2', name: 'todo2', complete: false },
        { id: '3', name: 'todo3', complete: false }
      ]
    }

    const handleChange = (item) => {
      return (e) => {
        console.log('%c 🍫 item', 'font-size:16px;color:#ea7e5c', item)
        console.log('%c 🍧 e', 'font-size:16px;color:#b03734', e)
        const { list } = state
        const newList = list.map((listItem) => {
          if (listItem.id === item.id) {
            return {
              ...listItem,
              complete: e.target.checked
            }
          } else {
            return item
          }
        })
        console.log('%c 🍞 newList', 'font-size:16px;color:#4fff4B', newList)
        this.setState({
          list: newList
        })
        // e.target.checked = !e.target.checked
        console.log('%c 🌮 e.target.checked', 'font-size:16px;color:#ed9ec7', e.target.checked)
      }
    }
    return (
      <div>
        <div className='header'>
          <input type='text' />
        </div>
        <div className='list'>
          {state.list.map((item) => {
            return (
              <div className='item' key={item.id}>
                <input id={item.name} type='checkbox' checked={item.complete} onChange={handleChange(item)} />
                <label htmlFor={item.name}>{item.name}</label>
              </div>
            )
          })}
        </div>
        <div className='footer'>
          已选 {state.list.filter((item) => item.complete).length}项/共{state.list.length}项
        </div>
      </div>
    )
  }
}
export default TodoList
