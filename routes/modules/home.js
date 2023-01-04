// home 路由模組
const express = require('express') // 引用 Express
const router = express.Router() // 引用 Express 路由器
const Todo = require('../../models/todo') // 引用 Todo model

//  定義首頁路由
router.get('/', (req, res) => {
  // controller: 拿到 Todo 資料
  Todo.find() // 取出 Todo model 所有資料
    .lean() // 把 mongoose 的 model 轉換成乾淨的 Javascript 資料陣列
    .sort({ _id: 'asc' }) // asc 正序 and desc 反序
    .then(todos => res.render('index', { todos })) // 將資料傳給 views/index 
    .catch(error => console.log(error)) // 錯誤回報
})
// 匯出路由模組
module.exports = router