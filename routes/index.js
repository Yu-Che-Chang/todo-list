//  總路由器
const express = require('express') // 引用 Express
const router = express.Router() // 引用 Express 路由器

// 引入路由模組
const home = require('./modules/home')
router.use('/', home) // 將網址結構符合 / 字串的 request 導向 home 模組 

const todos = require('./modules/todos')
router.use('/todos', todos)

//  匯出路由器
module.exports = router