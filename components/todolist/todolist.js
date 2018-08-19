// components/todoList/todolist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    todos: {
      type: Array,
      value: []
    },
    finish: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentList:[]
  },
  ready() {
    const list = this.data.todos.filter(todo => this.data.finish ? todo.isFinished : !todo.isFinished)
    this.setData({
      currentList: list
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(e) {
      this.triggerEvent('itemclick', e)
    }
  }
})