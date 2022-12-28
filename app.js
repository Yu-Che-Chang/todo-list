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

const app = express()

// 載入 handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //extname 指定副檔名:'.hbs'
app.set('view engine', 'hbs')

// XXXXX 重要 XXXXX
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
// 通過 body parser 轉成 req.body 物件
app.use(bodyParser.urlencoded({ extender: true }))

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
  // controller: 拿到 Todo 資料
  Todo.find() // 取出 Todo model 所有資料
    .lean() // 把 mongoose 的 model 轉換成乾淨的 Javascript 資料陣列
    .then(todos => res.render('index', { todos })) // 將資料傳給 views/index 
    .catch(error => console.log(error)) // 錯誤回報
})

app.get('/todos/new', (req, res) => {
  res.render('new')
})

// CREATE: 新增 todo
app.post('/todos', (req, res) => {
  const name = req.body.name // 從req.body 拿出表單 name 資料
  return Todo.create({ name }) //  在伺服器端使用odm語法透過mongoose對DB存取資料
    .then(() => res.redirect('/')) // 完成後返回首頁
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id // 從 URL中利用req.params 找到 id
  return Todo.findById(id) // 把id用findById找出mongoDB中id資料
    .lean() // 轉換成 JS物件
    .then((todo) => res.render('detail', { todo })) // 渲染前端樣板 導入todo 資料
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) // 從db 找出自動產生的id資料
    .lean() // 轉換成 JS物件
    .then((todo) => res.render('edit', { todo })) // 渲染前端樣板 導入todo 資料
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id) // return : 請求會有失敗/成功的情況,利用 return 可除錯
    // 使用JS語法利用mongoose在DB 找到對應id後,拉資料到sever端, 接著 .then 執行以下function
    .then((todo) => {
      todo.name = name
      return todo.save() // 把 client端送出的 修改後todo 轉成 資料庫指令 給 DB 
    })
    .then(() => res.redirect(`/todos/${id}`)) // 修正後的資料 在重新 redirect 執行 detail action
    .catch(error => console.log(error))
})

// delete: 刪除功能
app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id // 取得URL上的id,用來查詢想刪除的todo_id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => todo.remove()) // 刪除這筆資料
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`)
})