Page({
  data: {
    routeInfo: {},
    rating: 0,
    comment: '',
    relatedRoutes: [],
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
            features: '夜间观星+沙漠生存技能体验',
            brief: '体验沙漠星空与生存技能'
          },
          {
            id: 'desert_2',
            name: '腾格里穿越挑战',
            city: '吴忠',
            coreAttractions: '腾格里沙漠',
            activities: '30公里沙漠穿越、骆驼骑行',
            duration: '3天2夜',
            features: '专业级探险，团队协作训练',
            brief: '专业级沙漠探险体验'
          },
          {
            id: 'desert_3',
            name: '青铜峡沙湖轻徒步',
            city: '青铜峡',
            coreAttractions: '青铜峡沙湖',
            activities: '5公里休闲徒步、沙湖摄影',
            duration: '1日游',
            features: '亲子友好，自然风光与生态教育结合',
            brief: '适合亲子的轻松徒步'
          },
          {
            id: 'desert_4',
            name: '沙漠绿洲探秘',
            city: '石嘴山',
            coreAttractions: '石嘴山戈壁绿洲',
            activities: '绿洲寻踪、植物科考、沙漠瑜伽',
            duration: '1日游',
            features: '生态保护主题，轻量化体验',
            brief: '探索沙漠中的绿色奇迹'
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
            features: '历史与自然融合，中低难度',
            brief: '探索古道与岩画文化'
          },
          {
            id: 'mountain_2',
            name: '六盘山森林穿越',
            city: '固原',
            coreAttractions: '六盘山国家森林公园',
            activities: '山地骑行、森林氧吧体验',
            duration: '2天1夜',
            features: '天然氧吧，适合避暑养生',
            brief: '森林深处的骑行体验'
          },
          {
            id: 'mountain_3',
            name: '火石寨丹霞骑行',
            city: '固原',
            coreAttractions: '火石寨地质公园',
            activities: '丹霞地貌骑行、地质科普',
            duration: '1日游',
            features: '地质奇观+户外运动',
            brief: '丹霞地貌中的骑行探险'
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
            features: '沉浸式红色教育，团队拓展',
            brief: '重温长征精神的研学之旅'
          },
          {
            id: 'red_2',
            name: '将台堡会师之路',
            city: '固原',
            coreAttractions: '将台堡会师纪念碑',
            activities: '历史场景还原、主题微电影拍摄',
            duration: '1日游',
            features: '互动式体验，适合青少年研学',
            brief: '重走红军会师路线'
          },
          {
            id: 'red_3',
            name: '单家集民族团结之旅',
            city: '吴忠',
            coreAttractions: '单家集革命旧址',
            activities: '民族团结讲座、民俗体验',
            duration: '1日游',
            features: '结合回族文化，深化爱国主义教育',
            brief: '民族团结教育与文化体验'
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
            features: '传统村落与现代农创结合',
            brief: '古村落中的农创体验'
          },
          {
            id: 'rural_2',
            name: '岩画古村非遗手作',
            city: '银川',
            coreAttractions: '贺兰山岩画村',
            activities: '岩画拓印、枸杞采摘',
            duration: '1日游',
            features: '非遗文化传承+生态农业体验',
            brief: '非遗文化与农业体验'
          },
          {
            id: 'rural_3',
            name: '中北村生态果园行',
            city: '石嘴山',
            coreAttractions: '中北村生态果园',
            activities: '水果采摘、田园骑行',
            duration: '1日游',
            features: '亲子休闲，田园风光',
            brief: '生态果园采摘与骑行'
          },
          {
            id: 'rural_4',
            name: '南方村星空牧场',
            city: '青铜峡',
            coreAttractions: '南方村牧场',
            activities: '牧场露营、篝火晚会、挤羊奶体验',
            duration: '1日游',
            features: '牧区文化体验，夜间活动丰富',
            brief: '牧场文化与星空露营'
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
            features: '惊险刺激，自然奇观',
            brief: '黄河峡谷中的漂流冒险'
          },
          {
            id: 'river_2',
            name: '银川古渡水上嘉年华',
            city: '银川',
            coreAttractions: '黄河古渡',
            activities: '皮划艇竞赛、水上闯关',
            duration: '1日游',
            features: '团队竞技，适合企业团建',
            brief: '水上竞技与团队挑战'
          },
          {
            id: 'river_3',
            name: '水洞沟湿地探秘',
            city: '银川',
            coreAttractions: '水洞沟旅游区',
            activities: '湿地徒步、观鸟、生态讲座',
            duration: '1日游',
            features: '生态科普，亲子友好',
            brief: '湿地生态探索与科普'
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
            features: '专业雪道，适合初学者与进阶玩家',
            brief: '专业滑雪场的雪上体验'
          },
          {
            id: 'snow_2',
            name: '西夏皇陵冰雪乐园',
            city: '银川',
            coreAttractions: '西夏皇陵景区',
            activities: '冰雕展览、雪橇滑行',
            duration: '1日游',
            features: '文化+冰雪，适合家庭游玩',
            brief: '历史文化与冰雪娱乐'
          },
          {
            id: 'snow_3',
            name: '六盘山雾凇奇观行',
            city: '固原',
            coreAttractions: '六盘山冬季林场',
            activities: '雾凇摄影、雪地徒步',
            duration: '2天1夜',
            features: '冬季限定景观，摄影爱好者专属',
            brief: '冬季限定的雾凇奇观'
          }
        ]
      }
    ]
  },
  onLoad: function(options) {
    // 页面加载时初始化数据
    if (options && options.id) {
      this.getRouteDetail(options.id);
    }
  },
  
  // 获取路线详情
  getRouteDetail: function(routeId) {
    // 从数据中查找对应ID的路线
    let foundRoute = null;
    let category = null;
    
    // 遍历所有类别查找路线
    for (let cat of this.data.routeCategories) {
      for (let route of cat.routes) {
        if (route.id === routeId) {
          foundRoute = route;
          category = cat;
          break;
        }
      }
      if (foundRoute) break;
    }
    
    if (foundRoute) {
      this.setData({
        routeInfo: foundRoute
      });
      
      // 获取相关路线推荐（同类别的其他路线）
      if (category) {
        const relatedRoutes = category.routes
          .filter(route => route.id !== routeId)
          .slice(0, 3); // 最多显示3条相关路线
        
        this.setData({
          relatedRoutes: relatedRoutes
        });
      }
    } else {
      wx.showToast({
        title: '未找到路线信息',
        icon: 'none'
      });
    }
  },
  
  onRate: function(e) {
    // 处理评分事件
    const value = e.currentTarget.dataset.value;
    this.setData({
      rating: value
    });
  },
  
  onCommentInput: function(e) {
    this.setData({
      comment: e.detail.value
    });
  },
  
  onSubmitComment: function() {
    // 提交评论
    const { rating, comment, routeInfo } = this.data;
    
    if (rating === 0) {
      wx.showToast({
        title: '请先进行评分',
        icon: 'none'
      });
      return;
    }
    
    if (!comment.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }
    
    // 这里可以添加将评论提交到服务器的代码
    // 模拟提交成功
    wx.showToast({
      title: '评论提交成功',
      icon: 'success'
    });
    
    // 清空评论框
    this.setData({
      comment: ''
    });
  },
  
  navigateToRoute: function(e) {
    // 跳转到相关路线详情
    const routeId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: `/pages/routeDetail/routeDetail?id=${routeId}`
    })
  }
})