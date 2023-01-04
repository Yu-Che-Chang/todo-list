// app.js
const express = require('express')
const port = 3000
// 載入 mongoose
const mongoose = require('mongoose')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 引用 body-parser
const bodyParser = require('body-parser')

// 載入 Todo model
const Todo = require('./models/todo')

const methodOverRide = require('method-override')
const app = express()

// 載入 handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //extname 指定副檔名:'.hbs'
app.set('view engine', 'hbs')

//  引用路由器
const routes = require('./routes')

// XXXXX 重要 XXXXX
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
// 通過 body parser 轉成 req.body 物件
app.use(bodyParser.urlencoded({ extender: true }))

app.use(methodOverRide('_method'))

// 使用路由器
app.use(routes)

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

app.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`)
})