export class ImageTools {
    base64ResizedImage: string = null;

    constructor() {
    }

    ResizeImage(base64image: string, width: number = 1080, height: number = 1080) {
        var img = new Image();
        img.src = base64image;

        img.onload = () => {

            // Check if the image require resize at all
            if(img.height <= height && img.width <= width) {
                this.base64ResizedImage = base64image;

                // TODO: Call method to do something with the resize image
            }
            else {
                // Make sure the width and height preserve the original aspect ratio and adjust if needed
                if(img.height > img.width) {
                    width = Math.floor(height * (img.width / img.height));
                }
                else {
                    height = Math.floor(width * (img.height / img.width));
                }

                var resizingCanvas: HTMLCanvasElement = document.createElement('canvas');
                var resizingCanvasContext = resizingCanvas.getContext("2d");

                // Start with original image size
                resizingCanvas.width = img.width;
                resizingCanvas.height = img.height;


                // Draw the original image on the (temp) resizing canvas
                resizingCanvasContext.drawImage(img, 0, 0, resizingCanvas.width, resizingCanvas.height);

                var curImageDimensions = {
                    width: Math.floor(img.width),
                    height: Math.floor(img.height)
                };

                var halfImageDimensions = {
                    width: null,
                    height: null
                };

                // Quickly reduce the dize by 50% each time in few itterations until the size is less then
                // 2x time the target size - the motivation for it, is to reduce the aliasing that would have been
                // created with direct reduction of very big image to small image
                while (curImageDimensions.width * 0.5 > width) {
                    // Reduce the resizing canvas by half and refresh the image
                    halfImageDimensions.width = Math.floor(curImageDimensions.width * 0.5);
                    halfImageDimensions.height = Math.floor(curImageDimensions.height * 0.5);

                    resizingCanvasContext.drawImage(resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height,
                        0, 0, halfImageDimensions.width, halfImageDimensions.height);

                    curImageDimensions.width = halfImageDimensions.width;
                    curImageDimensions.height = halfImageDimensions.height;
                }

                // Now do final resize for the resizingCanvas to meet the dimension requirments
                // directly to the output canvas, that will output the final image
                var outputCanvas: HTMLCanvasElement = document.createElement('canvas');
                var outputCanvasContext = outputCanvas.getContext("2d");

                outputCanvas.width = width;
                outputCanvas.height = height;

                outputCanvasContext.drawImage(resizingCanvas, 0, 0, curImageDimensions.width, curImageDimensions.height,
                    0, 0, width, height);

                // output the canvas pixels as an image. params: format, quality
                this.base64ResizedImage = outputCanvas.toDataURL('image/jpeg', 0.85);

                // TODO: Call method to do something with the resize image
            }
        };
    }
}
