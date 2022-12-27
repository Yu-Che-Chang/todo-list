const express = require('express')
const port = 3000
const app = express()

app.get('/', (req, res) => {
  res.send('This is running')
})

app.listen(port, () => {
  console.log(`The server is on http://localhost:${port}`)
})