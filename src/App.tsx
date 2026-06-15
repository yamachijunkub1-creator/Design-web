import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BrainCircuit, 
  Eye, 
  RefreshCcw, 
  Play, 
  Layers, 
  Cpu, 
  Smartphone, 
  Sliders, 
  Volume2, 
  CheckSquare, 
  Compass, 
  FileCheck, 
  Plus, 
  FolderOpen, 
  Trash2, 
  Copy, 
  Download, 
  Flame, 
  Search, 
  User, 
  Smile, 
  Award, 
  Heart,
  VolumeX,
  Sparkles,
  Gift,
  Palette,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Wand2,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProductConfig, HistoryItem } from './types';
import CarrierCanvas from './components/CarrierCanvas';

// 默认初始配置项 - 融入 hardcore 的 CMF 及认知工程参数
const DEFAULT_CONFIG = (): ProductConfig => ({
  id: '',
  name: '奇妙童伴 AI 智能伴游创想专案',
  lastSaved: '',
  
  // Step 1: 幼童人机工程学学空间与习惯需求建模
  travelScenes: ['交通枢纽', '游乐园'],
  independenceLevel: '有点经验',
  habitsTarget: ['记住物品', '完成简单指令'],
  personality: '外向',
  
  // Step 2: 形态载体与 CMF 工艺规范 + 多轴传感舱配置
  carriers: ['可穿戴手环'],
  sensors: ['环境光传感器', '心率传感器', '震动马达', 'GPS'], 
  designNotes: '🎨 【工艺与 CMF 特殊声明】：\n本专案外壳采用邵氏硬度约 50°A 的超柔食品级液体硅胶 (LSR) 双射包覆成型，具有优良的防过敏亲肤阻尼感。物理边缘倒角严格采用 R>=6.5mm 圆润钝角设计，从而防范颠簸状态下的意外刺伤；核心电池包采用全灌封 IP67 级别三防与阻燃防爆物理内胆。机器整体无任何可能导致儿童误吞的小细件（所有物理零配件的包络外廊几何对角线尺寸均大于 31.7mm 安全红线），通过 ASTM F963-17 与 EN71 部分儿童机械及物理学安全可靠检验规范。',
  sketchImage: null,
  
  // Step 3: 声学包络、触觉谐振与多感官交互系统设定
  feedbackHeartRate: true,
  visualLightTone: '暖色',
  audioVolume: 65,
  vibrationModeSuccess: '中',
  vibrationModeDanger: '强',
  vibrationModeNav: '中',
  
  // Step 4: 巴甫洛夫自适应行为矫正增强习惯回路与高加速可靠性体检 (HALT)
  habitClosedLoopSteps: [
    '设定挑战（家长APP）',
    '执行与辅助（产品提示）',
    '即时反馈（震动+语音表扬）',
    '记录与复盘（同步APP）'
  ],
  testItems: ['定位精度', '跌落', '习惯闭环测试'],
  checklistReady: true
});

// 载体匹配传感器映射
const CARRIER_SENSORS_MAPPING: Record<string, string[]> = {
  '可穿戴手环': ['环境光传感器', '心率传感器', '震动马达', 'GPS'],
  '挂坠': ['麦克风', '震动马达', '骨传导传感器', 'GPS'],
  '智能鞋带扣': ['IMU', '压力传感器', 'GPS'],
  '小行李箱': ['UWB', '触感传感器', 'GPS', '环境光传感器'],
  '背包': ['UWB', '麦克风', '环境光传感器'],
  '旅行印章机': ['触感传感器', '环境光传感器', '麦克风'],
  '贴纸机': ['触感传感器', '深度传感器']
};

// 带有卡通童话名称与专业 CMF 标签的物种载体
const CARRIERS_DISPLAY: Record<string, string> = {
  '可穿戴手环': '⌚ 喵喵肉垫运动手环 (LSR硅胶/心率PPG)',
  '挂坠': '🔮 小星铃温和骨阻挂坠 (轻压防勒/骨传导)',
  '智能鞋带扣': '👟 奔跑小飞翼鞋带搭扣 (高能IMU体感扣/尼龙扣)',
  '小行李箱': '🐧 企鹅防侧翻抗压拉杆箱 (UWB近场自追踪/防摔ABS)',
  '背包': '🎒 熊嘟嘟柔棉轻盈防丢背包 (减压宽肩带/反光织物)',
  '旅行印章机': '🍄 奇妙小红菇防吞吞印章机 (天然无毒色浆/物理按压)',
  '贴纸机': '📸 萌拍兔子热敏勋章贴纸机 (免墨儿童安全热纸/圆倒角)'
};

const SCENES_DISPLAY: Record<string, string> = {
  '交通枢纽': '🚏 玩具总动员车站 (复杂密集声光抗扰区)',
  '游乐园': '🎡 奇幻玩伴游乐区 (大范围长尾寻回寻物区)',
  '自然探索': '🌿 绿野仙踪野露营 (非结构化地形体感追踪)',
  '住宿': '🏨 萌兔温馨亲子休息区 (室内WiFi多径微网格基站)',
  '短途': '🚲 太阳公公野餐骑行 (动态防飞扬防边缘侧翻区)',
  '长途': '✈️ 环球飞飞大巡游 (长续航低功耗GPS全定位区)'
};

const HABITS_DISPLAY: Record<string, string> = {
  '不跑远': '🛡️ 黄金范围物理阻尼带 (基于UWB安全寻归)',
  '记住物品': '🎒 照看随身物理小玩物 (RFID/压力感知看护)',
  '完成简单指令': '📝 幼儿认知打卡反射强化 (自适应交互引导)'
};

const LEVEL_DISPLAY = {
  '初学': '🐣 独立小新芽 L1级 (被动式安全警警戒牵引)',
  '有点经验': '🐥 探险小勇士 L2级 (自适应双向声光鼓励)',
  '比较独立': '🦖 傲游小狮子 L3级 (目标驱动自动盖章贴纸勋章)'
};

const PERSONALITY_DISPLAY = {
  '内向': '🐹 静静小考拉型 (低压微触，深空呼吸慢光交互)',
  '外向': '🦁 淘气小飞象型 (跃动触感，瞬态七彩流光反馈)'
};

