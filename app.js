// app.js
const express = require('express')
const port = 3000
const bodyParser = require('body-parser') // 引用 body-parser
const methodOverRide = require('method-override')
const exphbs = require('express-handlebars') // 載入 handlebars

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes') //  引用路由器
require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //extname 指定副檔名:'.hbs'
app.set('view engine', 'hbs')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extender: true })) // 通過 body parser 轉成 req.body 物件
app.use(methodOverRide('_method'))

app.use(routes) // 使用路由器

app.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`)
})