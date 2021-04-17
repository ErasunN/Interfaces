"use strict"
document.addEventListener("DOMContentLoaded", function() {
    let canvasPaint = document.querySelector("#myPaint")
    let ctx = canvasPaint.getContext("2d")
    let line = false;



    canvasPaint.addEventListener("mousedown", (e) => {
        line = true
        let mousePos = oMousePos(canvasPaint, e)
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        canvasPaint.addEventListener("mousemove", startDraw)
    })

    canvasPaint.addEventListener("mouseup", (e) => {
        line = false
    })

    function startDraw(e) {
        let mousePos = oMousePos(canvasPaint, e)

        if (line) {
            ctx.lineTo(mousePos.x, mousePos.y)
            ctx.stroke()
        }
    }

    document.querySelector("#setColor").addEventListener("change", (e) => {
        ctx.strokeStyle = e.target.value;
    })

    document.querySelector("#setAncho").addEventListener("change", (e) => {
        ctx.lineWidth = e.target.value;
    })

    document.querySelector("#vaciar").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);

    })

    function oMousePos(canvas, evt) {
        var ClientRect = canvas.getBoundingClientRect();
        return { //objeto
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }
})