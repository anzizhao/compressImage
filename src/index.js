
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
