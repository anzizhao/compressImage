/*common*/

var canvasSupported = isCanvasSupported()
function dataURItoBlob(dataURI) {
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

function imgScale (src , scale,cbk) {
    if (!src) return cbk(false)
    var _canvas = document.createElement('canvas')
    //var tImg = new Image()
    var tImg = document.getElementById('image');
    tImg.onload = function(){
        setTimeout(function(){
            _canvas.style.width = this.width;
            _canvas.style.height = this.height;
            var _context = _canvas.getContext('2d');
            _context.drawImage(tImg, 0, 0);
            //var type = 'image/jpeg'
            //var bsrc = _canvas.toDataURL(type )
            //console.log('bsrc: ', bsrc.length);
            //var blob = dataURItoBlob(bsrc)
            //cbk(blob)

            document.body.appendChild(_canvas);
        }.bind(this), 500);
        /*
        var r = _canvas.mozGetAsFile('f' , type)
        cbk(r)
        */
    };
    console.log("src: ", src.length);
    tImg.src = src;

}

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

//exports.support = canvasSupported 

/* opt {scale :0-1}*/
//exports.zip = function(files ,opt,cbk){
zip = function(files ,opt,cbk){
    opt = opt || {}
    var scale = opt.scale
    if (!canvasSupported) return cbk(files)
    if (!scale || 1 == scale ) return cbk(files)
    var files_count = files.length    
        ,ret = []
    
    for (var i = 0 ,j = files.length ; i<j ; i++){
        var fReader = new FileReader();
        fReader.onload = function (e){
            var result = fReader.result


            imgScale(result , scale ,function(file){
                file && ret.push(file)
                files_count--
                if (files_count <= 0 ) cbk && cbk(ret)

                })
        };
        fReader.readAsDataURL(files[i]);
    }
}




var uploader = document.getElementById('uploader');
uploader.onchange = function(e) {
    if( this.files.length === 0) {
        return  
    }
    //var file = this.files[0];
    var opt = {
        compress: 0.9, 
    };
    if (isCanvasSupported()){
        zip(this.files , {'scale':opt.compress} , function(files){
            console.log(files)
            //返回的 blob 对象可以 append 到 FormData对象上 用 ajax 上传  
            var db = new FormData();
            // 如果为数组
            if( files.forEach ) {
                files.forEach(function(file){
                    db.append('inputFile', file);
                })
            } else {
                // filelist alike array  
                var key ;
                for ( key in files ) {
                    db.append('inputFile', files[key] );
                } 
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST','http://localhost:6330/picture');
            xhr.onload = function(){
                if( this.status !== 200 ) {
                    console.error('upload picture fail, status: ', this.status); 
                } 
                console.log('success to upload'); 
                //var j = JSON.parse(this.body);
                //console.dir(j);
            }
            xhr.send(db);
        })    
    }

}




var uploader = document.getElementById('uploader');
uploader.onchange = function(e) {
    var file = this.files[0];
    var fReader = new FileReader();
    fReader.onload = function (e){
        console.log( this.readyState)
        var result = fReader.result

        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL

        // helper Image object
        //var image = new Image();
        //image.src = blobURL;

        var tImg = document.getElementById('image');
        var _canvas = document.getElementById('myCanvas');
        //var _canvas = document.createElement('canvas')
        tImg.onload = function(){
                _canvas.width = this.width;
                _canvas.height = this.height;

                _canvas.style.width = this.width;
                _canvas.style.height = this.height;
                var _context = _canvas.getContext('2d');
                _context.drawImage(tImg, 0, 0);
                //document.body.appendChild(_canvas);
        };
        //tImg.src = result;
        tImg.src = blobURL;
        //image.src = blobURL;
    };
    //fReader.readAsDataURL( file );
    fReader.readAsArrayBuffer(file);

}




