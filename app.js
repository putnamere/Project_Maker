const express = require('express')
const fs = require('fs')
const { exec } = require('child_process') //lib to run cmds
const path = require('path') //path library to get the full path of a file
const cors = require('cors')
const SERVER = express()
const PORT = 1600

const htmlBottom = `    <script src="index.js"></script>
</head>
<body>
    
</body>
</html>`
const documentReady = "$(document).ready(() => {})"
const cssStuff = "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: Tahoma, sans-serif;\n}"

const createProject = async (name, p5, jquery) => {
    return new Promise((resolve, reject) => {
        //check if the folder already exsists
        if (!fs.existsSync(`../../Projects/${name}`)) {
            //create the directory
            fs.mkdir(`../../Projects/${name}`, (err) => {
                if (err) {
                    console.log(err)
                    resolve({ status: false, send: `Something Went Wrong!`})
                }
                //DONT QUESTION THE FORMATTING
                const htmlTop = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">\n`
                const p5Add = p5 ? '    <script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"></script>\n' : ''
                const jqAdd = jquery ? '    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>\n' : ''
                fs.writeFile(`../../Projects/${name}/index.html`, `${htmlTop}${jqAdd}${p5Add}${htmlBottom}`, () => {})
                fs.writeFile(`../../Projects/${name}/index.js`, `${jqAdd != '' ? documentReady : ''}`, () => {})
                fs.writeFile(`../../Projects/${name}/style.css`, `${cssStuff}`, () => {})
                exec(`code ${path.resolve(`../../Projects/${name}`)}`)
                console.log(`Created Project: ${name}!`)
                resolve({ status: true, send: `Project: ${name}, Sucsessfully Created` })
            })
        } else {
            resolve({ status: false, send: 'File Already Exsists!'})
        }
    })
}

SERVER.use(express.json())
SERVER.use(cors())

SERVER.post('/createProject', async (req, res) => {
    let name = req.body.name
    let p5 = req.body.p5
    let jq = req.body.jq
    let result = await createProject(name, p5, jq)
    res.status(result.status ? 201 : 400).send(result.send)
})

SERVER.listen(PORT)