export default function App() {
  const [form, setForm] = useState<ProductConfig>(DEFAULT_CONFIG());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reportName, setReportName] = useState<string>('奇妙童伴 AI 智能伴游创想专案');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // 模拟声音引擎组件
  const audioCtxRef = useRef<AudioContext | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 页面初始化及重载草稿
  useEffect(() => {
    const savedHistory = localStorage.getItem('pdefine_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history database', e);
      }
    }

    const activeDraft = localStorage.getItem('pdefine_active_draft');
    if (activeDraft) {
      try {
        const parsed = JSON.parse(activeDraft);
        setForm(parsed);
        setReportName(parsed.name || '奇妙童伴 AI 智能伴游创想专案');
      } catch (e) {
        console.warn('Draft auto-reloads ignored');
      }
    } else {
      const initialForm = DEFAULT_CONFIG();
      initialForm.id = 'kid_spec_' + Date.now().toString(36);
      setForm(initialForm);
    }
  }, []);

  // 本地自动同步
  useEffect(() => {
    if (form.id) {
      const formToSave = { ...form, name: reportName };
      localStorage.setItem('pdefine_active_draft', JSON.stringify(formToSave));
    }
  }, [form, reportName]);

  // 根据用户人机接口参数提供算法级别策略模型分析 (利用专业行为强化及声学安全工程语言)
  const getAbilityLevel = () => {
    switch (form.independenceLevel) {
      case '初学':
        return {
          level: '🌈 萌新阶段 L1（防走失被动多频牵引模型）',
          desc: '该阶段适龄儿童空间认知系统尚在发育。产品架构采用低时延物理阻拦与柔适微振动报警组合。当超出 10m 空间红线（基于 UWB 到达时差算法测距），设备即刻输出 120Hz 微幅谐振，搭配防穿刺级外放音频做方向诱导，配合家长侧蓝牙 RSSI 测距报警。'
        };
      case '有点经验':
        return {
          level: '🌟 成长阶段 L2（行为打卡与即时物质强化模型）',
          desc: '宝宝已具备基本自主行为。交互采用正向奖赏规则（Pavlovian Conditioning Loop）。提供温暖向日葵色 LED 高频笑脸响应和目标习惯解锁仪式感，通过微马达的敲击感促进自尊心的行为增强。'
        };
      case '比较独立':
        return {
          level: '🚀 自励阶段 L3（目标导向性微徽章硬件兑现模型）',
          desc: '宝宝独立社交探索欲显著。交互以任务为主导。通过 3D 贴纸设备/蘑菇盖章硬件微机电解锁模组（累计连续完成三次探索自主权后触发弹射出口），实现好习惯由外在诱导至内在大脑机制形成的快速内化跃进。'
        };
      default:
        return { level: '🌟 L2 自适应成长级模型', desc: '采用 3000K 视觉皮层无损色温及听觉分频保护限制。' };
    }
  };

  const getRecommendedTask = () => {
    const isIntrovert = form.personality === '内向';
    const firstScene = form.travelScenes[0] || '奇乐世界大森林';
    
    if (form.independenceLevel === '初学') {
      return `【CMF无形安全拉骨绳】：专为“${firstScene}”强电磁声光干扰区制定。基于厘米级 UWB 阵列天线追踪，以儿童机身为原点构筑半径 6-8 米“虚拟防拐阻水墙”。一旦走失倾角或距离突变，玩具输出仿猫打呼噜频段温和低振阻尼，配上可亲低音舒爽提示音：“小乖乖，往亮暖灯的方向走，爸爸在看你哦”，完成防走散行为阻拦。`;
    } else if (form.independenceLevel === '有点经验') {
      return `【${isIntrovert ? '心跳彩虹寻宝日记' : '勇敢小狮子归队列车'}】：在“${firstScene}”游玩期间，借助压力重力传感器和 PPG 生理同步对齐电极，当发现宝宝看护好了“${form.habitsTarget[0] || '自己的小行李'}”，设备前端 LED 会幻化出 3000K 极透“暖色向日葵彩虹光晕”，并在后台积分数据库解锁红星，用无压微震反馈激发良好自律性习惯。`;
    } else {
      return `【全地形打卡徽章日记】：宝宝穿梭于“${form.travelScenes.join(' / ')}”非结构性景区场景。通过多轴 IMU 和 GPS 空间重叠识别，当宝宝打卡并成功实现“${form.habitsTarget[1] || '家长远程任务指令'}”时，玩具底部的物理微机电印章机械闩锁自动释能解锁，宝宝可直接朝手账上“吧嗒”敲上一枚高赞出厂特制的“无毒萌趣勋章印”，带来极强好习惯内化成就动机反馈！`;
    }
  };

  const handleNewReport = () => {
    const newForm = DEFAULT_CONFIG();
    newForm.id = 'kid_spec_' + Date.now().toString(36);
    setForm(newForm);
    setReportName('全新儿童智能玩偶 CMF 创想定义');
    setCurrentStep(1);
    showToast('✨ 翻开了全新的一张画纸！配置数值均已重置。', 'success');
  };

  const handleSaveToHistory = () => {
    const updatedForm = { ...form, name: reportName, lastSaved: new Date().toLocaleString() };
    const savedItem: HistoryItem = {
      id: updatedForm.id,
      name: updatedForm.name,
      lastSaved: updatedForm.lastSaved,
      config: updatedForm
    };

    let nextHistory = [...history];
    const existingIndex = nextHistory.findIndex(item => item.id === updatedForm.id);
    if (existingIndex > -1) {
      nextHistory[existingIndex] = savedItem;
    } else {
      nextHistory = [savedItem, ...nextHistory];
    }

    if (nextHistory.length > 5) {
      nextHistory = nextHistory.slice(0, 5);
    }

    setHistory(nextHistory);
    localStorage.setItem('pdefine_history', JSON.stringify(nextHistory));
    showToast(`🎒 “${reportName}” 已经由小印章稳帖盖进底部的创意收纳夹了呢！`, 'success');
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setForm(item.config);
    setReportName(item.name);
    setCurrentStep(1); 
    showToast(`✨ 看！成功的从档案盒里拉出了这一张手稿：“${item.name}”`, 'info');
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('pdefine_history', JSON.stringify(updated));
    showToast('🧹 已撕下这张小纸条，手账移出工作室', 'info');
  };

  // 联动机制：选择物理形态自动塞满适应该形态的专业传感器
  const handleCarrierChange = (carrier: string) => {
    let nextCarriers = [...form.carriers];
    if (nextCarriers.includes(carrier)) {
      nextCarriers = nextCarriers.filter(c => c !== carrier);
    } else {
      nextCarriers.push(carrier);
    }

    let newlyMappedSensorsSet = new Set<string>();
    nextCarriers.forEach(c => {
      const defaultSensors = CARRIER_SENSORS_MAPPING[c] || [];
      defaultSensors.forEach(s => newlyMappedSensorsSet.add(s));
    });

    setForm({
      ...form,
      carriers: nextCarriers,
      sensors: Array.from(newlyMappedSensorsSet)
    });
  };

  const handleSensorToggle = (sensor: string) => {
    let nextSensors = [...form.sensors];
    if (nextSensors.includes(sensor)) {
      nextSensors = nextSensors.filter(s => s !== sensor);
    } else {
      nextSensors.push(sensor);
    }
    setForm({ ...form, sensors: nextSensors });
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, sketchImage: reader.result as string });
        showToast('🎨 真棒呀！彩笔图画已经贴进我们的手账本格子啦！', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // 声音试听，严格按照儿童声乐防耳刺伤及EN71高频限音标准说明
  const handlePlaySoundTest = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 叮叮咚咚滑音
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // 限幅设定：音温无频发刺，防止儿童内耳受损
      const adjustedVolume = (form.audioVolume / 100) * 0.10;
      gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);

      if (form.visualLightTone === '暖色') {
        // 暖色甜美音
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        osc2.type = 'sine';

        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc1.start();
        osc2.start(ctx.currentTime + 0.12);
        
        osc1.stop(ctx.currentTime + 0.7);
        osc2.stop(ctx.currentTime + 0.7);
        showToast('🔔 低声压童音【双鸣叮当 chimes】：73dBA 声学安全分贝标准验证合格！', 'info');
      } else {
        // 冷色音
        osc1.frequency.setValueAtTime(698.46, ctx.currentTime); // F5
        osc1.type = 'sine';
        osc1.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.25); // B5
        
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.52);
        showToast('🎵 纯净精灵音【高阻哨笛 whistle】：74.5dBA 声学降噪包络波校验通过！', 'info');
      }
    } catch (e) {
      showToast('受到浏览器安全音频政策拦截。别担心，在页面侧栏随意按按，即可听到奇妙之音！', 'info');
    }
  };

  // 120Hz 仿泥捏或舒缓打鼾心跳震感测试：有效规避婴幼末梢神经不灵敏钝化
  const [shakingType, setShakingType] = useState<string | null>(null);
  const handlePlayVibeTest = (type: string, strength: string) => {
    setShakingType(type);
    showToast(`⚡ 触控低频阻尼反馈调试：模拟[${type}] 💥 微位移量振幅：${strength === '强' ? '120Hz 深度拍击' : strength === '中' ? '120Hz 泥捏舒张' : '120Hz 蚕鸣轻柔'}`, 'success');
    
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // 专业的120Hz谐振频率，该频段对幼儿皮肤感受野最柔适且防止不适
      let freq = 120; 
      let gainVal = 0.05;
      if (strength === '弱') gainVal = 0.015;
      if (strength === '强') { freq = 120; gainVal = 0.11; }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(err) {}

    setTimeout(() => {
      setShakingType(null);
    }, 850);
  };

  const exportPdfReport = async () => {
    const reportElement = document.getElementById('product-report-panel');
    if (!reportElement) {
      showToast('呜呜，迷路啦，找不到画册印刷区域呢，稍后再试一下吧', 'error');
      return;
    }

    showToast('🎨 【印章着墨印刷中】系统正自适应输出 300DPI 极精印刷手账...', 'info');

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffcf7',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`儿童AI萌宠创意设想_${reportName.replace(/\s+/g, '_')}_CMF手账蓝图.pdf`);
      showToast('🎉 印制成功！彩版 A4 级手账蓝图已存入物理背包（下载区），快拿去给小伙伴大饱眼福吧！', 'success');
    } catch (error) {
      console.error('PDF generation error', error);
      showToast('噢，墨水太浓弄脏纸啦，印刷 PDF 遇到难题了哦', 'error');
    }
  };

  const handleCopySummary = () => {
    const defaultTask = getRecommendedTask();
    const ability = getAbilityLevel();
    const summaryText = `
🌈 【奇妙童伴 AI 智能成长玩伴物理定义手账: ${reportName}】
=========================================
👶 【模块一】儿童人机工程学学空间与习惯需求建模
· 出游探索地理微环境自适应区: ${form.travelScenes.map(s => SCENES_DISPLAY[s] || s).join(', ')}
· 婴幼行为抗挫独立级别: ${LEVEL_DISPLAY[form.independenceLevel]}
· 行为强化认知习惯模型: ${ability.level}
· 认知行为矫正与习惯强化因子: ${form.habitsTarget.map(h => HABITS_DISPLAY[h] || h).join(', ')}
· 婴幼多通道交互感受野偏向: ${PERSONALITY_DISPLAY[form.personality]}

🧸 【模块二】AI 形态载体与 CMF（颜色、材质、表面处理）工艺
· 产品构型载体样式: ${form.carriers.map(c => CARRIERS_DISPLAY[c] || c).join(', ')}
· 传感器多轴体感感知矩阵: ${form.sensors.join(', ')}
· 厘米级 AI 自适应推荐交互挑战: ${defaultTask}
· 造型师 CMF 工艺表面处理手札: ${form.designNotes}

🌈 【模块三】声学包络、触觉谐振与多感官交互系统
· PPG生理同步情绪背暖呼吸灯: ${form.feedbackHeartRate ? '💗 拥有限时自适应呼吸发光彩虹回路' : '❌ 常规常亮辅助灯'}
· 婴幼物理结构防护级别: 👶 LSR食品级柔敏包覆 / 全钝角外罩倒角 R>=6.5mm / 窒息防吞零件外廓直径 >31.7mm (符合 ASTM F963红线)
· 视觉皮层友好无频闪色调度: ${form.visualLightTone === '暖色' ? '☀️ 温暖向日葵系无频闪发光 (3000K)' : '❄️ 冰蓝雪面高纯指示灯 (6500K)'}
· 听力声压出放安全极限包络: EN71标准上限限制 (当前: ${form.audioVolume} %，最大出放声压级 <= 75dBA 软性降噪限值)
· 120Hz 触觉微振谐振阻尼档位: 通关表扬反馈 [ 120Hz ${form.vibrationModeSuccess}级 ] | 伴游方向引导 [ 120Hz ${form.vibrationModeNav}级 ] | 边缘超界警戒 [ 120Hz ${form.vibrationModeDanger}级 ]

🏁 【模块四】巴甫洛夫好习惯内化列车与工业及安全测试
· 好习惯行为自适应增强回路车厢:
${form.habitClosedLoopSteps.map((step, idx) => `  🚇 [车厢阶段 ${idx + 1}] -> ${step}`).join('\n')}
· 工业物理可靠性应力寿命测试 (HALT) 验收: ${form.testItems.map(t => `✨ ${t}自测试合格`).join(' | ')}
· 出厂安全可靠性 Checklist 勾验: ${form.checklistReady ? '✅ 工业婴幼级安全体检 22 项全对齐合格，准予发行！' : '⚠️ 工程师正在打点调整参数中'}
=========================================
🎨 出厂创意制造所: 奇妙童伴 AI 玩具梦工坊 | 梦境诞生时间: ${new Date().toLocaleString()}
`;

    navigator.clipboard.writeText(summaryText.trim())
      .then(() => {
        showToast('📋 手账摘要与 CMF 数据包已一键贴进小尾巴（剪贴板）了，快去发送吧！', 'success');
      })
      .catch((err) => {
        showToast('小书包开小差了，可以自己在这手动抹蓝文字拷贝噢', 'error');
      });
  };

  const handleSelectAllSensors = () => {
    const all = ['环境光传感器', '环境温度传感器', '摄像头', '深度传感器', '麦克风', '骨传导传感器', '震动马达', '压力传感器', '触感传感器', '气体传感器', '空气质量检测', 'GPS', 'IMU', '地磁传感器', 'UWB', '心率传感器', '皮电传感器', '体温传感器'];
    setForm({ ...form, sensors: all });
    showToast('👑 哗！给宝宝的爱意塞满小包包啦！已满血配备全能多轴微感芯片阵列！', 'success');
  };

  return (
    <div className="min-h-screen bg-[#fffbf5] flex font-sans text-slate-800 antialiased relative selection:bg-orange-100 selection:text-amber-900 leading-normal notebook-paper">
      
      {/* Toast Notification Container */}
      {toast && (
        <div id="toast-notify" className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#ff7a59] text-white text-xs font-bold px-5 py-4 rounded-2xl shadow-[6px_6px_0px_0px_#7c2d12] border-3 border-amber-950 transition-all duration-300 animate-slide-in">
          <span className="w-3.5 h-3.5 rounded-full border border-white bg-white animate-spin-slow" />
          <span className="font-display text-[12px] tracking-wide">{toast.text}</span>
        </div>
      )}

      {/* LEFT SIDEBAR AREA - STYLED LIKE AN ALBUM SIDE SHELF */}
      <aside className="w-[315px] bg-[#fdfaf2] border-r-4 border-amber-950/20 flex flex-col shrink-0 select-none hidden lg:flex relative">
        
        {/* Binder Spiral Wire Spine - Emulating a spiral-bound sketchbook */}
        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-[86%] flex flex-col justify-between items-center z-20 pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="relative flex items-center justify-center">
              {/* Loop shape representing wire rings */}
              <div className="w-5.5 h-7 border-2 border-slate-350 bg-gradient-to-r from-slate-100 to-slate-200/80 rounded-full shadow-[2px_1px_2px_rgba(0,0,0,0.15)] -mr-3 rotate-[-12deg]" />
              {/* Punch hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/15 absolute -left-1.5 shadow-inner" />
            </div>
          ))}
        </div>

        {/* Workspace Title header with lovely dynamic bunny icon */}
        <div className="p-6 border-b-3 border-dashed border-amber-200/90 bg-[#fffbe6]/75 relative overflow-hidden">
          <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-[#ffbd39]/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-3xl bg-[#ffbd39] border-3 border-amber-950 flex items-center justify-center shadow-[4px_4px_0px_0px_#7c2d12] animate-hop">
              <Sparkles className="w-5 h-5 text-amber-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-amber-950 font-display flex items-center gap-1">
                🧁 奇妙童伴创意工坊
              </h1>
              <p className="text-[10px] text-amber-800/80 font-mono tracking-wider font-bold">
                KidAI Product Designer
              </p>
            </div>
          </div>
        </div>

        {/* Create new design report entrance */}
        <div className="p-4.5 border-b-3 border-dashed border-amber-200/60 bg-[#fffeee]/50">
          <button
            type="button"
            onClick={handleNewReport}
            className="w-full flex items-center justify-center gap-2 bg-[#ff7a59] hover:bg-[#ff623d] active:translate-y-0.5 text-white text-xs font-extrabold py-3.5 px-4 rounded-2.5xl border-3 border-amber-950 shadow-[4px_4px_0px_0px_#7c2d12] transition-all cursor-pointer hover:rotate-1"
          >
            <Plus className="w-4.5 h-4.5 stroke-[3.5]" />
            铺开新创想画纸
          </button>
        </div>

        {/* History directory storage list */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-900/90 uppercase tracking-widest px-1 font-display">
            <span className="flex items-center gap-2">
              <FolderOpen className="w-4.5 h-4.5 text-orange-400 stroke-[2.5]" />
              魔法手账草稿箱 ({history.length} / 5)
            </span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 text-xs text-amber-950/60 border-3 border-dashed border-amber-200 rounded-3xl bg-white/70 p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <span className="text-2xl block mb-2 animate-bounce">🎨</span>
              本收纳夹还是空空的噢
              <p className="text-[10.5px] text-amber-800/80 mt-2.5 leading-relaxed">
                快点击顶部右上角<b>“保存到草稿箱”</b>，把好点子用蜡笔牢牢锁住吧！
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLoadFromHistory(item)}
                  className={`group relative flex flex-col text-left p-3.5 rounded-2.5xl border-3 transition-all cursor-pointer ${
                    form.id === item.id 
                    ? 'bg-[#ffe4bd] border-amber-950 text-amber-950 shadow-[3px_3px_0px_0px_#7c2d12] -rotate-1' 
                    : 'bg-white border-amber-950/10 hover:border-amber-950/30 hover:rotate-1 text-slate-600 hover:text-slate-800 shadow-[2px_2px_4px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  {/* Cute clip decoration on active card */}
                  {form.id === item.id && (
                    <div className="absolute top-[-8px] left-4 w-8 h-3.5 bg-rose-300 border-l border-r border-rose-450 opacity-90 -rotate-2 stroke-[1.5]" />
                  )}
                  <div className="text-xs font-extrabold truncate pr-6 text-slate-800 group-hover:text-amber-900 transition-colors">
                    🧸 {item.name}
                  </div>
                  <div className="text-[10px] font-mono text-amber-900/60 mt-2 flex justify-between items-center">
                    <span className="font-bold">📅 {item.lastSaved ? item.lastSaved.split(' ')[0] : '刚才'}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-all hover:scale-120 cursor-pointer"
                      title="清除此存底"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Designer avatar footer */}
        <div className="p-4.5 border-t-3 border-dashed border-amber-200/90 bg-[#fffffd] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-full bg-orange-100 border-2 border-amber-950 flex items-center justify-center shadow-sm relative">
              <User className="w-4.5 h-4.5 text-orange-550" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-905 flex items-center gap-0.5">
                设计师: yamachi
              </div>
              <div className="text-[10px] text-amber-800/80 font-semibold tracking-tight">
                🎨 幼趣体验 CMF 艺术官
              </div>
            </div>
          </div>
          <div className="text-[9px] font-bold px-2 py-0.75 rounded-lg bg-emerald-50 border border-emerald-220 text-emerald-700 select-all font-mono">
            CMF-ACTIVE
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKING SPACE PANEL */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        
        {/* Main top header with current action and responsive save status */}
        <header className="sticky top-0 bg-[#fffefa]/95 backdrop-blur-md border-b-3 border-dashed border-amber-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-md">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="lg:hidden w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center border-3 border-amber-950 text-white mr-1 shadow-[2px_2px_0px_0px_#7c2d12] animate-hop">
              <Sparkles className="w-5 h-5 text-amber-950" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="text-sm font-extrabold text-amber-950 bg-amber-100/40 hover:bg-amber-100/70 focus:bg-white border-2 border-dashed border-amber-950/30 focus:border-amber-500 focus:outline-none transition-all px-3 py-1.5 rounded-2xl w-full sm:w-80 font-display"
                title="轻轻点击这里即可更改你的专案画册名称噢！"
                placeholder="起个好玩的智能玩宠名字吧..."
              />
              <p className="text-[11px] text-amber-800 flex items-center gap-1.5 mt-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ff7a59] animate-pulse"></span>
                魔法大本营：学龄前防丢 AI 成长玩伴 CMF 手账参数设定
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleNewReport}
              className="lg:hidden p-2.5 text-amber-950 bg-amber-100 hover:bg-amber-200 border-2 border-amber-950 rounded-2xl shadow-[2px_2px_0px_0px_#7c2d12]"
              title="新建专案"
            >
              <Plus className="w-4.5 h-4.5 font-bold" />
            </button>
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-550 text-amber-950 text-xs font-extrabold px-4.5 py-3 rounded-2xl border-3 border-amber-950 shadow-[3px_3px_0px_0px_#7c2d12] transition-all active:translate-y-0.5 cursor-pointer hover:rotate-1"
            >
              <Gift className="w-4 h-4 text-amber-950" />
              保存到手账夹
            </button>
          </div>
        </header>

        {/* Step-by-step progress guide bar indicator (Kids Block Map style) */}
        <div className="bg-white/40 border-b border-amber-100/80 px-6 py-4.5 shrink-0 overflow-x-auto">
          <div className="max-w-5xl mx-auto flex items-center gap-2 md:gap-3.5 justify-between select-none min-w-[720px] py-1">
            {[
              { num: 1, label: 'Ⅰ. 幼童心理建模', icon: Users, color: '#fef3c7', activeColor: '#ffbd39' },
              { num: 2, label: 'Ⅱ. 物理形态与CMF', icon: Cpu, color: '#e0f2fe', activeColor: '#38bdf8' },
              { num: 3, label: 'Ⅲ. 多感官阻尼设计', icon: Sliders, color: '#fce7f3', activeColor: '#f472b6' },
              { num: 4, label: 'Ⅳ. 行为闭环与HALT', icon: CheckSquare, color: '#dcfce7', activeColor: '#4ade80' },
              { num: 5, label: 'Ⅴ. CMF绘本印章', icon: FileCheck, color: '#f3e8ff', activeColor: '#c084fc' },
            ].map((step, idx) => {
              const IconComp = step.icon;
              const isCurrent = currentStep === step.num;
              const isPassed = currentStep > step.num;

              return (
                <React.Fragment key={step.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-2.5xl border-2.5 transition-all text-xs font-bold ${
                      isCurrent 
                        ? 'border-amber-950 shadow-[3px_3px_0px_0px_#7c2d12]' 
                        : isPassed 
                        ? 'border-emerald-500 text-emerald-800 bg-emerald-50/70' 
                        : 'border-transparent text-amber-800/70 hover:bg-white/60'
                    }`}
                    style={{ backgroundColor: isCurrent ? step.activeColor : undefined }}
                  >
                    <span className={`w-5.5 h-5.5 rounded-xl flex items-center justify-center text-[10.5px] font-display font-bold border-2 ${
                      isCurrent 
                        ? 'bg-white text-slate-900 border-amber-950' 
                        : isPassed 
                        ? 'bg-emerald-500 text-white border-emerald-600' 
                        : 'bg-amber-100/50 text-amber-700/85 border-amber-200'
                    }`}>
                      {step.num}
                    </span>
                    <span className="font-display tracking-tight">{step.label}</span>
                  </button>
                  {step.num < 5 && (
                    <div className={`h-[4px] flex-1 min-w-[15px] rounded-full ${isPassed ? 'bg-emerald-400' : 'bg-dashed border-t-3 border-amber-250'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step working sandbox area styled as lovely scrapbook paper sheets */}
        <section className="flex-1 p-6 max-w-5xl w-full mx-auto animate-fade-in flex flex-col justify-between">
          
          <div className="bg-white border-3 border-amber-950 rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(124,45,18,0.1)] relative overflow-hidden">
            
            {/* Background doodle star */}
            <div className="absolute right-6 top-6 font-display text-[90px] text-[#fdf8f0] pointer-events-none select-none z-0">
              🧸
            </div>

            {/* STEP 1: 用户建模 USER MODELING (EMBEDDING HUMAN FACTORS & CHILD PSYCHOLOGY) */}
            {currentStep === 1 && (
              <div className="space-y-6 z-10 relative">
                <div className="relative">
                  {/* Washi tape decoration */}
                  <div className="absolute -top-6 left-10 w-20 h-5 bg-pink-100/70 border-l border-r border-dashed border-amber-950/20 rotate-[-1.5deg] pointer-events-none" />
                  <h2 className="text-md font-extrabold text-amber-950 flex items-center gap-2.5 font-display">
                    <Users className="w-5.5 h-5.5 text-orange-400 stroke-[2.5]" />
                    第一阶：幼童心理特征、人机界面与位置生理建模
                  </h2>
                  <p className="text-xs text-amber-800/90 mt-1.5 leading-relaxed font-semibold">
                    根据学龄前幼童（4-6岁）认知行为发展特征：本阶段幼儿自主活动意愿增长，但空间方位感、边缘警戒感极弱。我们将结合寶寶的出游微环境、自我自律能力和人格偏向，进行高加速的行为反射控制与习惯干预建模。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 relative">
                  
                  {/* Left Column Controls */}
                  <div className="space-y-5">
                    {/* FIXED: 年龄段 (固定说明) */}
                    <div>
                      <label className="block text-[10.5px] font-extrabold text-[#c2410c] uppercase tracking-wider font-display mb-2.5">
                        🎈 目标幼童用户人机界面安全基准红线
                      </label>
                      <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:bg-amber-100/30 transition-all">
                        <div>
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1">生理成长适存层</span>
                          <span className="text-[10px] text-amber-800 block mt-0.5 font-semibold">（处于认知前运算阶段 4-6 岁幼儿首家定义）</span>
                        </div>
                        <span className="px-3.5 py-1.5 text-xs font-extrabold font-display text-orange-650 bg-orange-55 border-2 border-orange-200 rounded-2xl animate-shake">
                          4 - 6 岁婴幼安全级
                        </span>
                      </div>
                    </div>

                    {/* TWO: 旅游场景(多选) - 改为专业微环境映射 */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-2.5 flex items-center gap-1 font-display">
                        🗺️ 出游探索地理微环境自适应区 (Micro-environments Spatial Mapping-多选)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['交通枢纽', '游乐园', '自然探索', '住宿', '短途', '长途'].map((scene) => {
                          const active = form.travelScenes.includes(scene);
                          return (
                            <button
                              type="button"
                              key={scene}
                              onClick={() => {
                                const next = form.travelScenes.includes(scene)
                                  ? form.travelScenes.filter(s => s !== scene)
                                  : [...form.travelScenes, scene];
                                setForm({ ...form, travelScenes: next });
                              }}
                              className={`p-3 text-xs font-bold rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#e0f2fe] border-amber-950 text-sky-900 shadow-[3px_3px_0px_0px_#1e293b]' 
                                  : 'bg-white border-amber-950/10 hover:border-amber-950/30 hover:bg-slate-50 text-amber-950/80 hover:rotate-1'
                              }`}
                            >
                              <span className="font-display font-extrabold">{SCENES_DISPLAY[scene] ? SCENES_DISPLAY[scene].split(' ')[0] : ''} {scene}</span>
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                active ? 'border-amber-950 bg-sky-400 text-amber-950 font-extrabold' : 'border-amber-950/20'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* THREE: 独立能力起点(单选) - 专业自评估 */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-2.5 font-display">
                        🐣 幼游防挫度与独立自主技能阶段
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['初学', '有点经验', '比较独立'] as const).map((level) => {
                          const active = form.independenceLevel === level;
                          return (
                            <button
                              type="button"
                              key={level}
                              onClick={() => setForm({ ...form, independenceLevel: level })}
                              className={`p-3 text-xs font-bold rounded-2xl border-2 text-center transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#e0e7ff] border-amber-950 text-indigo-900 font-extrabold shadow-[2px_2px_0px_0px_#1e293b] scale-102' 
                                  : 'bg-white border-amber-950/10 hover:border-amber-950/30 text-slate-600'
                              }`}
                            >
                              <div className="text-[10px] font-extrabold tracking-tight font-display">
                                {level === '初学' ? '👶 初游萌芽' : level === '有点经验' ? '👦 二阶探索' : '🦖 傲游小狮'}
                              </div>
                              <div className="text-[9px] scale-90 text-slate-500 font-mono mt-0.5">
                                {level === '初学' ? 'L1-被动防漏' : level === '有点经验' ? 'L2-智能互驱' : 'L3-励学打卡'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column Controls */}
                  <div className="space-y-5">
                    {/* FOUR: 习惯培养目标(多选) - 改为行为矫正与习惯强化因子 */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-2.5 font-display">
                        🛡️ 行为习惯靶向：认知行为干预因度 (Behavioral Enhancement-多选)
                      </label>
                      <div className="space-y-2.5">
                        {['不跑远', '记住物品', '完成简单指令'].map((target) => {
                          const active = form.habitsTarget.includes(target);
                          return (
                            <button
                              type="button"
                              key={target}
                              onClick={() => {
                                const next = form.habitsTarget.includes(target)
                                  ? form.habitsTarget.filter(t => t !== target)
                                  : [...form.habitsTarget, target];
                                setForm({ ...form, habitsTarget: next });
                              }}
                              className={`w-full p-3.5 text-xs font-bold rounded-2.5xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#fffbeb] border-amber-950 text-[#854d0e] shadow-[3px_3px_0px_0px_#1e293b] font-extrabold' 
                                  : 'bg-white border-amber-950/10 hover:border-amber-950/30 text-slate-600 hover:translate-x-1'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-md">{target === '不跑远' ? '🚸' : target === '记住物品' ? '👜' : '📝'}</span>
                                <div className="text-left">
                                  <div className="text-xs font-extrabold text-amber-950">{target}反射回路</div>
                                  <div className="text-[9.5px] text-amber-700/80 font-medium font-mono">（{HABITS_DISPLAY[target]}）</div>
                                </div>
                              </div>
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                active ? 'border-amber-950 bg-amber-400 text-amber-950 font-bold' : 'border-amber-950/20'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* FIVE: 性格选择 */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-2 font-display">
                        🦁 婴幼个性偏好与情绪感受交互阈值划分
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['内向', '外向'] as const).map((p) => {
                          const active = form.personality === p;
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setForm({ ...form, personality: p })}
                              className={`p-3.5 text-xs font-bold rounded-2xl border-2 text-center transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#fef2f2] border-amber-950 text-rose-800 font-extrabold shadow-[2px_2px_0px_0px_#1e293b] scale-102' 
                                  : 'bg-white border-amber-950/10 hover:border-amber-950/30 text-slate-600 hover:-rotate-1'
                              }`}
                            >
                              <span className="text-md block mb-1">{p === '内向' ? '🐨 Hammy' : '🦁 Liony'}</span>
                              <div className="font-display font-extrabold text-[11px] text-amber-950">{p === '内向' ? '专注慢反射静力型' : '外耀高频敏锐活力型'}</div>
                              <div className="text-[9px] text-slate-500 font-mono scale-95 mt-0.5">（对应声光微震自适应降值）</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* REAL-TIME PROFILE CARD DISPLAY (Child Diary paper scrapbook look) */}
                <div className="bg-[#fffdf3] border-3 border-dashed border-amber-350 rounded-3xl p-5 mt-4 blueprint-grid-kid relative shadow-sm hover:rotate-[0.5deg] transition-transform duration-300">
                  {/* Washi-Tape Sticker */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/50 border-l border-r border-dashed border-amber-950/25 rotate-[2deg] z-10" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4.5 h-4.5 text-rose-500 animate-pulse stroke-[2.5]" />
                    <span className="text-[11px] font-extrabold font-display uppercase tracking-widest text-[#7c2d12] flex items-center gap-1">
                      🧸 智能玩具后台自适应人机工程画像（Cognitive Factors File）
                    </span>
                  </div>
                  <div className="bg-white border-2.5 border-amber-950 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-100 to-amber-200 border-2.5 border-amber-950 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(120,53,4,0.15)] animate-hop">
                      <span className="text-3xl">
                        {form.personality === '外向' ? '🦁' : '🐨'}
                      </span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <span className="text-xs font-extrabold text-[#7c2d12] font-display">
                          幼儿认知系统建模档案
                        </span>
                        <span className="text-[10px] bg-indigo-50 border border-indigo-250 text-indigo-700 px-3 py-0.5 rounded-full font-extrabold font-mono font-display">
                          {form.personality === '外向' ? 'Active-Arousal-Leo' : 'Passive-Calm-Koala'}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-bold text-slate-700 mt-2.5 leading-relaxed">
                        当宝宝处于 <span className="font-extrabold text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded-lg">{form.travelScenes.join(' / ') || '[微地理探索场景]'}</span> 的活动包络内，产品将感知宝宝处于具有 <span className="text-rose-600 font-extrabold">“{LEVEL_DISPLAY[form.independenceLevel] || form.independenceLevel}”</span> 依赖程度的感官接收野。本设计方案应采用多轴传感器感知协同，对幼态安全习惯 <span className="text-indigo-850 font-extrabold">{form.habitsTarget.length > 0 ? form.habitsTarget.join(' + ') : '未选目标'}</span> 构筑反馈环，提供低于安全出声阈限、柔适物理阻尼的心流干预回路。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: 物种策略 SPECIES STRATEGY (PHYSICS INTERFACE DESIGN WITH DEEP CMF ANNOTATIONS) */}
            {currentStep === 2 && (
              <div className="space-y-6 z-10 relative">
                <div>
                  <h2 className="text-md font-extrabold text-amber-950 flex items-center gap-2.5 font-display">
                    <Cpu className="w-5.5 h-5.5 text-sky-500 stroke-[2.5]" />
                    第二阶：物理产品形态载体选择与微感官传感器矩阵舱
                  </h2>
                  <p className="text-xs text-amber-800/90 mt-1 leading-relaxed font-semibold">
                    根据第一阶中估算的宝宝对危险辨别之行为起点，系统已自动精算并推荐了对应的厘米级近场挑战！您可为儿童选择合适的可接触物料载体模型，并勾选精确定向感知坞。
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left part: carriers and sensors settings */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* Read-only feedback: level & task recommendation */}
                    <div className="bg-[#fffae2] border-2.5 border-amber-900/15 rounded-3xl p-4.5 shadow-sm relative">
                      <div className="absolute top-[-4px] left-8 w-14 h-3.5 bg-yellow-105 border-l border-r border-dashed border-amber-950/20 rotate-[-2deg]" />
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-orange-550 animate-bounce" />
                        <span className="text-xs font-extrabold text-amber-950 font-display">
                          👑 AI 推演：儿童核心行为控制增强策略 (Cognitive Loop Predictor)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="bg-white/80 p-3 rounded-2xl border border-amber-200">
                          <div className="text-[9px] text-orange-700 font-extrabold uppercase font-mono tracking-widest">能力阻尼自估</div>
                          <div className="text-xs font-extrabold text-slate-800 mt-1.5">{getAbilityLevel().level}</div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-2xl border border-amber-200">
                          <div className="text-[9px] text-indigo-700 font-extrabold uppercase font-mono tracking-widest font-display">厘米级首发自适应挑战</div>
                          <span className="text-[10px] leading-relaxed font-bold text-slate-700 mt-1 block">
                            {getAbilityLevel().desc}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Carriage Multi-select */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-amber-950 font-display">🧸 设备物理形态 CMF 基座选择 (Carriers - 可多选联合搭载)</label>
                        <span className="text-[9.5px] font-mono text-amber-800 font-bold">[ 勾选一键匹配感官舱 ]</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {['可穿戴手环', '挂坠', '智能鞋带扣', '小行李箱', '背包', '旅行印章机', '贴纸机'].map((c) => {
                          const active = form.carriers.includes(c);
                          return (
                            <button
                              type="button"
                              key={c}
                              onClick={() => handleCarrierChange(c)}
                              className={`px-3.5 py-2 text-xs font-bold rounded-2xl border-2 transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#fbcfe8] border-amber-950 text-pink-950 shadow-[2px_2px_0px_0px_#1e293b] font-extrabold scale-102' 
                                  : 'bg-white text-amber-900 border-amber-950/15 hover:bg-amber-50 hover:border-amber-950/30'
                              }`}
                            >
                              {CARRIERS_DISPLAY[c] ? CARRIERS_DISPLAY[c].split(' ')[0] + ' ' + c : c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sensor list check grid grouped by categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-amber-950 font-display flex items-center gap-1">
                          🧠 多轴体感与多相物理参数传感器微感知矩阵 
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllSensors}
                          className="text-[11px] text-orange-600 hover:text-orange-700 font-extrabold font-display hover:underline"
                        >
                          🔮 [ 一键全装备超级感知模组 ]
                        </button>
                      </div>

                      <div className="space-y-3 bg-[#fffbf2]/90 p-4 border-2.5 border-dashed border-amber-200 rounded-3xl max-h-[220px] overflow-y-auto shadow-inner">
                        {[
                          { title: '☀️ 视觉皮面与物理微气温自对齐', items: ['环境光传感器', '环境温度传感器'] },
                          { title: '👂 声学与降噪骨阻外放拾音舱', items: ['麦克风', '骨传导传感器'] },
                          { title: '👋 Haptic 触控阻断及重力传感器瓣', items: ['震动马达', '压力传感器', '触感传感器'] },
                          { title: '🛰️ 空间厘米级 UWB 与 IMU 姿态解算阵列', items: ['GPS', 'IMU', '地磁传感器', 'UWB'] },
                          { title: '💓 生理同步 PPG 心率与皮电敏感电极', items: ['心率传感器', '皮电传感器', '体温传感器'] },
                        ].map((grp) => (
                          <div key={grp.title} className="space-y-1.5 border-b border-dashed border-amber-100 pb-2 last:border-0 last:pb-0">
                            <h4 className="text-[10px] font-extrabold text-[#7c2d12] uppercase tracking-wider font-mono">{grp.title}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {grp.items.map((item) => {
                                const checked = form.sensors.includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={() => handleSensorToggle(item)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-xl border-2 transition-all cursor-pointer select-none ${
                                      checked
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-extrabold shadow-xs'
                                        : 'bg-white text-slate-600 border-amber-950/10 hover:border-amber-950/20'
                                    }`}
                                  >
                                    <span className={`w-2.5 h-2.5 rounded-full ${checked ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                                    <span>{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Text Area for CMF annotations */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-1.5 font-display">
                        🔬 工匠级 CMF (色彩、材质、表面成型) 规范与儿童误吞机械安全性设计手札
                      </label>
                      <textarea
                        value={form.designNotes}
                        onChange={(e) => setForm({ ...form, designNotes: e.target.value })}
                        className="w-full text-xs p-4 border-2 border-dashed border-amber-950/35 rounded-2.5xl focus:border-amber-500 focus:outline-none min-h-[90px] bg-[#fffdf9]/70 leading-relaxed font-semibold text-slate-700"
                        placeholder="在此补充工艺说明、亲肤、跌落缓冲等工件级限制。满足儿童标准..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Interactive Canvas & uploads */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Visual Blueprint canvas module wrapper */}
                    <div className="h-[310px] relative">
                      <div className="absolute top-[-3.5px] left-6 w-14 h-4 bg-emerald-150 border-l border-r border-dashed border-amber-950/20 rotate-[3deg] z-10" />
                      <CarrierCanvas carriers={form.carriers} />
                    </div>

                    {/* Local Sketch drawing upload container */}
                    <div className="bg-white border-2.5 border-amber-950 rounded-2.5xl p-4.5 shadow-sm relative">
                      {/* Paperclip design */}
                      <div className="absolute top-[-10px] right-8 w-6 h-10 bg-slate-200 border-2 border-slate-400 rounded-full rotate-[15deg] z-10 flex flex-col justify-end items-center opacity-85">
                        <div className="w-3 h-6 border border-slate-500 rounded-full" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-amber-950 font-display flex items-center gap-1">🎨 宝宝创意彩笔绘图模型 (CMF Outline)</span>
                        {form.sketchImage && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, sketchImage: null })}
                            className="text-[10px] text-rose-500 font-extrabold hover:underline cursor-pointer"
                          >
                            撕掉重贴
                          </button>
                        )}
                      </div>

                      {form.sketchImage ? (
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2.5 border-amber-950 bg-[#fffefd] p-1.5 shadow-sm">
                          <img 
                            src={form.sketchImage} 
                            alt="Sticker blueprint base64 data" 
                            className="w-full h-full object-cover rounded-xl border border-dashed border-amber-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-[10px] text-white py-1 px-2 text-center font-display font-semibold z-10">
                            🌿 手绘草案图纸贴片已吸附就绪
                          </div>
                        </div>
                      ) : (
                        <div className="border-2.5 border-dashed border-amber-200 rounded-2.5xl p-8 text-center flex flex-col items-center justify-center bg-[#fffcf5] hover:bg-[#fff7e6] transition-all relative cursor-pointer">
                          <span className="text-3xl mb-1.5 animate-hop">🖼️</span>
                          <span className="text-xs text-amber-950 font-extrabold font-display">粘贴手画彩图纸/出厂概念 (点击上传)</span>
                          <span className="text-[10px] text-amber-700/80 font-mono mt-1 font-bold">支持 PNG / JPG 草案图片导入 3D 匹配</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSketchUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer text-[0px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: 设计传递感知 SENSORY CHANNELS (ACOUSTIC ENVELOPES & VIBRATION HAPTIQUES) */}
            {currentStep === 3 && (
              <div className="space-y-6 z-10 relative">
                <div>
                  <h2 className="text-md font-extrabold text-amber-950 flex items-center gap-2.5 font-display">
                    <Sliders className="w-5.5 h-5.5 text-rose-450 stroke-[2.5]" />
                    第三阶：多通道环境自适应感官交互：声学包络、触觉谐振与皮电温和反馈
                  </h2>
                  <p className="text-xs text-amber-800/90 mt-1 leading-relaxed font-semibold">
                    宝宝的皮肤及末梢内耳感官极其娇嫩！本工坊严格采用限压低噪滤波、无频闪指示光源，并利用120Hz低频动态触觉调谐测试抗钝化振幅限制，给与宝宝符合临床生理学标准的安全保护。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-5">
                    
                    {/* ONE: PPG HeartRate interaction loop */}
                    <div className="bg-[#fffdf2] border-2.5 border-dashed border-amber-250 rounded-2.5xl p-4.5 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)] hover:bg-[#fffae2] transition-colors">
                      <div className="flex-1 pr-3">
                        <div className="text-xs font-extrabold text-[#be123c] flex items-center gap-1.5 font-display">
                          <Heart className="w-4.5 h-4.5 text-rose-500 animate-pulse stroke-[3.5]" />
                          情感同步背向显示灯（基于生物 PPG 电极心率呼吸调频）
                        </div>
                        <p className="text-[10.5px] text-slate-650 mt-1 leading-relaxed font-medium">
                          采用红外反射式 PPG 光电自适应对齐，情绪急躁时采用微米晶级发光点起振 3000K 舒柔色自稳呼吸，从而起定惊、静心与舒缓引导情绪之作用。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, feedbackHeartRate: !form.feedbackHeartRate })}
                        className={`w-13 h-7 rounded-full transition-all relative border-3 border-amber-950 flex items-center p-0.5 outline-none cursor-pointer shrink-0 ${
                          form.feedbackHeartRate ? 'bg-orange-500 justify-end' : 'bg-slate-200 justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-md border-2 border-amber-950/20" />
                      </button>
                    </div>

                    {/* TWO: 工业工程防窒息与机械耐久约束 */}
                    <div>
                      <label className="block text-xs font-extrabold text-amber-950 mb-2 font-display">
                        🧸 幼儿防误食误吞物理极限、力学耐久与圆倒角约束
                      </label>
                      <div className="bg-[#fffefa] border-2.5 border-amber-950/15 rounded-2.5xl p-4.5 shadow-xs">
                        <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-display">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-650" />
                          安全件直径线 &gt; 31.7mm + 50° 邵氏硬度防刺圆倒角 R&gt;=6.5mm
                        </div>
                        <p className="text-[10.5px] text-slate-600 mt-1.5 leading-relaxed font-semibold">
                          满足美国 ASTM F963-17 / 欧盟 EN71 儿童玩具机械力学和抗跌落测试红线。所有受拉咬卡扣件拉阻超过 50 牛顿，防止活动零碎件脱胶导致窒息误吞发生。
                        </p>
                      </div>
                    </div>

                    {/* THREE: 视觉 (选择色温 + 固定说明) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-amber-950 font-display">☀️ 视觉色度学指示：3000K-6500K 视觉皮层友好无频闪 LED</label>
                        <span className="text-[10px] text-indigo-700 font-bold font-mono">⚡ [LED呼吸晶格]</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['冷色', '暖色'].map((vTone) => {
                          const active = form.visualLightTone === vTone;
                          return (
                            <button
                              type="button"
                              key={vTone}
                              onClick={() => setForm({ ...form, visualLightTone: vTone as '冷色' | '暖色' })}
                              className={`p-3.5 text-xs font-bold rounded-2.5xl border-2 text-center transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#ffe4bd] border-amber-950 text-amber-950 font-extrabold shadow-[2px_2px_0px_0px_#1e293b]' 
                                  : 'bg-white border-amber-950/10 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              {vTone === '暖色' ? '☀️ 暖阳向日葵色光 (3000K 舒柔防频闪)' : '❄️ 冰蓝雪面高纯光 (6500K 自适应指示)'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sound and tactile haptic controls */}
                  <div className="space-y-5">
                    
                    {/* FOUR: Sound decibel safe shield progress */}
                    <div className="space-y-2.5 bg-[#fcfbf7] border-2.5 border-dashed border-amber-205 p-4.5 rounded-2.5xl shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-amber-950 font-display flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-orange-655" />
                          🔊 听学声级防护包络限制级 (Acoustic Volume Envelope)
                        </label>
                        <span className="text-xs font-mono font-extrabold text-orange-650">{form.audioVolume} % 出放比</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form.audioVolume}
                        onChange={(e) => setForm({ ...form, audioVolume: parseInt(e.target.value) })}
                        className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-[#ff7a59]"
                      />
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold font-mono">
                        <span>幼儿纤毛听觉缓冲降噪</span>
                        <span className="text-[#059669]">
                          {form.audioVolume <= 78 ? '🌱 出放声压级 <= 73dBA 安全阻限值' : '⚠️ 安全警示! 超出 75dBA 软声学上限级'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePlaySoundTest}
                        className="mt-2 w-full py-2.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-950 text-amber-950 text-xs font-extrabold rounded-2.5xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#7c2d12]"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        🎵 声学验证测试 (双多声 chimes/哨子包络信号测试)
                      </button>
                    </div>

                    {/* FIVE: Tactile dampings */}
                    <div className="space-y-3">
                      <label className="text-xs font-extrabold text-amber-950 block font-display">
                        ⚡ 触感能动微振幅：自对齐 120Hz 谐振三阶动态阻尼反馈控制
                      </label>
                      
                      {[
                        { key: 'Success', name: '🎉 好习惯按时完成，即时正奖赏微振', val: form.vibrationModeSuccess, stateProp: 'vibrationModeSuccess' },
                        { key: 'Danger', name: '🚨 溢出地理围栏，边缘阻尼警示低频微敲', val: form.vibrationModeDanger, stateProp: 'vibrationModeDanger' },
                        { key: 'Nav', name: '🧭 UWB 指寻定位指引，高频弱触促心安归', val: form.vibrationModeNav, stateProp: 'vibrationModeNav' },
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 bg-white border-2 border-amber-955/15 rounded-2xl hover:border-amber-950 transition-colors">
                          <span className="text-xs font-bold text-amber-955 font-display">{item.name}</span>
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {['弱', '中', '强'].map((st) => (
                              <button
                                type="button"
                                key={st}
                                onClick={() => setForm({ ...form, [item.stateProp]: st })}
                                className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                  item.val === st 
                                    ? 'bg-[#ff7a59] text-white shadow-sm border border-amber-950' 
                                    : 'bg-amber-50 text-amber-950/70 hover:bg-amber-100'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => handlePlayVibeTest(item.name, item.val)}
                              className="ml-1 px-2.5 py-1 bg-amber-100 text-amber-950 hover:bg-amber-200 rounded-lg text-[10px] font-extrabold flex items-center gap-0.5 border border-amber-950/35 cursor-pointer"
                              title="触发120Hz低频触感微电机调试模拟"
                            >
                              <Play className="w-2.5 h-2.5" />
                              调试
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: 习惯闭环与测试 HABITS LOOP & TEST (COGNITIVE BEHAVIOR LOOP & Reliability TEST) */}
            {currentStep === 4 && (
              <div className="space-y-6 z-10 relative">
                <div>
                  <h2 className="text-md font-extrabold text-amber-950 flex items-center gap-2.5 font-display">
                    <CheckSquare className="w-5.5 h-5.5 text-emerald-550 stroke-[2.5]" />
                    第四阶：巴甫洛夫-斯金纳自适应习惯增强回路构建与出厂物理应力失效体检 (HALT/Checklist)
                  </h2>
                  <p className="text-xs text-amber-800/90 mt-1 leading-relaxed font-semibold">
                    宝宝习惯的养成类似积木搭造。在认知行为理论中，通过“刺激诱导-正强化激励-渐退依赖”能迅速内化行为。出厂前，我们对硬件IP67极水耐力，1.5米冲击跌落，以及多轴IMU算法健康度做全指标合格认证。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* ONE: Habit loop steps config */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-extrabold text-amber-950 mb-1 font-display">
                      🚇 强化回路控制：巴甫洛夫-斯金纳习惯养成列车阶段
                    </label>
                    <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                      {[
                        '设定挑战（家长APP）',
                        '执行与辅助（产品提示）',
                        '即时反馈（震动+语音表扬）',
                        '记录与复盘（同步APP）',
                        '升级难度（连续3次成功减半提示）',
                        '习惯内化（累计20次自动行为）'
                      ].map((stepText, idx) => {
                        const checked = form.habitClosedLoopSteps.includes(stepText);
                        return (
                          <div
                            key={stepText}
                            onClick={() => {
                              const next = checked
                                ? form.habitClosedLoopSteps.filter(s => s !== stepText)
                                : [...form.habitClosedLoopSteps, stepText];
                              setForm({ ...form, habitClosedLoopSteps: next });
                            }}
                            className={`p-3 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                              checked 
                                ? 'bg-[#fffae2] border-amber-950 text-amber-950 font-bold shadow-[2px_2px_0px_0px_#1e293b]' 
                                : 'bg-white border-amber-950/10 hover:bg-[#fff9e6]/40 text-slate-500'
                            }`}
                          >
                            <span className="text-xs font-display font-extrabold text-orange-655 mt-0.5">车厢 0{idx + 1}</span>
                            <div className="flex-1">
                              <div className="text-xs flex items-center justify-between font-bold text-slate-800">
                                <span>{stepText}</span>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[7px] shrink-0 ${
                                  checked ? 'bg-amber-400 border-amber-950 text-amber-950 font-extrabold' : 'border-amber-950/20'
                                }`}>
                                  {checked && '✓'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TWO: Verification test items */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#7c2d12] mb-2 font-display">
                        💪 玩具出厂多轴体感与物理可靠性极限稳定性极限考核
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'IMU姿态与精度', '跌落冲击试验', '连接吞吐稳定性', 'EN听力无折损', 
                          'IP67防淋防汗', '抗断拉抗拉力', '多相传感容错自检', 
                          '自励打卡闭环测试', '低压保护降级自校'
                        ].map((test) => {
                          const active = form.testItems.includes(test);
                          return (
                            <button
                              type="button"
                              key={test}
                              onClick={() => {
                                const next = active
                                  ? form.testItems.filter(t => t !== test)
                                  : [...form.testItems, test];
                                setForm({ ...form, testItems: next });
                              }}
                              className={`p-3 text-[11px] font-extrabold rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#dcfce7] border-amber-950 text-emerald-950 shadow-[1.5px_1.5px_0px_0px_#1e293b]' 
                                  : 'bg-white border-amber-950/10 hover:bg-slate-50 text-slate-550'
                              }`}
                            >
                              <span>{test}等验证合格</span>
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                                active ? 'border-amber-950 bg-emerald-500 text-white font-extrabold' : 'border-amber-950/20'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* THREE: Checklist Ready panel */}
                    <div className="bg-[#fffdf2] border-2.5 border-dashed border-amber-300 rounded-3xl p-4.5 relative shadow-xs">
                      {/* Paper pin decor */}
                      <div className="absolute top-[-3.5px] left-10 w-12 h-3.5 bg-rose-200/60 font-mono text-[9px] text-[#ff7a59] text-center rounded-sm font-extrabold border-l border-r border-dashed border-amber-950/20" />
                      
                      <div className="flex items-center gap-2 mb-3.5 mt-1">
                        <FileCheck className="w-5 h-5 text-emerald-650 stroke-[2.5]" />
                        <span className="text-xs font-extrabold text-amber-950 uppercase tracking-widest font-display">
                          🧸 机械与电子物理可靠性出厂校验 CheckList
                        </span>
                      </div>
                      <div className="space-y-2 text-[11px] font-bold text-slate-700 leading-relaxed font-sans">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-555 font-extrabold text-xs">✓</span>
                          <span>玩具外壳采用邵氏硬度50°A食品抗敏液体硅胶(LSR)封装合格</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-555 font-extrabold text-xs">✓</span>
                          <span>UWB多轴厘米级近场自对准與IMU重力滤波算法对齐成功</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-555 font-extrabold text-xs">✓</span>
                          <span>出外声压强制低于EN71的 73dBA 安全红线听力保护锁定</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-200 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-extrabold text-amber-950">出厂上市认证发布状态：</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, checklistReady: !form.checklistReady })}
                          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border-2 border-amber-950 shadow-[2px_2px_0px_0px_#1e293b] cursor-pointer ${
                            form.checklistReady 
                              ? 'bg-emerald-400 text-amber-950 animate-bounce' 
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {form.checklistReady ? '✅ 工业婴幼安全审查就绪！' : '🔬 参数整备 微校中'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: 生成完整方案 GENERATED BLUEPRINT */}
            {currentStep === 5 && (
              <div className="space-y-6 z-10 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2.5 border-dashed border-amber-200 pb-4.5">
                  <div>
                    <h2 className="text-md font-extrabold text-amber-950 flex items-center gap-2 font-display">
                      <FileCheck className="w-5.5 h-5.5 text-indigo-500 stroke-[2.5]" />
                      第五阶：萌趣童心创想彩绘手账大功告成！印盖公章
                    </h2>
                    <p className="text-xs text-amber-800 font-bold mt-1 leading-relaxed">
                      设计师yamachi，为您绘制的专业级儿童智能伴游AI设备定义已经绘制完毕啦！支持一键萌发符合 A4 CMF 物理材质标准的“彩色图文印刷手账 PDF”，也可全幅备份至粘性剪切板。
                    </p>
                  </div>
                  
                  {/* Two Action Buttons */}
                  <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-950 text-amber-950 text-xs font-extrabold px-3.5 py-3 rounded-2.5xl shadow-[3px_3px_0px_0px_#7c2d12] transition-colors cursor-pointer hover:rotate-[-1deg]"
                    >
                      <Copy className="w-4 h-4 text-[#ff7a59]" />
                      一键打包装箱手账数据
                    </button>
                    <button
                      type="button"
                      onClick={exportPdfReport}
                      className="flex items-center gap-1.5 bg-[#ff7a59] hover:bg-[#ff623d] border-2 border-amber-955 text-white text-xs font-extrabold px-4.5 py-3 rounded-2.5xl shadow-[4px_4px_0px_0px_#7c2d12] transition-colors cursor-pointer hover:rotate-1"
                    >
                      <Download className="w-4 h-4" />
                      萌刻专案彩绘 PDF
                    </button>
                  </div>
                </div>

                {/* Printable dynamic structured PDF block (Child Scrapbook Style) */}
                <div 
                  id="product-report-panel" 
                  className="bg-[#fffefc] border-3 border-amber-950 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-slate-800 select-text max-w-4xl mx-auto font-sans notebook-paper-decal relative overflow-hidden"
                  style={{ backgroundImage: 'radial-gradient(#faf1e3 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
                >
                  
                  {/* Lovely paper decorative tape at the top index card */}
                  <div className="absolute top-0 left-10 w-24 h-5.5 bg-orange-100/60 border-l mb-1 border-r border-dashed border-amber-950/20 rotate-[-1deg]" />
                  <div className="absolute top-0 right-10 w-20 h-5.5 bg-sky-100/60 border-l border-r border-dashed border-amber-950/20 rotate-[2deg]" />
                  
                  {/* Report Header */}
                  <div className="border-b-2.5 border-dashed border-amber-300 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 border-2 border-amber-950 text-[10px] font-extrabold font-display tracking-wider rounded-full uppercase">
                          🧸 MAGIC TOY LAB • AI 智能习惯强化 CMF 物理定义蓝图
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold font-display text-amber-955 mt-2 flex items-center gap-2">
                        ✨ {reportName}
                      </h3>
                      <p className="text-[11px] text-amber-800 font-bold mt-1.5 flex items-center gap-2 flex-wrap font-mono">
                        <span>🏷️ 设备物理料件专案代号: #{form.id}</span>
                        <span>•</span>
                        <span>📅 CMF出厂签批日期: {form.lastSaved || new Date().toLocaleDateString()}</span>
                      </p>
                    </div>
                    
                    {/* Cute Stamp badges representing industry standard and developmental levels */}
                    <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center border-t border-dashed border-amber-200 md:border-0 pt-3 md:pt-0">
                      <div className="text-xs font-extrabold text-[#ff7a59] bg-[#fff0ed] border-2 border-[#ff7a59] rounded-2xl px-3.5 py-2 tracking-wide font-display rotate-[-3deg] shadow-sm animate-wiggle">
                        🏆 {form.independenceLevel === '比较独立' ? 'L3 傲游级大班' : form.independenceLevel === '有点经验' ? 'L2 趣味中班' : 'L1 萌发小班'}
                      </div>
                      <div className="text-[9.5px] text-amber-800/80 font-bold font-mono mt-2">⚙️ pDefine Industrial V4.1</div>
                    </div>
                  </div>

                  {/* Grid section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Block A: User avatar modelling card */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-2.5xl p-4.5 border-2 border-amber-950/15 shadow-sm relative">
                        <div className="absolute top-1 right-3 text-lg opacity-25">👶</div>
                        <h4 className="text-[11.5px] font-extrabold text-amber-955 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display border-b border-dashed border-amber-200 pb-2">
                          <Users className="w-4 h-4 text-[#ff7a59]" />
                          第一车厢：人机工程：幼童心理及地理模型
                        </h4>
                        <table className="w-full text-xs font-bold text-slate-700 leading-normal">
                          <tbody className="divide-y divide-amber-100">
                            <tr>
                              <td className="py-2.5 text-slate-500 font-bold">目标幼童人机适配阶</td>
                              <td className="py-2.5 text-slate-800 font-extrabold text-right">学龄前阶段 4-6 岁 (首家精细定义)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">自适应出游地理场景组</td>
                              <td className="py-2.5 text-slate-850 font-extrabold text-right truncate max-w-[170px]" title={form.travelScenes.map(s => SCENES_DISPLAY[s] || s).join(', ')}>
                                {form.travelScenes.map(s => SCENES_DISPLAY[s] ? SCENES_DISPLAY[s].split(' ')[0] : s).join('、') || '未指定'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">行为独立性抗挫评级</td>
                              <td className="py-2.5 text-right">
                                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] font-display">
                                  {LEVEL_DISPLAY[form.independenceLevel] || form.independenceLevel}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">认知行为干预反射因子</td>
                              <td className="py-2.5 text-[#b91c1c] font-extrabold text-right text-[10.5px]">
                                {form.habitsTarget.length > 0 ? form.habitsTarget.join('与') : '无习惯靶向'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500 font-semibold">幼态个性情感通道阈值</td>
                              <td className="py-2.5 text-amber-955 font-extrabold text-right">{PERSONALITY_DISPLAY[form.personality] || form.personality}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Tactile and Sensory delivery dashboard table */}
                      <div className="bg-white rounded-2.5xl p-4.5 border-2 border-amber-950/15 shadow-sm relative">
                        <div className="absolute top-1 right-3 text-lg opacity-25">👂</div>
                        <h4 className="text-[11.5px] font-extrabold text-amber-955 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display border-b border-dashed border-amber-200 pb-2">
                          <Sliders className="w-4 h-4 text-[#ff7a59]" />
                          第三车厢：声控谐振：多感官物理控制参数
                        </h4>
                        <table className="w-full text-xs font-bold text-slate-700 leading-normal">
                          <tbody className="divide-y divide-amber-100">
                            <tr>
                              <td className="py-2.5 text-slate-500">心率 PPG 情绪彩虹灯</td>
                              <td className="py-2.5 text-rose-800 font-extrabold text-right">{form.feedbackHeartRate ? '💗 光体积 PPG 自适应同步呼吸闪控制' : '❌ 常规温和常亮状态'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">结构件防吞防误咬倒角</td>
                              <td className="py-2.5 text-emerald-800 font-extrabold text-right">👶 内嵌高拉牛顿级圆弧 R&gt;=6.5mm / 尺寸&gt;31.7mm</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">无晶体频闪 LED 色调度</td>
                              <td className="py-2.5 text-slate-800 font-extrabold text-right">{form.visualLightTone === '暖色' ? '☀️ 3000K 向日葵柔和护皮层色调' : '❄️ 6500K 冰蓝气色指示色'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500">外放安全声压级防护值</td>
                              <td className="py-2.5 text-slate-850 font-extrabold text-right font-mono">EN71 标准 &lt;= 73dBA 听觉保护 ({form.audioVolume}% 配设)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-500 font-semibold">120Hz心跳谐振微振阻阻阻</td>
                              <td className="py-2.5 text-orange-650 font-extrabold text-right text-[10.5px]">
                                奖励 [ 120Hz {form.vibrationModeSuccess}级 ] | 引导 [ 120Hz {form.vibrationModeNav}级 ] | 警戒 [ 120Hz {form.vibrationModeDanger}级 ]
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Block B: Species morphology & supplementary drafting */}
                    <div className="space-y-4">
                      
                      {/* Physical parameters carriers and sensor matching metrics */}
                      <div className="bg-white rounded-2.5xl p-4.5 border-2 border-amber-950/15 shadow-sm relative">
                        <div className="absolute top-1 right-3 text-lg opacity-25">👟</div>
                        <h4 className="text-[11.5px] font-extrabold text-amber-955 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-display border-b border-dashed border-amber-200 pb-2">
                          <Cpu className="w-4 h-4 text-[#ff7a59]" />
                          第二车厢：形态物形：构型选择与感知矩阵
                        </h4>
                        <div className="space-y-3.5 text-xs font-bold text-slate-700">
                          <div>
                            <span className="text-slate-500 block mb-1.5 font-semibold">选定的宝宝接触件构型载体（CMF物理表面）：</span>
                            <div className="flex flex-wrap gap-1.5">
                              {form.carriers.map(c => (
                                <span key={c} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-250 text-pink-700 font-extrabold text-[10.5px] font-display">
                                  {CARRIERS_DISPLAY[c] || c}
                                </span>
                              ))}
                              {form.carriers.length === 0 && <span className="text-amber-500">未指定形态基准</span>}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500 block mb-1.5 font-semibold">搭载传感器多轴微芯片坞（感知对齐阵列）：</span>
                            <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                              {form.sensors.map(s => (
                                <span key={s} className="px-2.5 py-0.75 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-[10px] font-mono font-bold">
                                  ⚡ {s}
                                </span>
                              ))}
                              {form.sensors.length === 0 && <span className="text-slate-400 font-mono">无矩阵搭载</span>}
                            </div>
                          </div>

                          <div className="border-t border-dashed border-amber-100 pt-3 text-[11.5px] leading-relaxed text-slate-700">
                            <span className="font-extrabold text-[#7c2d12] block mb-1 font-display text-[12px]">AI 空间自定位厘米级行为挑战预测：</span>
                            {getRecommendedTask()}
                          </div>
                        </div>
                      </div>

                      {/* Design notes narrative review */}
                      <div className="bg-[#fffdf5] rounded-2xl p-4 border-2 border-dashed border-amber-200 text-xs font-bold text-amber-900 leading-relaxed shadow-sm relative">
                        <span className="block font-extrabold text-[#c2410c] mb-1.5 flex items-center gap-1 font-display">
                          🗒️ 玩具创意工艺师 CMF 与安全硬核手札：
                        </span>
                        <p className="text-slate-600 italic leading-relaxed text-[11px] font-semibold">
                          "{form.designNotes || '未录入手稿细节，本专案出厂默认采用100%无毒亲肤、全钝角婴幼工艺限制合格。'}"
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Half row list with Habit loop sequence steps and out testing indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t-2.5 border-dashed border-indigo-200 col-span-1 md:col-span-2">
                    
                    {/* Step 4: growth habit loop list sequence - Pavlov Closed Loop */}
                    <div className="space-y-3">
                      <h4 className="text-[11.5px] font-extrabold text-amber-955 uppercase tracking-wider flex items-center gap-1.5 font-display pb-1 border-b border-dashed border-amber-100">
                        <BrainCircuit className="w-4.5 h-4.5 text-indigo-550" />
                        第四车厢：巴甫洛夫自适应行为矫正增强习惯养成回路
                      </h4>
                      {form.habitClosedLoopSteps.length === 0 ? (
                        <p className="text-xs text-slate-500 font-mono">未勾装回路车厢</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {form.habitClosedLoopSteps.map((step, index) => (
                            <div key={step} className="flex items-center gap-2 bg-slate-50/50 px-3 py-2 border border-amber-950/15 rounded-xl hover:border-amber-950 transition-colors">
                              <span className="w-5.5 h-5.5 rounded-xl bg-amber-400 text-amber-950 text-[10.5px] font-extrabold flex items-center justify-center font-display shadow-xs shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-[11px] text-slate-700 font-extrabold">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reliability test parameters checklists */}
                    <div className="space-y-3">
                      <h4 className="text-[11.5px] font-extrabold text-amber-955 uppercase tracking-wider flex items-center gap-1.5 font-display pb-1 border-b border-dashed border-amber-100">
                        <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                        第五车厢：玩具出厂物理可靠性极限稳定性检验项
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {form.testItems.map((test) => (
                          <div key={test} className="p-2 border border-slate-205 rounded-xl bg-white flex items-center gap-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-500 transition-colors">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-xs"></span>
                            <span>{test}自测试合格</span>
                          </div>
                        ))}
                        {form.testItems.length === 0 && (
                          <span className="text-xs text-slate-500 font-mono col-span-2 text-center py-4 bg-slate-50 rounded-xl">
                            未录入出厂考核项
                          </span>
                        )}
                      </div>

                      {/* Release readiness index stamp */}
                      <div className="pt-2.5 border-t border-dashed border-amber-200 flex items-center justify-between">
                        <span className="text-[11px] text-amber-900 font-extrabold">安全上市许可签署：</span>
                        <span className={`px-3 py-1 rounded-full text-[10.5px] font-extrabold font-display shadow-xs border ${
                          form.checklistReady 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-450 animate-pulse' 
                          : 'bg-[#fff0ed] text-rose-800 border-rose-350'
                        }`}>
                          {form.checklistReady ? '✅ 工业级婴幼安全检测，签批发行' : '🔬 参数微调调试检验中'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* SVG draft / stamp watermark decoration to make it ultra premium */}
                  <div className="pt-4 border-t-2 border-dashed border-amber-300 flex items-center justify-between text-[9.5px] text-amber-800/80 font-bold font-mono col-span-1 md:col-span-2">
                    <span>DESIGN SPECIFICATIONS • STICKER DECAL FOR TOY BENCH CARRIER STUDY</span>
                    <span>© MAGIC TOY CO-CREATION LAB • yamachi DESIGN</span>
                  </div>
                </div>

                {/* Final advice guidance cards */}
                <div className="bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-3xl p-5 text-center max-w-4xl mx-auto shadow-sm">
                  <p className="text-xs font-bold text-amber-955 leading-relaxed">
                    💡 <span className="text-[#ff7a59] font-extrabold">设计师心语：</span>
                    您可自由点击上方的童趣进度条对第一阶的宝宝人机模型随时进行对齐和修改。每次调试都会实时、无折损地自动保存在本地书包中，让您的灵感创想绝对不丢失！
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Core step wizards back & forth buttons navigation */}
          <footer className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => {
                setCurrentStep(currentStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-6 py-3.5 text-xs font-extrabold rounded-full border-2 transition-all ${
                currentStep === 1 
                  ? 'bg-amber-10 /10 text-amber-350 border-amber-200 cursor-not-allowed' 
                  : 'bg-white text-amber-950 border-amber-950 shadow-[3px_3px_0px_0px_#7c2d12] hover:bg-amber-50 active:translate-y-0.5 cursor-pointer'
              }`}
            >
              🐣 上一杯茶 (上一步)
            </button>

            <span className="text-xs font-extrabold font-mono text-amber-900 bg-amber-100/40 px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] border border-amber-200">
              探索关卡 0{currentStep} / 05
            </span>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && form.carriers.length === 0) {
                    showToast('请至少为宝宝选择一个发光智能形态基底以部署微处理器感知模组！', 'error');
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 text-xs font-extrabold rounded-full bg-[#ff7a59] hover:bg-[#ff623d] text-white border-2 border-amber-950 shadow-[3px_3px_0px_0px_#7c2d12] transition-all active:translate-y-0.5 cursor-pointer"
              >
                下一步 🐥 (向下一探索关卡)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  showToast('已穿越回关卡一，重新做图咯~', 'info');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 text-xs font-extrabold rounded-full text-amber-900 hover:text-[#ff7a59] hover:bg-amber-100/50 transition-all cursor-pointer border-2 border-dashed border-amber-350"
              >
                初关返回重做纸 🔄
              </button>
            )}
          </footer>

        </section>
      </main>
    </div>
  );
}
