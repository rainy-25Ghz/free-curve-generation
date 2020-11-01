//储存组合数C(i,n)
lut = [
    [1],           // n=0
    [1, 1],          // n=1
    [1, 2, 1],         // n=2
    [1, 3, 3, 1],        // n=3
    [1, 4, 6, 4, 1],       // n=4
    [1, 5, 10, 10, 5, 1],    // n=5
    [1, 6, 15, 20, 15, 6, 1]]  // n=6

/**

* @desc Third-order Bessel
* @param {number} t current percentage
* @param {Array} p1 starting point coordinates
* @param {Array} p2 End point coordinates
* @param {Array} cp1 control point 1
* @param {Array} cp2 control point 2
*/

//计算n阶贝塞尔曲线在t为特定值时的坐标
//n<=6 阶数
function Bezier(n, t, points) {
    if (t === 0) return points[0];
    if (t === 1) return points[points.length - 1];
    const mt = 1 - t;
    const factor = lut[n];//二项式系数
    let x_ = 0;
    let y_ = 0;
    for (i = 0; i <= n; i++) {
        const [x, y] = points[i];
        x_ += factor[i] * Math.pow(mt, n - i) * Math.pow(t, i) * x;
        y_ += factor[i] * Math.pow(mt, n - i) * Math.pow(t, i) * y;
    }
    return [x_, y_];
}
//贝塞尔坐标计算
function drawCurve() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    const step = 0.001;
    const points = [[90, 200], [25, 100], [220, 40], [210, 240]];

    for (const pt of points) {
        const [x, y] = pt;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2, true);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const pt of points) {
        const [x, y] = pt;

        ctx.arc(x, y, 1, 0, Math.PI * 2, true);
        ctx.lineTo(x, y)
    }
    ctx.stroke();
    ctx.beginPath();
    for (let t = 0; t <= 1; t += step) {
        const [x, y] = Bezier(3, t, points);
        console.log([x, y]);
        if (t === 0)
            ctx.moveTo(...points[0]);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}
drawCurve();
