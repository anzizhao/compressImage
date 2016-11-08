// 压缩图片
function Compressor(opt){
    opt = opt || {}
    this.scale = opt.scale || 0.8;
    this.support = this.isCanvasSupported(); 

}
// 接口
Compressor.prototype.parse = function(files, cb){
    //读取文件
    var error ;
    if( ! this.support ) {
        error = {
            err: this.errorCode.notSupportCanvas, 
            msg: 'not support compress'
        }
        return cb( error ); 
    }
    if( ! files || ! files.length ) {
        error = {
            err: this.errorCode.noFiles, 
            msg: 'no file'
        }
        return cb(error); 
    }
    if( this.scale === 1) {
        error = {
            err: this.errorCode.scaleEqualOne, 
            msg: 'scale = 1, no need to compress'
        }
        cb(error) 
    }
    this.cb = cb;
    this.readFile(files);
}

Compressor.prototype.readFile = function(files){
    //读取文件
    var i; 
    var len=files.length; 
    var count=len;
    var ret = [];
    var cThis = this;
    for (i = 0 ,j = files.length ; i<j ; i++){
        var fReader = new FileReader();
        fReader.onload = function (e){
            var result = fReader.result;
            var filename = fReader.filename;
            cThis.compress (result, function(out){
                out && ret.push({name: filename, data: out, blob:true });
                count --;
                if ( count <= 0 ){
                    cThis.cb && cThis.cb(null, ret) 
                } 
            })

        };
        fReader.filename = files[i].name;
        fReader.readAsDataURL(files[i]);
    };
}

Compressor.prototype.compress = function(image, cb) {
    if (!image){
        return cb(false)
    } 
    var cThis = this;
    var canvas = document.createElement('canvas')
    var img = new Image;
    img.onload = function(){
            canvas.width = this.width;
            canvas.height = this.height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            // TODO 动态获取图片类型
            var type = 'image/jpeg'
            var out = canvas.toDataURL(type, cThis.scale);
            var blob = cThis.dataURItoBlob(out);
            cb(blob)
            img = null;
            canvas = null;
    };
    img.src = image;
}
Compressor.prototype.errorCode = {
    notSupportCanvas : 100,
    noFiles: 101,
    scaleEqualOne: 102,
}

Compressor.prototype.isCanvasSupported = function(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
Compressor.prototype.dataURItoBlob =  function( dataURI ){
    // convert base64 to raw binary data held in a string 
    var byteString 
        ,mimestring 

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }

    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

    var content = new Array();
    for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }

    return new Blob([new Uint8Array(content)], {type: mimestring});
}

function postFile (url, files) {
    console.log( arguments.callee.name );
    //返回的 blob 对象可以 append 到 FormData对象上 用 ajax 上传  
    var db = new FormData();
    files.forEach(function(file){
        if( file.blob ) {
            db.append('inputFile', file.data, file.name );
        } else {
            db.append('inputFile', file );
        }
    })

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function(){
        if( this.status !== 200 ) {
            console.error('upload picture fail, status: ', this.status); 
        } 
        console.log('success to upload'); 
        //var j = JSON.parse(this.body);
        //console.dir(j);
    }
    xhr.send(db);
}

var g_uploadUrl = 'http://192.168.2.211:6330/picture';

var uploader = document.getElementById('uploader');
uploader.onchange = function(e) {
    if( this.files.length === 0) {
        return  
    }
    var mv = this;
    var compressor = new Compressor({scale: 0.6});
    compressor.parse(this.files, function(err, outFiles ){

        if( err )  {
            console.error( err.msg );
            switch(err.err) {
                case  compressor.errorCode.notSupportCanvas:
                case compressor.errorCode.scaleEqualOne: 
                    // 上传原来的图片 
                    postFile(g_uploadUrl, Array.prototype.slice.call( mv.files )) 
                    break
            }
            return 
        } 
        console.log('compress sucess');
        //上传 压缩图片
        postFile(g_uploadUrl, outFiles ) 
    });
}

var uploaderCompressEqualOne = document.getElementById('uploaderCompressEqualOne');
uploaderCompressEqualOne.onchange = function(e) {
    if( this.files.length === 0) {
        return  
    }
    var mv = this;
    var compressor = new Compressor({scale: 1 });
    compressor.parse(this.files, function(err, outFiles ){
        if( err )  {
            console.error( err.msg );
            // 上传原来的图片 
            err.err === 
                compressor.errorCode.notSupportCanvas 
            switch(err.err) {
                case  compressor.errorCode.notSupportCanvas:
                case compressor.errorCode.scaleEqualOne: 
                    postFile(g_uploadUrl, Array.prototype.slice.call( mv.files )) 
                    break
            }
            return 
        } 
        //上传 压缩图片
        postFile(g_uploadUrl, outFiles ) 
    });
}

var uploaderNoCompress  = document.getElementById('uploaderNoCompress');
uploaderNoCompress.onchange = function(e) {
    if( this.files.length === 0) {
        return  
    }
    postFile(g_uploadUrl, Array.prototype.slice.call( this.files )) 
}

















