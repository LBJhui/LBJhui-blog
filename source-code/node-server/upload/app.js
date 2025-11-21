// 大文件『切片上传』

const express = require('express')
const bodyParser = require('body-parser')
const upload = require('express-fileupload')
const { extname, resolve } = require('path')
const { existsSync, appendFileSync, writeFileSync } = require('fs')

const ALLOWED_TYPE = {
  'video/mp4': 'mp4',
  'video/ogg': 'ogg'
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(upload())
app.use('/', express.static('upload_temp'))

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  next()
})

app.post('/upload_video', (req, res) => {
  // req.body{
  //   name: '第七节课程视频.mp4',
  //   type: 'video/mp4',
  //   size: '192707785',
  //   fileName: '1716359152450_第七节课程视频.mp4',
  //   uploadedSize: '0'
  // }
  const { name, type, size, fileName, uploadedSize } = req.body
  const { file } = req.files
  if (!file) {
    res.send({
      code: 1001,
      msg: 'No file uploaded'
    })
    return
  }
  if (!ALLOWED_TYPE[type]) {
    res.send({
      code: 1002,
      msg: 'File type not allowed'
    })
    return
  }
  const filename = fileName + extname(name)
  const filePath = resolve(__dirname, './upload_temp/', filename)
  if (uploadedSize !== '0') {
    if (!existsSync(filePath)) {
      res.send({
        code: 1003,
        msg: 'File not found'
      })
      return
    }
    appendFileSync(filePath, file.data)
    res.send({
      code: 0,
      msg: 'Appended',
      video_url: 'http://localhost:8000/' + filename
    })
    return
  }
  writeFileSync(filePath, file.data)
  res.send({
    code: 0,
    msg: 'File is created'
  })
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
