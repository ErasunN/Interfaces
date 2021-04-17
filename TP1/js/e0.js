"use strict"
document.addEventListener("DOMContentLoaded", function() {

    document.querySelector("#drawSnowMan").addEventListener('click', () => {

        let canvas = document.querySelector("#desafio")

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 500; i++) {
            for (let j = 0; j < 500; j++) {
                ctx.strokeStyle = `rgb(
                    ${Math.floor(255 - 15 * i)},
                    ${Math.floor(255 - 8 * i)},
                    ${Math.floor(255 - 40 * j)})`;
                ctx.beginPath();
                ctx.arc(4.5 + j * 7.5, 4.5 + i * 7.5, 10, 0, Math.PI * 2, true);
                ctx.stroke();
            }
        }

        ctx.fillStyle = "lightblue";

        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(100, 200, 70, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.arc(85, 100, 7, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(115, 100, 7, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillRect(50, 50, 100, 10);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillRect(65, 10, 70, 40);
        ctx.closePath();

        ctx.beginPath();
        ctx.closePath();

        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.fillRect(65, 40, 70, 10);
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(100, 175, 7, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(100, 225, 7, 0, 180);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'brown';

        ctx.beginPath();
        ctx.moveTo(70, 150);
        ctx.lineTo(30, 210);
        ctx.lineTo(25, 205);
        ctx.lineTo(65, 145);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(130, 150);
        ctx.lineTo(170, 210);
        ctx.lineTo(175, 205);
        ctx.lineTo(135, 145);
        ctx.fill();

        /* ctx.fillStyle = 'brown';

        ctx.beginPath(); */



    })
    document.querySelector("#setImage").addEventListener('click', () => {
        let canvas = document.querySelector("#desafio");

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let img = new Image()
        img.src = "images/wom.jpg"

        img.onload = () => {
            myDrawImage(img)
        }

        const myDrawImage = (imgData) => {
            ctx.drawImage(imgData, 0, 0);

        }
    })
    document.querySelector("#setFiltro").addEventListener('click', (filtro) => {
        let canvas = document.querySelector("#imgFiltro")
        let width = 640;
        let height = 480;
        canvas.width = 640;
        canvas.height = 480;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(width, height);
        const setPixel = (imageData, x, y, r, g, b, a) => {
            let index = (x + y * imageData.height) * 4;
            imageData.data[index + 0] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a;
        }
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                setPixel(imageData, x, y, 255 - ((y / (canvas.height / 2)) * 255), y / (canvas.height / 2) * 255, 0, 255);
            }

        }
        ctx.putImageData(imageData, 0, 0);
    })
});