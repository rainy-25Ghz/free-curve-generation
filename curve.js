let canvas_bz = document.getElementById("bezier");
let ctx_bz = canvas_bz.getContext("2d");
let rect ;
function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
   rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext("2d");
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}
setupCanvas(canvas_bz);
//绘制控制点
const drawPt_bz = (pts, color) => {
    ctx_bz.beginPath();
    ctx_bz.strokeStyle = color;
    for (const pt of pts) {
        const [x, y] = pt;
        ctx_bz.moveTo(x + 4, y);
        ctx_bz.arc(x, y, 4, 0, Math.PI * 2, true);
        ctx_bz.stroke();
        ctx_bz.font = "10px";
        ctx_bz.fillText(`${x},${y}`, x + 5, y);
    }
};
const drawLines_bz = (pts, color) => {
    ctx_bz.beginPath();
    ctx_bz.strokeStyle = color;
    for (const pt of pts) {
        const [x, y] = pt;
        ctx_bz.lineTo(x, y);
    }
    ctx_bz.stroke();
};
const drawControlPts_bz = (pts, color1 = "#52b3ef", color2 = "#52b3ef") => {
    drawPt_bz(pts, color1);
    drawLines_bz(pts, color2);
};
let points_bz = [
    [90, 200],
    [25, 100],
    [220, 40],
    [110, 240],
    [150, 280],
];

//求解贝塞尔曲线
//递归求解
//n个控制点，构成n-1条边
//每两个点取一阶贝塞尔
//P12=(1-t)P1+tP2
//得到新的n-1个点
//迭代直到只有一个点
//该点就是t值对应的贝塞尔曲线上的点
const bezier = (points, t) => {
    if (points.length <= 1) return points[0];
    let len = points.length;
    let new_pts = Array(len - 1);
    for (let i = 0; i < new_pts.length; i++) {
        const x = points[i][0] * (1 - t) + points[i + 1][0] * t;
        const y = points[i][1] * (1 - t) + points[i + 1][1] * t;
        new_pts[i] = [x, y];
    }
    return bezier(new_pts, t);
};
// 绘制贝塞尔函数
const drawBezier = (controlPts) => {
    let t_arr = Array(101).fill(0);
    t_arr = t_arr.map((value, index) => index * 0.01);
    //console.log(t_arr);
    bezierPts = t_arr.map((t) => bezier(controlPts, t));
    drawLines_bz(bezierPts, "#000010");
};
drawControlPts_bz(points_bz);
drawBezier(points_bz);
let ctrlPtsList = document.getElementById("PtsList");
const showCtrPts_bz = (pts) => {
    while (ctrlPtsList.firstChild) {
        ctrlPtsList.removeChild(ctrlPtsList.firstChild);
    }
    let ol = document.createElement("ol");
    pts.forEach((pt) => {
        let li = document.createElement("li");
        li.textContent = `(${pt[0]},${pt[1]})`;
        ol.appendChild(li);
    });
    let h3 = document.createElement("h3");
    h3.textContent = "控制点坐标";
    ctrlPtsList.appendChild(h3);
    ctrlPtsList.appendChild(ol);
};
showCtrPts_bz(points_bz);
let increaseBt = document.getElementById("increase_bz");
const onIncrease = () => {
    let x = Math.floor(Math.random() * 450 + 1);
    let y = Math.floor(Math.random() * 280 + 1);
    points_bz.push([x, y]);
    ctx_bz.clearRect(0, 0,rect.width,rect.height );
    drawControlPts_bz(points_bz);
    drawBezier(points_bz);
    let ol = document.querySelector("ol");
    let li = document.createElement("li");
    li.textContent = `(${x},${y})`;
    ol.appendChild(li);
};
increaseBt.onclick = onIncrease;
let decreaseBt = document.getElementById("decrease_bz");
const onDecrease = () => {
    points_bz.pop();
    ctx_bz.clearRect(0, 0,rect.width,rect.height);
    drawControlPts_bz(points_bz);
    drawBezier(points_bz);
    let ol = document.querySelector("ol");
    let li_arr = ol.childNodes;
    ol.removeChild(li_arr[li_arr.length - 1]);
};
decreaseBt.onclick = onDecrease;
function renderList() {}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top),
    };
}
let index = -1;

function onMouseMove(evt) {
    var pos = getMousePos(this, evt);
    points_bz[index] = [pos.x, pos.y];
    ctx_bz.clearRect(0, 0, rect.width,rect.height);
    drawControlPts_bz(points_bz);
    drawBezier(points_bz);
    showCtrPts_bz(points_bz);
}
canvas_bz.addEventListener("mousedown", function (evt) {
    var pos = getMousePos(this, evt);
    for (let i = 0; i < points_bz.length; i++) {
        if (
            Math.abs(pos.x - points_bz[i][0]) < 5 &&
            Math.abs(pos.y - points_bz[i][1]) < 5
        ) {
            points_bz[i] = [pos.x, pos.y];
            index = i;
            this.addEventListener("mousemove", onMouseMove);
            this.addEventListener("mouseup", function (evt) {
                this.removeEventListener("mousemove", onMouseMove);
            });
        }
    }
});

