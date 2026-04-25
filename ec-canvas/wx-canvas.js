export default class WxCanvas {
  constructor(ctx, canvasId, isNew, canvasNode) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.isNew = isNew;
    if (isNew) {
      this.canvasNode = canvasNode;
    }
  }

  setChart(chart) {
    this.chart = chart;
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  addEventListener() {}
  removeEventListener() {}

  exec(args) {
    if (!args) {
      return;
    }
    if (typeof args === 'string') {
      args = [args];
    }
    const func = args[0];
    if (this.isNew) {
      if (func === 'fillRect') {
        this.ctx.fillRect(args[1], args[2], args[3], args[4]);
      }
    }
    else {
      if (func === 'fillRect') {
        this.ctx.fillRect(args[1], args[2], args[3], args[4]);
      }
    }
  }

  measureText(text) {
    return this.ctx.measureText(text);
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }

  // canvasToTempFilePath(opt) {
  //   if (!opt.canvasId) {
  //     opt.canvasId = this.canvasId;
  //   }
  //   return wx.canvasToTempFilePath(opt, this);
  // }

  setTransform(a, b, c, d, e, f) {
    this.ctx.setTransform(a, b, c, d, e, f);
  }

  // context
  beginPath() {
    this.ctx.beginPath();
  }

  stroke() {
    this.ctx.stroke();
  }

  fill() {
    this.ctx.fill();
  }

  fillRect(x, y, w, h) {
    this.ctx.fillRect(x, y, w, h);
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  scale(x, y) {
    this.ctx.scale(x, y);
  }

  rotate(angle) {
    this.ctx.rotate(angle);
  }

  translate(x, y) {
    this.ctx.translate(x, y);
  }

  clip() {
    this.ctx.clip();
  }

  setFillStyle(fillStyle) {
    this.ctx.fillStyle = fillStyle;
  }

  setTextAlign(textAlign) {
    this.ctx.textAlign = textAlign;
  }

  setTextBaseline(textBaseline) {
    this.ctx.textBaseline = textBaseline;
  }

  setLineCap(lineCap) {
    this.ctx.lineCap = lineCap;
  }

  setLineJoin(lineJoin) {
    this.ctx.lineJoin = lineJoin;
  }

  setLineWidth(lineWidth) {
    this.ctx.lineWidth = lineWidth;
  }

  setMiterLimit(miterLimit) {
    this.ctx.miterLimit = miterLimit;
  }

  setStrokeStyle(strokeStyle) {
    this.ctx.strokeStyle = strokeStyle;
  }

  setShadow(offsetX, offsetY, blur, color) {
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = color;
  }

  setGlobalAlpha(alpha) {
    this.ctx.globalAlpha = alpha;
  }

  setLineDash(pattern, offset) {
    this.ctx.setLineDash(pattern);
    this.ctx.lineDashOffset = offset;
  }

  // Path
  arc(x, y, r, sAngle, eAngle, counterclockwise) {
    this.ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
  }

  arcTo(x1, y1, x2, y2, radius) {
    this.ctx.arcTo(x1, y1, x2, y2, radius);
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  closePath() {
    this.ctx.closePath();
  }

  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
  }

  lineTo(x, y) {
    this.ctx.lineTo(x, y);
  }

  moveTo(x, y) {
    this.ctx.moveTo(x, y);
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this.ctx.quadraticCurveTo(cpx, cpy, x, y);
  }

  rect(x, y, width, height) {
    this.ctx.rect(x, y, width, height);
  }

  // Text
  fillText(text, x, y, maxWidth) {
    this.ctx.fillText(text, x, y, maxWidth);
  }

  strokeText(text, x, y, maxWidth) {
    this.ctx.strokeText(text, x, y, maxWidth);
  }

  // Image
  drawImage(imageResource, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight) {
    if (arguments.length === 3) {
      this.ctx.drawImage(imageResource, dx, dy);
    } else if (arguments.length === 5) {
      this.ctx.drawImage(imageResource, dx, dy, dWidth, dHeight);
    } else if (arguments.length === 9) {
      this.ctx.drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  }

  // Gradient
  createLinearGradient(x0, y0, x1, y1) {
    return this.ctx.createLinearGradient(x0, y0, x1, y1);
  }

  createPattern(image, repetition) {
    return this.ctx.createPattern(image, repetition);
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  // Compositing
  setGlobalCompositeOperation(type) {
    this.ctx.globalCompositeOperation = type;
  }
}
