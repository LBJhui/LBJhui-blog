import React, { Component, useRef } from 'react'
import { nanoid } from 'nanoid'
import './index.css'

class TodoList extends Component {
  state = {
    list: [
      { id: '1', name: 'todo1', complete: false },
      { id: '2', name: 'todo2', complete: false },
      { id: '3', name: 'todo3', complete: false }
    ]
  }
  get selected() {
    return this.state.list.filter((item) => item.complete).length
  }

  get total() {
    return this.state.list.length
  }

  dialogRef = useRef(null)

  handleChange = (item) => {
    return (e) => {
      const { list } = this.state
      const newList = list.map((listItem) => {
        if (listItem.id === item.id) {
          return {
            ...listItem,
            complete: e.target.checked
          }
        } else {
          return listItem
        }
      })
      this.setState({
        list: newList
      })
      // e.target.checked = !e.target.checked
      console.log('%c 🌮 e.target.checked', 'font-size:16px;color:#ed9ec7', e.target.checked)
    }
  }

  handleDelete = () => {
    const { list } = this.state
    // this.dialogRef.current.showModal()
    console.log('%c 🍑 this.dialogRef', 'font-size:16px;color:#42b983', this.dialogRef)
    return
    // const newList = list.filter((item) => !item.complete)
    // this.setState({
    //   list: newList
    // })
  }

  handleKeyUp = (e) => {
    if (e.keyCode !== 13 || e.target.value.trim() === '') return
    const { list } = this.state

    this.setState({
      list: [{ id: nanoid(), name: e.target.value.trim(), complete: false }, ...list]
    })
  }
  render() {
    return (
      <div>
        <div className='header'>
          <input type='text' onKeyUp={this.handleKeyUp} />
        </div>
        <div className='list'>
          {this.state.list.map((item) => {
            return (
              <div className='item' key={item.id}>
                <input id={item.name} type='checkbox' checked={item.complete} onChange={this.handleChange(item)} />
                <label htmlFor={item.name}>{item.name}</label>
              </div>
            )
          })}
        </div>
        <div className='footer'>
          {/* <input type='checkbox' checked={ } /> */}
          已选 {this.selected}项/共{this.total}项<button onClick={this.handleDelete}>删除已完成</button>
        </div>
        <dialog ref={this.dialogRef}>确定要删除吗？</dialog>
      </div>
    )
  }
}
export default TodoList
