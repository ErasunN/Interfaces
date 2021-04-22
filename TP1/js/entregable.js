"use strict"
document.addEventListener("DOMContentLoaded", function() {
    let canvasPaint = document.querySelector("#myPaint")
    let ctx = canvasPaint.getContext("2d")
    let line = false;
    let erasing = false;
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

    function setBordes() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height);

        let matriz = [
            [-2, -2, -2],
            [-2, 8, -2],
            [-2, -2, -2]
        ];

        for (let x = 0; x < imgData.width; x++) {
            for (let y = 0; y < imgData.height; y++) {
                pixelMatriz(imgData, x, y, matriz);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function pixelMatriz(imgData, x, y, matriz) {
        let r = Math.floor(
            getRed(imgData, x - 1, y - 1) * matriz[0][0] +
            getRed(imgData, x, y - 1) * matriz[0][1] +
            getRed(imgData, x + 1, y - 1) * matriz[0][2] +
            getRed(imgData, x - 1, y) * matriz[1][0] +
            getRed(imgData, x, y) * matriz[1][1] +
            getRed(imgData, x + 1, y) * matriz[1][2] +
            getRed(imgData, x - 1, y + 1) * matriz[2][0] +
            getRed(imgData, x, y + 1) * matriz[2][1] +
            getRed(imgData, x + 1, y + 1) * matriz[2][2]);

        let g = Math.floor(
            getGreen(imgData, x - 1, y - 1) * matriz[0][0] +
            getGreen(imgData, x, y - 1) * matriz[0][1] +
            getGreen(imgData, x + 1, y - 1) * matriz[0][2] +
            getGreen(imgData, x - 1, y) * matriz[1][0] +
            getGreen(imgData, x, y) * matriz[1][1] +
            getGreen(imgData, x + 1, y) * matriz[1][2] +
            getGreen(imgData, x - 1, y + 1) * matriz[2][0] +
            getGreen(imgData, x, y + 1) * matriz[2][1] +
            getGreen(imgData, x + 1, y + 1) * matriz[2][2]);

        let b = Math.floor(
            getBlue(imgData, x - 1, y - 1) * matriz[0][0] +
            getBlue(imgData, x, y - 1) * matriz[0][1] +
            getBlue(imgData, x + 1, y - 1) * matriz[0][2] +
            getBlue(imgData, x - 1, y) * matriz[1][0] +
            getBlue(imgData, x, y) * matriz[1][1] +
            getBlue(imgData, x + 1, y) * matriz[1][2] +
            getBlue(imgData, x - 1, y + 1) * matriz[2][0] +
            getBlue(imgData, x, y + 1) * matriz[2][1] +
            getBlue(imgData, x + 1, y + 1) * matriz[2][2]);

        setPixel(imgData, x, y, r, g, b, 255);
    }

    function setBlur() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height);

        let matrizBlur = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ]
        for (let x = 0; x < canvasPaint.width; x++) {
            for (let y = 0; y < canvasPaint.height; y++) {
                //pixelMatriz(imgData, x, y, matrizBlur)
                promedioMatriz(imgData, x, y, matrizBlur)
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function saturacion() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height)

        for (let x = 0; x < imgData.width; x++) {
            for (let y = 0; y < imgData.height; y++) {
                let r = getRed(imgData, x, y);
                let g = getGreen(imgData, x, y);
                let b = getBlue(imgData, x, y);
                let hsl = RGBtoHSL(r, g, b);
                hsl[1] = hsl[1] + 0.2;
                let rgb = HSLtoRGB(hsl[0], hsl[1], hsl[2]);

                setPixel(imgData, x, y, rgb[0], rgb[1], rgb[2], opacidad);
            }
        }

        context.putImageData(imgData, 0, 0);
    }

    document.querySelector("#vaciar").addEventListener("click", () => {
        vaciarCanvas()
        inputImg.value = ""
    })

    function vaciarCanvas() {
        ctx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
    }


    canvasPaint.addEventListener("mousedown", (e) => {
            e.preventDefault()
            console.log();
            if (e.which === 1) {
                leftClick(e)
            } else if (e.which === 3) {
                rightClick(e)
            }
        })
        /* canvasPaint.addEventListener("mousedown", (e) => {
            console.log(e);
            erasing = false
            line = true
            let mousePos = oMousePos(canvasPaint, e)
            ctx.beginPath();
            ctx.moveTo(mousePos.x, mousePos.y);
            canvasPaint.addEventListener("mousemove", startDraw)
        }) */


    let leftClick = (e) => {
        erasing = false
        line = true
        let mousePos = oMousePos(canvasPaint, e)
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        canvasPaint.removeEventListener("mousemove", erase)
        canvasPaint.addEventListener("mousemove", startDraw)
    }

    let rightClick = (e) => {
        erasing = true
        canvasPaint.removeEventListener("mousemove", startDraw)
        canvasPaint.addEventListener("mousemove", erase)
    }
    canvasPaint.addEventListener("mouseleave", (e) => {
        line = false
    })

    canvasPaint.addEventListener("mouseup", (e) => {
        e.preventDefault
        line = false
    })

    function erase(e) {
        let mousePos = oMousePos(canvasPaint, e)

        if (erasing) {
            ctx.clearRect(mousePos.x, mousePos.y, ctx.lineWidth, ctx.lineWidth)
        }
    }

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

    document.querySelector("#setTamanio").addEventListener("change", (e) => {
        ctx.lineWidth = e.target.value;
    })

    canvasPaint.addEventListener("mousedown", (e) => {
        erasing = true;
        let mousePos = oMousePos(canvasPaint, e)
        canvasPaint.addEventListener("mousemove", () => {
            erase(mousePos)
        })
    })

    function oMousePos(canvas, evt) {
        let ClientRect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }

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

    document.querySelector("#setBlur").addEventListener("click", () => {
        setBlur()
    })
    document.querySelector("#setBordes").addEventListener("click", () => {
        setBordes()
        alert("Disclaimer: No se por que no funciona")
    })

    document.querySelector("#download").addEventListener("click", () => {
        let link = document.createElement('a');
        link.download = 'imagenEditada.png';
        link.href = canvasPaint.toDataURL()
        link.click();
    })

    function setPixelNegative(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        imageData.data[index + 0] = 255 - imageData.data[index + 0];
        imageData.data[index + 1] = 255 - imageData.data[index + 1];
        imageData.data[index + 2] = 255 - imageData.data[index + 2];
    }

    function setPixelBinarizado(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        let prom = setBinarizado(
            imageData.data[index + 0] + imageData.data[index + 1] + imageData.data[index + 2]
        )
        imageData.data[index + 0] = prom;
        imageData.data[index + 1] = prom;
        imageData.data[index + 2] = prom;
    }

    function setPixelGris(imageData, x, y) {
        let index = (x + y * imageData.height) * 4;
        let grises = Number(
            (
                imageData.data[index + 0] +
                imageData.data[index + 1] +
                imageData.data[index + 2]) / 3
        )
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

    function setPixelBlur(imageData, index, r, g, b) {
        imageData.data[index + 0] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
    }

    function setBinarizado(value) {
        if (value > (255 / 2)) {
            return 255
        } else {
            return 0
        }
    }

    function setPixel(imgData, x, y, r, g, b, a) {
        let index = (x + y * imgData.width) * 4;
        imgData.data[index] = r;
        imgData.data[index + 1] = g;
        imgData.data[index + 2] = b;
        imgData.data[index + 3] = a;
    }

    function getRed(imgData, x, y) {
        let index = (x + y * imgData.width) * 4;
        return imgData.data[index];
    }

    function getGreen(imgData, x, y) {
        let index = (x + y * imgData.width) * 4;
        return imgData.data[index + 1];
    }

    function getBlue(imgData, x, y) {
        let index = (x + y * imgData.width) * 4;
        return imgData.data[index + 2];
    }
})