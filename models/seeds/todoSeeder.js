const mongoose = require('mongoose')
const Todo = require('../todo')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')

  // 在先前新增 Todo 的model物件中 依照 Schema 規格新增種子資料
  for(let i = 0; i < 10 ; i ++) {
    Todo.create({name: `name-${i}`})
  }
  console.log('done')
})