// app.js
const express = require('express')
const port = 3000
// 載入 mongoose
const mongoose = require('mongoose')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入 Todo model
const Todo = require('./models/todo')

const app = express()

// 載入 handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //extname 指定副檔名:'.hbs'
app.set('view engine', 'hbs')

// 設定連線到 mongoDB 
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
})


app.get('/', (req, res) => {
  // 拿到 Todo 資料
  Todo.find() // 取出 Todo model 所有資料
    .lean() // 把 mongoose 的 model 轉換成乾淨的 Javascript 資料陣列
    .then(todos => res.render('index', { todos })) // 將資料傳給 views/index 
    .catch(error => console.error(error)) // 錯誤回報
})

app.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`)
})