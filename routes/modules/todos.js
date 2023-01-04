// todos 路由分支
const express = require('express') // 引用 Express
const router = express.Router() // 引用 Express 路由器
const Todo = require('../../models/todo') // 引用 Todo model

// CREATE: 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// CREATE: 新增 todo
router.post('/', (req, res) => {
  const name = req.body.name // 從req.body 拿出表單 name 資料
  return Todo.create({ name }) //  在伺服器端使用ODM語法透過mongoose對DB存取資料
    .then(() => res.redirect('/')) // 完成後返回首頁
    .catch(error => console.log(error))
})

// detail 頁面
router.get('/:id', (req, res) => {
  const id = req.params.id // 從 URL中利用req.params 找到 id
  return Todo.findById(id) // 把id用findById找出mongoDB中id資料
    .lean() // 轉換成 JS物件
    .then((todo) => res.render('detail', { todo })) // 渲染前端樣板 導入todo 資料
    .catch(error => console.log(error))
})

// EDIT:
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) // 從db 找出自動產生的id資料
    .lean() // 轉換成 JS物件
    .then((todo) => res.render('edit', { todo })) // 渲染前端樣板 導入todo 資料
    .catch(error => console.log(error))
})
// POST EDIT
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body// 解構賦值:用req.body的物件資料把 name,isDone 撈出來解構
  return Todo.findById(id) // return : 請求會有失敗/成功的情況,利用 return 可除錯
    // 使用JS語法利用mongoose在DB 找到對應id後,拉資料到sever端, 接著 .then 執行以下function
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on' // 等式右側判斷checkbox 是否勾,若無則checked欄位不存在,即 isDone === 'off' 回傳 false
      return todo.save() // 把 client端送出的 修改後todo 轉成 資料庫指令 給 DB 
    })
    .then(() => res.redirect(`/todos/${id}`)) // 修正後的資料 在重新 redirect 執行 detail action
    .catch(error => console.log(error))
})

// delete: 刪除功能
router.delete('/:id', (req, res) => {
  const id = req.params.id // 取得URL上的id,用來查詢想刪除的todo_id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => todo.remove()) // 刪除這筆資料
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router