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

    function setBordes() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height);

        let matrizBordes = [
            [-1, -1, -1],
            [-1, 8, -1],
            [-1, -1, -1]
        ]
        for (let x = 0; x < imgData.width; x++) {
            for (let y = 0; y < imgData.height; y++) {
                pixelMatriz(imgData, x, y, matrizBordes)
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function setBlur() {
        let imgData = ctx.getImageData(0, 0, image.width, image.height);

        let matrizBlur = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ]
        for (let x = 0; x < imgData.width; x++) {
            for (let y = 0; y < imgData.height; y++) {
                pixelMatriz(imgData, x, y, matrizBlur)
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    let pixelMatriz = (imgData, x, y, matriz) => {
        //Variables de ubicacion de pixel
        let ul = ((x - 1 + imgData.width) % imgData.width + imgData.width * ((y - 1 + imgData.height) % imgData.height)) * 4;
        let uc = ((x - 0 + imgData.width) % imgData.width + imgData.width * ((y - 1 + imgData.height) % imgData.height)) * 4;
        let ur = ((x + 1 + imgData.width) % imgData.width + imgData.width * ((y - 1 + imgData.height) % imgData.height)) * 4;
        let ml = ((x - 1 + imgData.width) % imgData.width + imgData.width * ((y + 0 + imgData.height) % imgData.height)) * 4;
        let mc = ((x - 0 + imgData.width) % imgData.width + imgData.width * ((y + 0 + imgData.height) % imgData.height)) * 4;
        let mr = ((x + 1 + imgData.width) % imgData.width + imgData.width * ((y + 0 + imgData.height) % imgData.height)) * 4;
        let ll = ((x - 1 + imgData.width) % imgData.width + imgData.width * ((y + 1 + imgData.height) % imgData.height)) * 4;
        let lc = ((x - 0 + imgData.width) % imgData.width + imgData.width * ((y + 1 + imgData.height) % imgData.height)) * 4;
        let lr = ((x + 1 + imgData.width) % imgData.width + imgData.width * ((y + 1 + imgData.height) % imgData.height)) * 4;

        let p0, p1, p2, p3, p4, p5, p6, p7, p8

        p0 = imgData.data[ul] * matriz[0][0];
        p1 = imgData.data[uc] * matriz[0][1];
        p2 = imgData.data[ur] * matriz[0][2];
        p3 = imgData.data[ml] * matriz[1][0];
        p4 = imgData.data[mc] * matriz[1][1];
        p5 = imgData.data[mr] * matriz[1][2];
        p6 = imgData.data[ll] * matriz[2][0];
        p7 = imgData.data[lc] * matriz[2][1];
        p8 = imgData.data[lr] * matriz[2][2];
        let red = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8);

        p0 = imgData.data[ul + 1] * matriz[0][0]
        p1 = imgData.data[uc + 1] * matriz[0][1];
        p2 = imgData.data[ur + 1] * matriz[0][2];
        p3 = imgData.data[ml + 1] * matriz[1][0];
        p4 = imgData.data[mc + 1] * matriz[1][1];
        p5 = imgData.data[mr + 1] * matriz[1][2];
        p6 = imgData.data[ll + 1] * matriz[2][0];
        p7 = imgData.data[lc + 1] * matriz[2][1];
        p8 = imgData.data[lr + 1] * matriz[2][2];
        let green = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8);

        p0 = imgData.data[ul + 2] * matriz[0][0];
        p1 = imgData.data[uc + 2] * matriz[0][1];
        p2 = imgData.data[ur + 2] * matriz[0][2];
        p3 = imgData.data[ml + 2] * matriz[1][0];
        p4 = imgData.data[mc + 2] * matriz[1][1];
        p5 = imgData.data[mr + 2] * matriz[1][2];
        p6 = imgData.data[ll + 2] * matriz[2][0];
        p7 = imgData.data[lc + 2] * matriz[2][1];
        p8 = imgData.data[lr + 2] * matriz[2][2];
        let blue = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8);

        imgData.data[mc] = red;
        imgData.data[mc + 1] = green;
        imgData.data[mc + 2] = blue;
        imgData.data[mc + 3] = imgData.data[lc + 3];
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
        let ClientRect = canvas.getBoundingClientRect();
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

    document.querySelector("#setBlur").addEventListener("click", () => {
        setBlur()
    })
    document.querySelector("#setBordes").addEventListener("click", () => {
        setBordes()
        alert("Disclaimer: No se por que no funciona")
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