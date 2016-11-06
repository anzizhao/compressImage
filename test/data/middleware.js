var mockData = require('./mockdata')()
var director = require('director');
var clone = require('./utils').clone 
var fs = require('fs');
var multiparty = require('multiparty');


var opResponse = {
    error: 0,
    msg: ''
}

var router = new director.http.Router();
router.post('/picture', { stream: true }, function(){
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './tmp'});
    //上传完成后处理
    form.parse(this.req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
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
        var resObj = {
            error: 0,
            msg: ""
        }

        this.res.send(resObj);
        //res.end();
    }.bind(this) );  
});


module.exports = function (req, res, next) {
    debugger;
    router.dispatch(req, res, function (err) {
        if (err) {
            return next()
        }
    });
}