// //b样条部分
// const points = [[111, 256], [25, 100], [220, 40], [422, 100], [416, 256]];//测试用
// let canvas = document.getElementById('bspline');
// let ctx = canvas.getContext('2d');
// //绘制控制点
// const drawPt = (pts, color) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     for (const pt of pts) {
//         const [x, y] = pt;
//         ctx.moveTo(x + 4, y);
//         ctx.arc(x, y, 4, 0, Math.PI * 2, true);
//         ctx.stroke();
//         ctx.font = "10px";
//         ctx.fillText(`${x},${y}`, x + 5, y);
//     }
// }
// const drawLines = (pts, color) => {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     for (const pt of pts) {
//         const [x, y] = pt;
//         ctx.lineTo(x, y);
//     }
//     ctx.stroke();
// }
// const drawControlPts = (pts, color1 = "#52b3ef", color2 = "#52b3ef") => {
//     drawPt(pts, color1);
//     drawLines(pts, color2);
// }
// const knots = [0, 1 / 8, 2 / 8, 3 / 8, 4 / 8, 5 / 8, 6 / 8, 7 / 8, 1];
// const p = 3;
// //@控制点的数组
// //@节点数组
// //1.均匀b样条
// //2.准均匀b样条
// //第i个p次(p+1阶)B样条基函数
// function baseN(i, p, u, knots) {
//     //递归边界条件
//     if (p === 0) {
//         if (u >= knots[i] && u < knots[i + 1])
//             return 1;
//         else return 0;
//     }

//     let a = (u - knots[i]);
//     let b = (knots[i + p] - knots[i]);
//     let c = (knots[i + p + 1] - u);
//     let d = (knots[i + p + 1] - knots[i + 1]);
//     let a_b, c_d;
//     if (b === 0)
//         a_b = 0;
//     else
//         a_b = a / b;
//     if (d === 0)
//         c_d = 0;
//     else
//         c_d = c / d;
//     return a_b * baseN(i, p - 1, u, knots)
//         + c_d * baseN(i + 1, p - 1, u, knots);
// }
// let u_arr = Array(1001).fill(3 / 8);
// u_arr = u_arr.map((value, index) => 3 / 8 + index * 0.001 * 2 / 8);
// function Bspline(controlPts, u) {
//     let x_ = 0;
//     let y_ = 0;
//     for (let i = 0; i < controlPts.length; i++) {
//         [x, y] = controlPts[i];
//         x_ += baseN(i, p, u, knots) * x;
//         y_ += baseN(i, p, u, knots) * y;
//     }
//     return [x_, y_];
// }
// const mymap = (value) => {
//     let tmp = Bspline(points, value);
//     if (value == 3 / 8) {
//         drawLines([tmp, points[0]], "red");
//         // drawLines([tmp, points[1]], "red");

//         ctx.font = "10px";
//         ctx.fillText(`3/8`, tmp[0] + 5, tmp[1]);
//     }
//     if (value == 4 / 8) {
//         drawLines([tmp, points[4]], "purple");
//         drawLines([tmp, points[0]], "red");
//         ctx.font = "10px";
//         ctx.fillText(`4/8`, tmp[0] + 5, tmp[1]);
//     }
//     if (value == 5 / 8) {
//         //drawLines([tmp, points[1]], "red");
//         drawLines([tmp, points[4]], "purple");
//         ctx.font = "10px";
//         ctx.fillText(`5/8`, tmp[0] + 5, tmp[1]);
//     }
//     return tmp;
// };
// //Bspline(points, 1);
// let ans = u_arr.map(mymap);
// let ctrlPtsList_ = document.getElementById("PtsList_2");
// const showCtrPts_bs = (pts) => {
//     while (ctrlPtsList_.firstChild) { ctrlPtsList_.removeChild(ctrlPtsList_.firstChild) };
//     let ol = document.createElement("ol");
//     pts.forEach(pt => {
//         let li = document.createElement("li");
//         li.textContent = `(${pt[0]},${pt[1]})`;
//         ol.appendChild(li);
//     });
//     let h3 = document.createElement("h3");
//     h3.textContent = "控制点坐标";
//     ctrlPtsList_.appendChild(h3);
//     ctrlPtsList_.appendChild(ol);
// }
// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: Math.round(evt.clientX - rect.left),
//         y: Math.round(evt.clientY - rect.top)
//     };
// }
// let index2 = -1;

// function onMouseMove2(evt) {
//     var pos = getMousePos(this, evt);
//     points[index2] = [pos.x, pos.y];
//     ctx.clearRect(0, 0, 500, 300);
//     drawControlPts(points);
//     drawLines(u_arr.map(mymap), "#000000");
//     showCtrPts_bs(points);
// }
// canvas.addEventListener('mousedown', function (evt) {
//     var pos = getMousePos(this, evt);
//     for (let i = 0; i < points.length; i++) {
//         if (Math.abs(pos.x - points[i][0]) < 5 && Math.abs(pos.y - points[i][1]) < 5) {
//             points[i] = [pos.x, pos.y];
//             index2 = i;
//             this.addEventListener("mousemove", onMouseMove2);
//             this.addEventListener("mouseup", function (evt) {
//                 this.removeEventListener("mousemove", onMouseMove2);
//             });
//         }
//     }
// })
// showCtrPts_bs(points);
// drawLines(ans, "#000000");
// drawControlPts(points);
