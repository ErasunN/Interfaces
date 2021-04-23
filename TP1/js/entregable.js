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

        //recorro mi imagen
        for (let x = 0; x < imgData.width; x++) {
            for (let y = 0; y < imgData.height; y++) {
                //obtengo cada color por cada pixel
                let r = getRed(imgData, x, y);
                let g = getGreen(imgData, x, y);
                let b = getBlue(imgData, x, y);
                //transformo los valores rgb a hsl
                let hsl = rgbToHsl(r, g, b);
                hsl[1] = hsl[1] + 0.2;
                //vuelvo el hsl a rgb
                let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

                setPixel(imgData, x, y, rgb[0], rgb[1], rgb[2], 255);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function rgbToHsl(r, g, b) {
        //funcion rgb a hsl encontrada en inet
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    function hslToRgb(h, s, l) {
        //funcion hsl a rgb encontrada en inet
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    document.querySelector("#vaciar").addEventListener("click", () => {
        vaciarCanvas()
        inputImg.value = ""
    })

    function vaciarCanvas() {
        ctx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
    }


    canvasPaint.addEventListener("mousedown", (e) => {
        canvasPaint.addEventListener("contextmenu", (e) => {
            e.preventDefault()
        })
        console.log();
        if (e.which === 1) {
            leftClick(e)
        } else if (e.which === 3) {
            rightClick(e)
        }
    })

    let leftClick = (e) => {
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
        erasing = false

        line = false
    })

    canvasPaint.addEventListener("mouseup", (e) => {
        erasing = false

        line = false
    })

    function erase(e) {
        let mousePos = oMousePos(canvasPaint, e)
        ctx.moveTo(mousePos.x, mousePos.y);

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

    document.querySelector("#setSaturado").addEventListener("click", () => {
        saturacion()
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