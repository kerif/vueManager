const execSync = require('child_process').execSync

const fs = require('fs')
const path = require('path')
let inputPath = process.argv[2]
if (!inputPath) {
  throw '请输入文件名！'
}
inputPath = path.resolve(inputPath)
try {
  fs.accessSync(inputPath)
  testReadFiles(inputPath)
} catch (err) {
  console.log(err)
}

function testReadFiles(filePath) {
  let state = fs.statSync(filePath)
  if (state.isFile()) {
    execSync(`yarn eslint ${filePath} --fix`)
    console.log(filePath, 'isFile')
  } else if (state.isDirectory()) {
    let files = fs.readdirSync(filePath)
    files.forEach(file => {
      console.log(path.join(filePath, file) + '，file')
      testReadFiles(path.join(filePath, file))
    })
  }
}
