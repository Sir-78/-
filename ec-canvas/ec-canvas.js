// ec-canvas.js
import * as echarts from './echarts';
import WxCanvas from './wx-canvas';
const { compareVersion } = require('./version-compare');

Component({
  properties: {
    ec: {
      type: Object
    },
    canvasId: {
      type: String,
      value: ''
    },
    forceUseOldCanvas: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isUseNewCanvas: false
  },
  detached: function () {
    if (this.chart) {
      try { this.chart.dispose() } catch (e) {}
      this.chart = null
    }
    this.canvasNode = null
  },
  ready: function () {
    // 在组件实例进入页面节点树时执行
    if (!this.data.ec) {
      console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
      return;
    }

    if (!this.data.ec.lazyLoad) {
      this.init();
    }
  },
  methods: {
    dispose() {
      if (this.chart) {
        try { this.chart.dispose() } catch (e) {}
        this.chart = null
      }
    },
    init: function (callback) {
      const baseInfo = wx.getAppBaseInfo ? wx.getAppBaseInfo() : wx.getSystemInfoSync();
      const version = baseInfo.SDKVersion || '';
      const canUseNewCanvas = compareVersion(version, '2.9.0') >= 0;
      const forceUseOldCanvas = this.data.forceUseOldCanvas;
      const isUseNewCanvas = canUseNewCanvas && !forceUseOldCanvas;
      this.setData({ isUseNewCanvas });

      if (forceUseOldCanvas && canUseNewCanvas) {}

      if (isUseNewCanvas) {
        // console.log('微信基础库版本大于2.9.0，使用新canvas实现');
        // 2.9.0 可以使用 wx.createOffscreenCanvas
        this.initByNewWay(callback);
      } else {
        const isValid = compareVersion(version, '1.9.91') >= 0;
        if (!isValid) {
          console.error('微信基础库版本过低，需大于等于 1.9.91。');
          return;
        }
        
        this.initByOldWay(callback);
      }
    },

    initByOldWay(callback) {
      // 1.9.91 <= version < 2.9.0：原来的方式初始化
      const cid = (this.data.ec && this.data.ec.canvasId) ? this.data.ec.canvasId : (this.data.canvasId || 'ec-canvas');
      const ctx = wx.createCanvasContext(cid, this);
      const canvas = new WxCanvas(ctx, cid, false, this);

      echarts.setCanvasCreator(() => {
        return canvas;
      });
      // const canvasDpr = wx.getSystemInfoSync().pixelRatio // 微信旧的canvas不能传入dpr
      const canvasDpr = 1;
      var query = wx.createSelectorQuery().in(this);
      query.select('.ec-canvas').boundingClientRect(res => {
        if (typeof callback === 'function') {
          this.chart = callback(canvas, res.width, res.height, canvasDpr);
        }
        else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
          this.chart = this.data.ec.onInit(canvas, res.width, res.height, canvasDpr);
        }
        else {
          this.triggerEvent('init', {
            canvas: canvas,
            width: res.width,
            height: res.height,
            canvasDpr: canvasDpr // 增加了dpr，可方便外面echarts.init
          });
        }
      }).exec();
    },

    initByNewWay(callback) {
      // version >= 2.9.0：使用新的方式初始化
      const query = wx.createSelectorQuery().in(this);
      query
        .select('.ec-canvas')
        .fields({ node: true, size: true })
        .exec(res => {
          const canvasNode = res[0].node;
          this.canvasNode = canvasNode;

          const winInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
          const canvasDpr = winInfo.pixelRatio || 1;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;

          const ctx = canvasNode.getContext('2d');

          const cid = (this.data.ec && this.data.ec.canvasId) ? this.data.ec.canvasId : (this.data.canvasId || 'ec-canvas');
          const canvas = new WxCanvas(ctx, cid, true, canvasNode);
          echarts.setCanvasCreator(() => {
            return canvas;
          });

          if (typeof callback === 'function') {
            this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
          }
          else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
            this.chart = this.data.ec.onInit(canvas, canvasWidth, canvasHeight, canvasDpr);
          }
          else {
            this.triggerEvent('init', {
              canvas: canvas,
              width: canvasWidth,
              height: canvasHeight,
              dpr: canvasDpr
            });
          }
        });
    },
    canvasToTempFilePath(opt) {
      if (this.data.isUseNewCanvas) {
        // 新版
        const query = wx.createSelectorQuery().in(this);
        query
          .select('.ec-canvas')
          .fields({ node: true, size: true })
          .exec(res => {
            const canvasNode = res[0].node;
            opt.canvas = canvasNode;
            wx.canvasToTempFilePath(opt);
          });
      }
      else {
        // 旧的
        if (!opt.canvasId) {
          opt.canvasId = this.data.ec.canvasId;
        }
        ctx.draw(true, () => {
          wx.canvasToTempFilePath(opt, this);
        });
      }
    },

    touchStart(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        var handler = this.chart.getZr().handler;
        handler.dispatch('mousedown', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.processGesture(wrapTouch(e), 'start');
      }
    },
    touchMove(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        var handler = this.chart.getZr().handler;
        handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.processGesture(wrapTouch(e), 'change');
      }
    },
    touchEnd(e) {
      if (this.chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        var handler = this.chart.getZr().handler;
        handler.dispatch('mouseup', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.dispatch('click', {
          zrX: touch.x,
          zrY: touch.y
        });
        handler.processGesture(wrapTouch(e), 'end');
      }
    }
  }
});

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}
