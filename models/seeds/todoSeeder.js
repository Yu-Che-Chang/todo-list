const Todo = require('../todo')
const db = require('../../config/mongoose')

// 連線成功
db.once('open', () => {
  // 在先前新增 Todo 的model物件中 依照 Schema 規格新增種子資料
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })
  }
  console.log('done')
})