Page({
  data: {
    selectedCategory: null,
    mapMarkers: [],
    mapCenter: { latitude: 0, longitude: 0 },
    mapScale: 7,
    categories: [],
    selectedMapCategory: 'all',
    markerRouteMap: {},
    routeCategories: [
      {
        id: 'desert',
        category: '沙漠徒步',
        count: 4,
        coreAttractions: ['沙坡头', '腾格里沙漠'],
        featuredActivities: ['骑骆驼', '滑沙', '星空露营'],
        routes: [
          {
            id: 'desert_1',
            name: '沙坡头星空徒步',
            city: '中卫（吴忠）',
            coreAttractions: '沙坡头',
            activities: '沙漠徒步、滑沙、星空露营',
            duration: '2天1夜',
            features: '夜间观星+沙漠生存技能体验'
          },
          {
            id: 'desert_2',
            name: '腾格里穿越挑战',
            city: '吴忠',
            coreAttractions: '腾格里沙漠',
            activities: '30公里沙漠穿越、骆驼骑行',
            duration: '3天2夜',
            features: '专业级探险，团队协作训练'
          },
          {
            id: 'desert_3',
            name: '青铜峡沙湖轻徒步',
            city: '青铜峡',
            coreAttractions: '青铜峡沙湖',
            activities: '5公里休闲徒步、沙湖摄影',
            duration: '1日游',
            features: '亲子友好，自然风光与生态教育结合'
          },
          {
            id: 'desert_4',
            name: '沙漠绿洲探秘',
            city: '石嘴山',
            coreAttractions: '石嘴山戈壁绿洲',
            activities: '绿洲寻踪、植物科考、沙漠瑜伽',
            duration: '1日游',
            features: '生态保护主题，轻量化体验'
          }
        ]
      },
      {
        id: 'mountain',
        category: '山地骑行',
        count: 3,
        coreAttractions: ['贺兰山', '六盘山', '火石寨'],
        featuredActivities: ['骑行穿越', '古迹探访', '自然摄影'],
        routes: [
          {
            id: 'mountain_1',
            name: '贺兰山古道骑行',
            city: '银川',
            coreAttractions: '贺兰山岩画',
            activities: '20公里骑行、岩画文化讲解',
            duration: '1日游',
            features: '历史与自然融合，中低难度'
          },
          {
            id: 'mountain_2',
            name: '六盘山森林穿越',
            city: '固原',
            coreAttractions: '六盘山国家森林公园',
            activities: '山地骑行、森林氧吧体验',
            duration: '2天1夜',
            features: '天然氧吧，适合避暑养生'
          },
          {
            id: 'mountain_3',
            name: '火石寨丹霞骑行',
            city: '固原',
            coreAttractions: '火石寨地质公园',
            activities: '丹霞地貌骑行、地质科普',
            duration: '1日游',
            features: '地质奇观+户外运动'
          }
        ]
      },
      {
        id: 'red',
        category: '红色文化体验',
        count: 3,
        coreAttractions: ['六盘山', '将台堡', '单家集'],
        featuredActivities: ['重走长征路', '纪念馆参观', '红色主题研学'],
        routes: [
          {
            id: 'red_1',
            name: '六盘山长征精神研学',
            city: '固原',
            coreAttractions: '六盘山长征纪念馆',
            activities: '重走长征路、红色故事分享',
            duration: '2天1夜',
            features: '沉浸式红色教育，团队拓展'
          },
          {
            id: 'red_2',
            name: '将台堡会师之路',
            city: '固原',
            coreAttractions: '将台堡会师纪念碑',
            activities: '历史场景还原、主题微电影拍摄',
            duration: '1日游',
            features: '互动式体验，适合青少年研学'
          },
          {
            id: 'red_3',
            name: '单家集民族团结之旅',
            city: '吴忠',
            coreAttractions: '单家集革命旧址',
            activities: '民族团结讲座、民俗体验',
            duration: '1日游',
            features: '结合回族文化，深化爱国主义教育'
          }
        ]
      },
      {
        id: 'rural',
        category: '乡村体育旅游',
        count: 4,
        coreAttractions: ['北长滩村', '岩画古村', '中北村'],
        featuredActivities: ['农事体验', '民俗手作', '生态采摘'],
        routes: [
          {
            id: 'rural_1',
            name: '北长滩古村农创体验',
            city: '中卫（吴忠）',
            coreAttractions: '北长滩村',
            activities: '农事劳作、黄河石林摄影',
            duration: '2天1夜',
            features: '传统村落与现代农创结合'
          },
          {
            id: 'rural_2',
            name: '岩画古村非遗手作',
            city: '银川',
            coreAttractions: '贺兰山岩画村',
            activities: '岩画拓印、枸杞采摘',
            duration: '1日游',
            features: '非遗文化传承+生态农业体验'
          },
          {
            id: 'rural_3',
            name: '中北村生态果园行',
            city: '石嘴山',
            coreAttractions: '中北村生态果园',
            activities: '水果采摘、田园骑行',
            duration: '1日游',
            features: '亲子休闲，田园风光'
          },
          {
            id: 'rural_4',
            name: '南方村星空牧场',
            city: '青铜峡',
            coreAttractions: '南方村牧场',
            activities: '牧场露营、篝火晚会、挤羊奶体验',
            duration: '1日游',
            features: '牧区文化体验，夜间活动丰富'
          }
        ]
      },
      {
        id: 'river',
        category: '河流体育旅游',
        count: 3,
        coreAttractions: ['青铜峡黄河大峡谷', '银川黄河古渡', '水洞沟'],
        featuredActivities: ['黄河漂流', '皮划艇', '水上拓展'],
        routes: [
          {
            id: 'river_1',
            name: '黄河大峡谷漂流',
            city: '青铜峡',
            coreAttractions: '青铜峡黄河大峡谷',
            activities: '激流漂流、峡谷风光摄影',
            duration: '1日游',
            features: '惊险刺激，自然奇观'
          },
          {
            id: 'river_2',
            name: '银川古渡水上嘉年华',
            city: '银川',
            coreAttractions: '黄河古渡',
            activities: '皮划艇竞赛、水上闯关',
            duration: '1日游',
            features: '团队竞技，适合企业团建'
          },
          {
            id: 'river_3',
            name: '水洞沟湿地探秘',
            city: '银川',
            coreAttractions: '水洞沟旅游区',
            activities: '湿地徒步、观鸟、生态讲座',
            duration: '1日游',
            features: '生态科普，亲子友好'
          }
        ]
      },
      {
        id: 'snow',
        category: '冰雪体育旅游',
        count: 3,
        coreAttractions: ['贺兰山阅海滑雪场', '西夏皇陵冰雪乐园'],
        featuredActivities: ['滑雪', '雪地摩托', '冰雕观赏'],
        routes: [
          {
            id: 'snow_1',
            name: '贺兰山阅海滑雪挑战',
            city: '银川',
            coreAttractions: '阅海滑雪场',
            activities: '滑雪教学、雪地摩托',
            duration: '1日游',
            features: '专业雪道，适合初学者与进阶玩家'
          },
          {
            id: 'snow_2',
            name: '西夏皇陵冰雪乐园',
            city: '银川',
            coreAttractions: '西夏皇陵景区',
            activities: '冰雕展览、雪橇滑行',
            duration: '1日游',
            features: '文化+冰雪，适合家庭游玩'
          },
          {
            id: 'snow_3',
            name: '六盘山雾凇奇观行',
            city: '固原',
            coreAttractions: '六盘山冬季林场',
            activities: '雾凇摄影、雪地徒步',
            duration: '2天1夜',
            features: '冬季限定景观，摄影爱好者专属'
          }
        ]
      }
    ]
  },
  onLoad: function() {
    const store = require('../../core/data-store');
    store.ensureReady();
    const routes = store.listRoutes();
    const cats = Array.from(new Set(routes.map(rt => rt.category).filter(Boolean)));
    const markerRouteMap = {};
    const colorMap = { '自然风光': '#22C55E', '河流体育旅游': '#06B6D4', '红色文化体验': '#EF4444', '乡村体育旅游': '#F59E0B', '冰雪体育旅游': '#6366F1', '其他': '#607D8B' }
    const markers = routes.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number').map((r, idx) => {
      const id = idx + 1;
      markerRouteMap[id] = r._id;
      return {
        id,
        latitude: r.lat,
        longitude: r.lng,
        title: r.name,
        callout: { content: r.name, color: '#ffffff', bgColor: colorMap[r.category] || '#22C55E', borderRadius: 8, padding: 6, display: 'ALWAYS' }
      };
    });
    const center = markers.length>0 ? { latitude: markers[0].latitude, longitude: markers[0].longitude } : { latitude: 38.5, longitude: 106.3 };
    this.setData({
      categories: cats,
      mapMarkers: markers,
      mapCenter: center,
      mapScale: 7,
      markerRouteMap
    });
  },
  onShow: function() {
    
  },
  
  // 点击分类卡片，显示该分类下的路线列表
  navigateToCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    const category = this.data.routeCategories.find(item => item.id === categoryId);
    
    if (category) {
      this.setData({
        selectedCategory: category
      });
      const routeIds = (category.routes || []).map(r => r.id)
      this.setMarkersByRouteIds(routeIds)
    }
  },
  
  // 跳转到路线详情页
  navigateToRouteDetail: function(e) {
    const routeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/routeDetail/routeDetail?id=${routeId}`
    });
  },
  setMapCategoryFilter: function(e) {
    const cat = e.currentTarget.dataset.cat;
    const store = require('../../core/data-store');
    const routes = store.listRoutes();
    const filtered = cat==='all' ? routes : routes.filter(r => r.category === cat);
    const markerRouteMap = {};
    const colorMap = { '自然风光': '#22C55E', '河流体育旅游': '#06B6D4', '红色文化体验': '#EF4444', '乡村体育旅游': '#F59E0B', '冰雪体育旅游': '#6366F1', '其他': '#607D8B' }
    const markers = filtered.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number').map((r, idx) => {
      const id = idx + 1;
      markerRouteMap[id] = r._id;
      return {
        id,
        latitude: r.lat,
        longitude: r.lng,
        title: r.name,
        callout: { content: r.name, color: '#ffffff', bgColor: colorMap[r.category] || '#22C55E', borderRadius: 8, padding: 6, display: 'ALWAYS' }
      };
    });
    const center = markers.length>0 ? { latitude: markers[0].latitude, longitude: markers[0].longitude } : this.data.mapCenter;
    this.setData({ selectedMapCategory: cat, mapMarkers: markers, mapCenter: center, markerRouteMap });
  },
  setMarkersByRouteIds: function(routeIds) {
    const store = require('../../core/data-store');
    const routes = store.listRoutes();
    const set = new Set(routeIds);
    const filtered = routes.filter(r => set.has(r._id));
    const colorMap = { '自然风光': '#22C55E', '河流体育旅游': '#06B6D4', '红色文化体验': '#EF4444', '乡村体育旅游': '#F59E0B', '冰雪体育旅游': '#6366F1', '其他': '#607D8B' }
    const markerRouteMap = {};
    const markers = filtered.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number').map((r, idx) => {
      const id = idx + 1;
      markerRouteMap[id] = r._id;
      return {
        id,
        latitude: r.lat,
        longitude: r.lng,
        title: r.name,
        callout: { content: r.name, color: '#ffffff', bgColor: colorMap[r.category] || '#22C55E', borderRadius: 8, padding: 6, display: 'ALWAYS' }
      };
    });
    const center = markers.length>0 ? { latitude: markers[0].latitude, longitude: markers[0].longitude } : this.data.mapCenter;
    this.setData({ mapMarkers: markers, mapCenter: center, markerRouteMap });
  },
  onMarkerTap: function(e) {
    const id = e.detail.markerId;
    const rid = this.data.markerRouteMap[id];
    if (rid) {
      const store = require('../../core/data-store');
      const routes = store.listRoutes();
      const r = routes.find(rt => rt._id === rid);
      if (r) {
        const cat = r.category || '其他'
        const catKey = (cat === '自然风光') ? 'nature'
          : (cat === '河流体育旅游') ? 'river'
          : (cat === '红色文化体验') ? 'red'
          : (cat === '乡村体育旅游') ? 'rural'
          : (cat === '冰雪体育旅游') ? 'snow'
          : (cat === '沙漠徒步') ? 'desert'
          : 'other'
        this.setData({ selectedRouteSummary: Object.assign({}, r, { categoryKey: catKey }) });
      } else {
        wx.navigateTo({ url: `/pages/routeDetail/routeDetail?id=${rid}` });
      }
    }
  },
  closeSummary: function() {
    this.setData({ selectedRouteSummary: null });
  },
  noop: function() {},
  locateMe: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({ mapCenter: { latitude: res.latitude, longitude: res.longitude }, mapScale: 10 })
      },
      fail: () => {
        wx.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  }
})
