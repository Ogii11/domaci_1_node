const express = require("express");
const upload = require("express-fileupload");
const port = process.env.PORT || 3000;
const path = require("path");
const libre = require('libreoffice-convert');
const fs = require("fs")

const app = express();

app.use(upload())
app.use(express.static("public"));

var downloadPath;

app.post("/upload", (req,res) => {
    if(req.files.ufile){
        const uploadPath = __dirname + "/uploads/" + req.files.ufile.name;
        req.files.ufile.mv(uploadPath, err => {
            if(err){
                console.log(err);
                res.send("Error")
            } else {
                console.log("done")
                downloadPath = `${__dirname}/converted/${req.files.ufile.name.substring(0,req.files.ufile.name.indexOf("."))}.pdf`;
                libre.convert(fs.readFileSync(uploadPath), '.pdf', undefined, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        fs.writeFileSync(`${__dirname}/converted/${req.files.ufile.name.substring(0,req.files.ufile.name.indexOf("."))}.pdf`, results)
                    }
                })
            }
        }) 
    }
})

app.get("/download", (req,res) => {
    res.download(downloadPath)
})

app.listen(port, () => {
    console.log("Runing on port " + port)
})