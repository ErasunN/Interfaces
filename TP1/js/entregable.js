"use strict"
document.addEventListener("DOMContentLoaded", function() {
    let canvasPaint = document.querySelector("#myPaint")
    let ctx = canvasPaint.getContext("2d")
    let line = false;
    let erasing = false;
    let canDraw = true;
    let image = null

    let inputImg = document.querySelector("#inputFile")
    inputImg.addEventListener("change", () => {
        vaciarCanvas()
        let reader = new FileReader();

        reader.onload = () => {
            image = new Image();
            image.src = reader.result;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, image.width, image.height);
            }
        }
        reader.readAsDataURL(inputImg.files[0]);

    });

    /* function setBlur() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height);
        let pixel = imgData.data
        console.log(imgData.data);
        let myBlurArray = [1, 1, 1, 1]
        let sum = 0
        let tmpArray = []

        for (let i = 0; i < pixel.length; i++) {
            sum = 0
            if (i / 4 != 1) {
                if (pixel[i - 1] == null) {
                    tmpArray.push(pixel[i + 2] * myBlurArray[0])
                } else {
                    tmpArray.push(pixel[i - 1] * myBlurArray[0])
                }
                if (pixel[i] != null) {
                    tmpArray.push(pixel[i] * myBlurArray[1])
                }
                if (pixel[i + 1] != null) {
                    tmpArray.push(pixel[i + 1] * myBlurArray[2])
                }
            }

            for (let s = 0; s < tmpArray.length; s++) {
                sum += tmpArray[s]
            }
            pixel[i] = Math.floor(sum / tmpArray.length)
        }
        console.log(
            pixel
        );

        ctx.putImageData(imgData, 0, 0);
    } */

    document.querySelector("#vaciar").addEventListener("click", () => {
        vaciarCanvas()
        inputImg.value = ""
    })

    function vaciarCanvas() {
        ctx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
    }

    if (canDraw) {
        canvasPaint.addEventListener("mousedown", (e) => {
            line = true
            let mousePos = oMousePos(canvasPaint, e)
            ctx.beginPath();
            ctx.moveTo(mousePos.x, mousePos.y);
            canvasPaint.addEventListener("mousemove", startDraw)
        })

        canvasPaint.addEventListener("mouseleave", (e) => {
            line = false
        })

        canvasPaint.addEventListener("mouseup", (e) => {
            line = false
        })

        function startDraw(e) {
            console.log(line);

            let mousePos = oMousePos(canvasPaint, e)

            if (line) {
                ctx.lineTo(mousePos.x, mousePos.y)
                ctx.stroke()
            }
        }

        document.querySelector("#setColor").addEventListener("change", (e) => {
            ctx.strokeStyle = e.target.value;
        })
    } else {
        canvasPaint.addEventListener("mousedown", (e) => {
            erasing = true;
            let mousePos = oMousePos(canvasPaint, e)
            canvasPaint.addEventListener("mousemove", () => {
                erase(mousePos)
            })
        })

        function erase(e) {
            console.log(erasing);

            if (erasing) {
                ctx.clearRect(e.x, e.y, 10, 10)
            }
        }

        canvasPaint.addEventListener("mouseleave", (e) => {
            erasing = false
        })

        canvasPaint.addEventListener("mouseup", (e) => {
            erasing = false
        })
    }

    function oMousePos(canvas, evt) {
        var ClientRect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }

    document.querySelector("#eraser").addEventListener("click", () => {
        canDraw = !canDraw
        console.log(line, erasing, canDraw);

        if (!canDraw) {
            document.querySelector("#eraser").innerHTML = "Lapiz"
        } else {
            document.querySelector("#eraser").innerHTML = "Goma"
        }
    })

    document.querySelector("#setNegativo").addEventListener("click", () => {
        let imageData = ctx.getImageData(0, 0, image.width, image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                setPixelNegative(imageData, x, y)
            }
        }
        ctx.putImageData(imageData, 0, 0);

    })

    document.querySelector("#setEscalaGris").addEventListener("click", () => {
        let imageData = ctx.getImageData(0, 0, image.width, image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                setPixelGris(imageData, x, y)
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    document.querySelector("#setBinarizado").addEventListener("click", () => {
        let imageData = ctx.getImageData(0, 0, image.width, image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                setPixelBinarizado(imageData, x, y)
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    document.querySelector("#setBrillo").addEventListener("click", () => {
        let imageData = ctx.getImageData(0, 0, image.width, image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                setPixelBrillo(imageData, x, y)
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    document.querySelector("#setSepia").addEventListener("click", () => {
        let imageData = ctx.getImageData(0, 0, image.width, image.height)
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                setPixelSepia(imageData, x, y)
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    function setPixelNegative(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        imageData.data[index + 0] = 255 - imageData.data[index + 0];
        imageData.data[index + 1] = 255 - imageData.data[index + 1];
        imageData.data[index + 2] = 255 - imageData.data[index + 2];
    }

    function setPixelBinarizado(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        imageData.data[index + 0] = setBinarizado(imageData.data[index + 0]);
        imageData.data[index + 1] = setBinarizado(imageData.data[index + 1]);
        imageData.data[index + 2] = setBinarizado(imageData.data[index + 2]);
    }

    function setPixelGris(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        let grises = Number(
            (imageData.data[index + 0] +
                imageData.data[index + 1] +
                imageData.data[index + 2]) /
            3)
        imageData.data[index + 0] = grises
        imageData.data[index + 1] = grises
        imageData.data[index + 2] = grises
    }

    function setPixelBrillo(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        imageData.data[index + 0] = imageData.data[index + 0] + 30;
        imageData.data[index + 1] = imageData.data[index + 1] + 30;
        imageData.data[index + 2] = imageData.data[index + 2] + 30;
    }

    function setPixelSepia(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        let grises = Number(
            (imageData.data[index + 0] +
                imageData.data[index + 1] +
                imageData.data[index + 2]) /
            3)
        imageData.data[index + 0] = grises + 50
        imageData.data[index + 1] = grises + 25
        imageData.data[index + 2] = grises
    }

    function setBinarizado(value) {
        if (value > (255 / 2)) {
            return 255
        } else {
            return 0
        }
    }
})