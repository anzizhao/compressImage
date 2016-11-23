
var express = require('express');  
var fs = require('fs');  
var path = require('path');  
var http = require('http');
var app = express();  

var multiparty = require('multiparty');


app.use(express.static(__dirname + '/test'));

server = http.createServer(app);

//note inputFile

app.post('/picture',  function(req, res){      
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './tmp'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        debugger;
        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var dstPath = './picture/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        res.header("Access-Control-Allow-Origin", "*");

        var address = server.address();
        var rand = Date.now();
        var data = {
            "error":true,
            "url":"http://" + address.address + ":" + address.port + "/images/test.jpg?"+rand,
        };
        res.send( data ); 

        //res.end();
    });  
});  
  
server.listen(6330, 'localhost',  function(){  
    console.log("Listening on port %d ",   server.address().port);  
});  





