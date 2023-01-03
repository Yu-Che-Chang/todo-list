const mongoose = require('mongoose') //把 mongoose 載入並使用以下方法
// 資料庫綱要
const Schema = mongoose.Schema

// new + Schema 物件建構子(關鍵字：物件導向 object mapping)
const todoSchema = new Schema({
  name: {
    type: String,  // 資料型別事字串
    required: true // 這個是必填欄位
  },
  isDone: {
    type: Boolean,
    default: false
  }
})
// 透過 module.exports 輸出
// 把定義的 Schema 編譯成可供操作的model物件,並取名成Todo
module.exports = mongoose.model('Todo', todoSchema)