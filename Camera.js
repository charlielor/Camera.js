// Global Namespace
var Camera = Camera || function(minWidth, minHeight, video, canvas, image) {
        console.log('camera obj created!');

        console.log('camera obj setting up variables...');

        this.video = video;

        this.canvas = canvas;

        this.image = image;

        this.resolution = {
            video: {
                "mandatory": {
                    "minWidth": "minWidth",
                    "minHeight": "minHeight"
                }
            }
        };

        // Setting up the mediaStream so that when the user closes the video, the stream ends
        this.mediaStream = null;

        // Aspect ratio
        this.aspectRatio = null;

        // Video height for aspect ratio
        this.videoHeight = null;

        // Video width for aspect ratio
        this.videoWidth = null;

        // Video rotation
        this.videoRotation = 0;
    };

Camera.prototype.startCamera = function(callback) {
    // Set the navigator.getUserMedia to the appropriate browser
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    // Set the window.URL object to the appropriate browser
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            this.resolution,
            function successCallBack(stream) {
                this.mediaStream = stream;
                this.video.src = (window.URL && window.URL.createObjectURL(stream));
                this.video.play();
                callback();
            }, function errorCallback(error) {
                console.log("An error occured: " + error.code);
            }
        );
    }
};

Camera.prototype.stopCamera = function() {
    this.mediaStream.stop();
    this.mediaStream = null;
    this.video.pause();
};

Camera.prototype.takePicture = function() {
    // Get the video width and height
    var currentVideoWidth = this.video.videoWidth;
    var currentVideoHeight = this.video.videoHeight;

    // If the video width and height are 0, then display an alert saying that the video is not playing
    if (currentVideoWidth == 0 && currentVideoHeight == 0) {
        alert("Video is not playing");
    } else {
        // Set the video tag to the resolution
        $(this.video).attr("width", currentVideoWidth);
        $(this.video).attr("height", currentVideoHeight);

        // Set the canvas tag to the resolution
        $(this.canvas).attr("width", currentVideoWidth);
        $(this.canvas).attr("height", currentVideoHeight);

        // Get the frame from the video
        var ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0);

        var imageBaseSrc64 = this.canvas.toDataURL('image/png');

        this.image.src = imageBaseSrc64;

        //// Set the image tag to the canvas as a PNG
        //this.rotateImage(imageBaseSrc64, function(data) {
        //    // Set the image to the data returned from rotateImage
        //    this.image.src = data;
        //
        //    // When the image is loaded/set, close the camera dialog and open the image confirm dialog
        //    this.image.onload = function() {
        //        alert('image onload!');
        //    }
        //
        //});

    }
};

Camera.prototype.rotateLeft = function() {
    this.videoRotation = -90;
};

Camera.prototype.rotateRight = function() {
    this.videoRotation = 90;
};

Camera.prototype.rotateImage = function(baseSrc, callback) {
    // Create a temporary canvas
    var tmpCanvas = document.createElement('canvas');
    // Create a temporary image
    var tmpImage = new Image();
    // Set the temporary image's source to the submitted base64 code
    tmpImage.src = baseSrc;
    // Get the 2d context of the temporary canvas
    var tmpCtx = tmpCanvas.getContext('2d');
    // When the image is done loading (or setting up)
    tmpImage.onload = function() {
        // If the video rotation is 0, then it's normal
        // Else it's rotated left or right by 90 degrees
        if (this.videoRotation == 0) {
            // Set the temporary canvas width and height
            tmpCanvas.width = tmpImage.width;
            tmpCanvas.height = tmpImage.height;

        } else if ((this.videoRotation % 90) == 0) {
            // Set the temporary canvas width and height
            tmpCanvas.height = tmpImage.width;
            tmpCanvas.width = tmpImage.height;

            // If it's negative, it's rotated counterclockwise
            // Set the origin of the drawImage (0,0) to the correct corner
            if (this.videoRotation < 0) {
                // If it's negative (-90 degrees), then it'll be at the bottom left corner
                tmpCtx.translate(0, tmpCanvas.height);
            } else {
                // If it's positive (90 degrees), then it'll start at the top right corner
                tmpCtx.translate(tmpCanvas.width, 0);
            }
            // Rotate the 2d context base on the degree (90 or -90)
            tmpCtx.rotate(this.videoRotation * (Math.PI / 180));
        }

        // Draw the image onto the canvas
        tmpCtx.drawImage(tmpImage, 0, 0);

        // Run the callback to return the base64 source back to the image
        callback(tmpCanvas.toDataURL('image/png'));
    }
};

Camera.prototype.rotateImageElement = function() {
    // If video rotation is not 0, then rotate the image element on DOM to match rotated video
    if (this.videoRotation != 0) {
        switch (this.aspectRatio) {
            case '1.33':
                $(this.image).css('height', '1100');
                $(this.image).css('width', '825');
                break;
            case '1.6':
                break;
            case '1.78':
                $(this.image).css('height', '889');
                $(this.image).css('width', '500');
                break;
            case '1.9':
                break;
            default:
                $(this.image).css('height', '1100');
                $(this.image).css('width', '825');
        }
    } else {
        switch (this.aspectRatio) {
            case '1.33':
                $(this.image).css('height', '825');
                $(this.image).css('width', '1100');
                break;
            case '1.6':
                break;
            case '1.78':
                $(this.image).css('height', '500');
                $(this.image).css('width', '889');
                break;
            case '1.9':
                break;
            default:
                $(this.image).css('height', '825');
                $(this.image).css('width', '1100');
        }
    }
};

Camera.prototype.fixVideoPadding = function() {
    console.log(this.videoRotation);

    // If video rotation is not 0, then add some padding towards the top and bottom of the video element to show all of it in the dialog
    if (this.videoRotation != 0) {
        switch (this.aspectRatio) {
            case '1.33':
                $(this.video).css('padding-top', '85px');
                $(this.video).css('padding-bottom', '85px');
                break;
            case '1.6':
                break;
            case '1.78':
                $(this.video).css('padding-top', '200px');
                $(this.video).css('padding-bottom', '200px');
                break;
            case '1.9':
                break;
            default:
                $(this.video).css('padding-top', '85px');
                $(this.video).css('padding-bottom', '85px');
        }
    } else {
        $(this.video).css('padding-top', '0px');
        $(this.video).css('padding-bottom', '0px');
    }
};