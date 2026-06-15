import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BrainCircuit, 
  Play, 
  Cpu, 
  Sliders, 
  Volume2, 
  CheckSquare, 
  FileCheck, 
  Plus, 
  FolderOpen, 
  Trash2, 
  Copy, 
  Download, 
  User, 
  Award, 
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  ArrowLeft,
  ArrowRight,
  Smile,
  Compass
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProductConfig, HistoryItem } from './types';
import CarrierCanvas from './components/CarrierCanvas';

// Default configuration with professional CMF & ergonomic parameters
const DEFAULT_CONFIG = (): ProductConfig => ({
  id: '',
  name: '儿童定位硬件与 CMF 规格设计草案',
  lastSaved: '',
  
  // Step 1: Target Segments & Behavior Modeling
  travelScenes: ['交通枢纽', '游乐园'],
  independenceLevel: '有点经验',
  habitsTarget: ['不跑远', '完成简单指令'],
  personality: '外向',
  
  // Step 2: Form Carrier & CMF Specifications
  carriers: ['可穿戴手环'],
  sensors: ['环境光传感器', '心率传感器', '震动马达', 'GPS'], 
  designNotes: '本配置方案外壳采用邵氏硬度约 50°A 的超柔食品级液体硅胶 (LSR) 双射包覆成型，具备防敏、亲肤结构并能提供物理安全阻尼。形态结构边缘倒角严格执行 R >= 6.5mm 圆润钝角规范，以消弭物理探伤引起的意外磨损；电池舱采用一体灌封 IP67 级别三防与阻燃防爆内胆。结构中无任何可能导致学龄前儿童误吞的小细零配件（所有可拆零配件包络外廊均大于 31.7mm 安全基线特征），符合 ASTM F963-17 与 EN71 儿童机械及物理结构安全规范。',
  sketchImage: null,
  
  // Step 3: Sensory Signaling & Vibration
  feedbackHeartRate: true,
  visualLightTone: '暖色',
  audioVolume: 65,
  vibrationModeSuccess: '中',
  vibrationModeDanger: '强',
  vibrationModeNav: '中',
  
  // Step 4: Adaptive Habits Loops & HALT Stress Testing
  habitClosedLoopSteps: [
    '设定挑战（家长APP）',
    '执行与辅助（产品提示）',
    '即时反馈（震动+语音表扬）',
    '记录与复盘（同步APP）'
  ],
  testItems: ['定位精度', '跌落', '习惯闭环测试'],
  checklistReady: true
});

// Mapping carriers to sensors
const CARRIER_SENSORS_MAPPING: Record<string, string[]> = {
  '可穿戴手环': ['环境光传感器', '心率传感器', '震动马达', 'GPS'],
  '挂坠': ['麦克风', '震动马达', '骨传导传感器', 'GPS'],
  '智能鞋带扣': ['IMU', '压力传感器', 'GPS'],
  '小行李箱': ['UWB', '触感传感器', 'GPS', '环境光传感器'],
  '背包': ['UWB', '麦克风', '环境光传感器'],
  '旅行印章机': ['触感传感器', '环境光传感器', '麦克风'],
  '贴纸机': ['触感传感器', '深度传感器']
};

// Professional CMF annotations for carriers
const CARRIERS_DISPLAY: Record<string, string> = {
  '可穿戴手环': 'LSR-PPG 智能穿戴手环 (邵氏 50°A 液体硅胶 / 集成光电心率波段腔体)',
  '挂坠': '骨传导声振防勒挂环 (高阻燃 ABS / 骨传导发生器 / 防窒息机械自脱紧卡扣)',
  '智能鞋带扣': '微型 IMU 动态鞋上搭扣 (10轴惯性测量单元 / 超声波熔接尼龙玻纤外壳)',
  '小行李箱': '自随智感旅行拉杆箱 (聚碳酸酯 PC 壳体 / 超宽带 UWB 跟踪雷达 / 防翻阻尼结构)',
  '背包': '反光减压定位护脊背包 (防割防水抗菌织物 / 高亮微晶反光贴面 / 微型天线盖板)',
  '旅行印章机': '物理微机电印章打卡模组 (环保抗菌 ABS 胶件 / 无毒植物色浆 / 防吞构造)',
  '贴纸机': '微型热敏不干胶打印机器 (环保无双酚热敏介质面层 / 隐蔽防割裁片保护)'
};

// Professional geographic environmental mappings
const SCENES_DISPLAY: Record<string, string> = {
  '交通枢纽': '枢纽场景 (大背景声学噪点 / 复杂多径电磁干扰 / 高密度动能环境)',
  '游乐园': '园区场景 (中大层级非结构化物理空间多星测距重拾取)',
  '自然探索': '自然野外 (弱天线信号补偿定位 / 瞬时大倾角姿态惯导估测补给)',
  '住宿': '室内场景 (高频微网格基站空间 / 电磁波室内多径衰减屏蔽域)',
  '短途': '短途户外静态场景 (高振动高机械抗震阻抗 / IP5X 防尘适配外廊)',
  '长途': '跨城市长途转场 (低功耗深度休眠待机策略 / 双模 GPS 星历重映射测距)'
};

const HABITS_DISPLAY: Record<string, string> = {
  '不跑远': '厘米级近场安全空间阻尼边界 (符合 UWB 到达时差 TOF 超宽带测距自平衡算法)',
  '记住物品': '高频看护随身资产防丢控制 (基于射频 RFID 与薄膜压力阻压感知坞)',
  '完成简单指令': '幼儿动作习惯反射环路强化控制 (通过多模态触觉伴随声光交互反馈)'
};

const LEVEL_DISPLAY = {
  '初学': 'L1 被动防护级 (空间几何约束 / 多波段定位 / 唤醒模式限制)',
  '有点经验': 'L2 状态认知交互级 (多轴主动状态确认 / PPG 心率反射对准)',
  '比较独立': 'L3 任务驱动赋权级 (离线不干胶/物理微机械微闩锁发分兑现模式)'
};

const PERSONALITY_DISPLAY = {
  '内向': '低感官唤醒特征 (低饱和度 3000K 稳态呼吸光源，低振幅平缓声学波段)',
  '外向': '高感官响应特征 (高灵敏度高动态光谱脉冲引导，高频敲击振动反馈)'
};

// Playful custom styles for active scenes rendering
const SCENE_THEMES: Record<string, { activeClass: string, text: string }> = {
  '交通枢纽': { activeClass: 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-100', text: '🎨 枢纽场景' },
  '游乐园': { activeClass: 'bg-amber-400 text-slate-905 border-amber-400 shadow-md shadow-amber-100', text: '🎡 游乐园' },
  '自然探索': { activeClass: 'bg-emerald-400 text-white border-emerald-400 shadow-md shadow-emerald-100', text: '🌲 自然探索' },
  '住宿': { activeClass: 'bg-sky-450 text-white bg-sky-400 border-sky-450 shadow-md shadow-sky-100', text: '🎈 室内场景' },
  '短途': { activeClass: 'bg-violet-400 text-white border-violet-400 shadow-md shadow-violet-100', text: '🚲 短途郊游' },
  '长途': { activeClass: 'bg-orange-400 text-white border-orange-400 shadow-md shadow-orange-100', text: '✈️ 跨城长途' }
};

export default function App() {
  const [form, setForm] = useState<ProductConfig>(DEFAULT_CONFIG());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reportName, setReportName] = useState<string>('儿童定位穿戴智能硬件 CMF 规格设计方案');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Interactive wiggling effect trigger
  const [shakeTrigger, setShakeTrigger] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Local drafted database setup
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
        setReportName(parsed.name || '儿童定位穿戴智能硬件 CMF 规格设计方案');
      } catch (e) {
        console.warn('Draft auto-reloads ignored');
      }
    } else {
      const initialForm = DEFAULT_CONFIG();
      initialForm.id = 'ID-KID-' + Date.now().toString(36).toUpperCase();
      setForm(initialForm);
    }
  }, []);

  // Sync current configuration
  useEffect(() => {
    if (form.id) {
      const formToSave = { ...form, name: reportName };
      localStorage.setItem('pdefine_active_draft', JSON.stringify(formToSave));
    }
  }, [form, reportName]);

  // Ergonomic feedback analysis
  const getAbilityLevel = () => {
    switch (form.independenceLevel) {
      case '初学':
        return {
          level: 'L1级 被动物理防护防丢牵引机制',
          desc: '该成长阶段认知与运动行为处于前运算发展期，极易走散。硬件系统采用高强度电子安全围封，结合 UWB 精定位双向即时对焦。当距离超阀（常规>8m）时手环输出 120Hz 仿猫舒缓敲击微震，并配对 3000K 稳频恒温呼吸指示光源，平抑幼儿恐慌情绪并发出看护牵引警告。'
        };
      case '有点经验':
        return {
          level: 'L2级 行为打卡条件激励与自理习惯反射',
          desc: '幼儿已具备基础自理与定向能力。硬件设计中引入 Pavlovian（巴甫洛夫）即时奖惩闭环。通过 PPG 心率极速测度情绪指数，当幼儿自律完成指令（不跑远、看护好随身物）后，指示灯圈闪烁向日葵暖光，且积分芯片向家长同步徽章积分，实现正向趣味强化。'
        };
      case '比较独立':
        return {
          level: 'L3级 任务驱动多感官解锁与物理释能验证',
          desc: '该阶段适龄儿童空间探索力极强。系统结合 IMU 运动姿态分析对靶习惯条件门槛。当习惯任务序列达成时，硬件底部的微轴微机电小型电磁闩锁器自动释放锁耳，弹出印记色浆徽章或热敏不干胶贴纸，将设计正向激励物理化，形成完美交互。'
        };
      default:
        return { 
          level: 'L2级 通用自适应行为干预模型', 
          desc: '符合无频闪LED光源波包限制标准与外放音频降风噪安全阈值，保护幼儿敏感视听视皮层损伤。' 
        };
    }
  };

  const getRecommendedTask = () => {
    const isIntrovert = form.personality === '内向';
    const firstScene = form.travelScenes[0] || '探索营区';
    
    if (form.independenceLevel === '初学') {
      return `【CMF 安全围堵策略】：针对“${firstScene}”错综交变多径干涉环境，手环内置 2.4G & UWB 双天线构筑 6mm 离体报警。若遭遇异常拖拽跌落，微型喇叭外放小鸟啁啾舒缓声，配合高灵敏呼吸指示光源，形成全自主定位回传警戒。`;
    } else if (form.independenceLevel === '有点经验') {
      return `【${isIntrovert ? '心率呼吸安抚灯光' : '动感激振寻人雷达'}】：在“${firstScene}”出游探索中，基于 PPG 穿戴极极捕获幼儿心率。当幼儿良好看护好了“${form.habitsTarget[0] || '负荷物品'}”，外壳指示圈溢射柔和暖色光谱，实现温暖趣味习惯对齐。`;
    } else {
      return `【IMU 及物理徽章联动释能方案】：在“${form.travelScenes.join(' / ')}”地理探索中，当 IMU 多轴探测判定达标“${form.habitsTarget[1] || '微指令打卡'}”连贯动作后，挂件底卡微型闩锁器自动弹起卸载，瞬间盖印徽章，兑付物理童趣反馈！`;
    }
  };

  const handleNewReport = () => {
    const newForm = DEFAULT_CONFIG();
    newForm.id = 'ID-KID-' + Date.now().toString(36).toUpperCase();
    setForm(newForm);
    setReportName('全新儿童 AI 穿戴 CMF 规格定义方案');
    setCurrentStep(1);
    showToast('全新积木定义方案已部署，规格重置为出厂设计师参考基准', 'success');
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
    showToast(`配置方案“${reportName}”已成功备份至工作室积木草稿仓！`, 'success');
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setForm(item.config);
    setReportName(item.name);
    setCurrentStep(1); 
    showToast(`载入历史规格方案：“${item.name}”成功！`, 'info');
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('pdefine_history', JSON.stringify(updated));
    showToast('已从本地草稿区清空对应备用规格档案', 'info');
  };

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
        showToast('二维概念装配图/手写涂鸦 CAD 已经同步加载入形态插槽', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaySoundTest = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      const adjustedVolume = (form.audioVolume / 100) * 0.09;
      gainNode.gain.setValueAtTime(adjustedVolume, ctx.currentTime);

      if (form.visualLightTone === '暖色') {
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.type = 'triangle';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc2.type = 'sine';

        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc1.start();
        osc2.start(ctx.currentTime + 0.1);
        
        osc1.stop(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 0.6);
        showToast('🔈 听学安全测试：暖阳八音盒叮当双音 Chimes 发出成功。限级声级低于 73dBA！', 'success');
      } else {
        osc1.frequency.setValueAtTime(698.46, ctx.currentTime); // F5
        osc1.type = 'sine';
        osc1.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.2); // B5
        
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.42);
        showToast('🔈 提示音测试：冷光警告星笛发音包络成功，有效满足 EN71 听力保护。', 'success');
      }
    } catch (e) {
      showToast('声音受浏览器交互唤醒政策拦截，请点按其他按钮再试', 'info');
    }
  };

  const handlePlayVibeTest = (type: string, strength: string) => {
    setShakeTrigger(type);
    showToast(`⏰ 调试振谱：120Hz 弹射微震 [${type}] (力度: ${strength}) 启动`, 'success');
    
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      let freq = 120; 
      let gainVal = 0.05;
      if (strength === '弱') gainVal = 0.02;
      if (strength === '强') { freq = 120; gainVal = 0.1; }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(err) {}

    setTimeout(() => {
      setShakeTrigger(null);
    }, 750);
  };

  const exportPdfReport = async () => {
    const reportElement = document.getElementById('product-report-panel');
    if (!reportElement) {
      showToast('未检测到规格蓝图渲染区域，导出终止', 'error');
      return;
    }

    showToast('🎒 糖果色规格蓝图生成中... 正在打包印刷尺寸 A4 规格书...', 'info');

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
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

      pdf.save(`CMF-Specs-Draft_${reportName.replace(/\s+/g, '_')}_A4_Certificate.pdf`);
      showToast('🎉 导出成功！高清晰童趣 CMF A4 规格书 PDF 已触发下载', 'success');
    } catch (error) {
      console.error('PDF generation error', error);
      showToast('PDF 汇出模块发生错误，请重新调整参数', 'error');
    }
  };

  const handleCopySummary = () => {
    const defaultTask = getRecommendedTask();
    const ability = getAbilityLevel();
    const summaryText = `
[儿童定位硬件与 CMF 规格设计方案：${reportName}]
=========================================
【第 1 阶段】 场景微环境、幼儿自理层级与心理机能建模
・出游探索微场景: ${form.travelScenes.map(s => SCENES_DISPLAY[s] || s).join(', ')}
・定位自保自立层级: ${LEVEL_DISPLAY[form.independenceLevel]}
・主动习惯强化模型: ${ability.level}
・狙击纠偏强化习惯: ${form.habitsTarget.map(h => HABITS_DISPLAY[h] || h).join(', ')}
・情绪感官唤醒特征: ${PERSONALITY_DISPLAY[form.personality]}

【第 2 阶段】 物理形态载具样式、传感芯片与 CMF 材料标准
・主物理载体选择: ${form.carriers.map(c => CARRIERS_DISPLAY[c] || c).join(', ')}
・搭载传感器阵列: ${form.sensors.join(', ')}
・自适应定位任务建议: ${defaultTask}
・设计师 CMF 构造手迹: ${form.designNotes}

【第 3 阶段】 多模态生物感官调节、防咽安全与震谱反馈参数
・PPG 情绪呼吸彩虹灯: ${form.feedbackHeartRate ? '开 (心率信号脉冲同步呼吸指示)' : '关 (基础稳态指示模式)'}
・安全性倒角无误咽指标: ASTM F963 要求（R>=6.5mm 双面无锐角，独立防咽结构直径>31.7mm）
・不频闪 LED 色温光谱: ${form.visualLightTone === '暖色' ? '温暖向日葵波段 (3000K)' : '清凉高透冷白波段 (6500K)'}
・安全声压上限抑制值: 低于 73dBA 听觉保护 (${form.audioVolume}% 输出放量)
・120Hz 极微机械触感强电: 习惯强化 [ ${form.vibrationModeSuccess}级 ] | 搜寻导航 [ ${form.vibrationModeNav}级 ] | 超阈离程报警 [ ${form.vibrationModeDanger}级 ]

【第 4 阶段】 自适应行为习惯打卡闭环与可靠性应力测试 (HALT)
・巴甫洛夫糖果色彩打卡链:
${form.habitClosedLoopSteps.map((step, idx) => `  - [阶段 ${idx + 1}] -> ${step}`).join('\n')}
・HALT 可靠应力合格校验: ${form.testItems.map(t => `${t}合格`).join(' | ')}
・可靠安全签批通行状态: ${form.checklistReady ? '✅ 工业级学龄前机械安全检验全部及格通过' : '未签发，校验调试中'}
=========================================
方案发源厂: KidAI 工业产品 CMF 联合实验室 | 签批批次号: #${form.id} | 时间: ${new Date().toLocaleString()}
`;

    navigator.clipboard.writeText(summaryText.trim())
      .then(() => {
        showToast('📋 糖果色硬件 CMF 规格书内容已成功复制到您的系统剪贴板！', 'success');
      })
      .catch((err) => {
        showToast('复制失败，请点击下载 A4 PDF 查看完整规格', 'error');
      });
  };

  const handleSelectAllSensors = () => {
    const all = ['环境光传感器', '环境温度传感器', '摄像头', '深度传感器', '麦克风', '骨传导传感器', '震动马达', '压力传感器', '触感传感器', '气体传感器', '空气质量检测', 'GPS', 'IMU', '地磁传感器', 'UWB', '心率传感器', '皮电传感器', '体温传感器'];
    setForm({ ...form, sensors: all });
    showToast('🚀 芯片舱已 100% 满配全能传感器，感官能力已拉满！', 'success');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex font-sans text-slate-800 antialiased relative selection:bg-orange-100 selection:text-orange-900 leading-normal">
      
      {/* Decorative whimsical shapes in background corners */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Toast system */}
      {toast && (
        <div id="toast-notify" className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xs font-bold px-5 py-4 rounded-xl border border-orange-200 shadow-xl transition-all duration-300 animate-slide-in">
          <Smile className="w-4 h-4 text-white animate-bounce" />
          <span className="text-[12px] tracking-wide font-sans">{toast.text}</span>
        </div>
      )}

      {/* LEFT SIDEBAR PANEL: Swiss industrial workspace browser with a friendly toy-box theme */}
      <aside className="w-[310px] bg-[#fcf8f2] border-r-2 border-orange-100/40 flex flex-col shrink-0 select-none hidden lg:flex relative z-10">
        
        {/* Workspace Title Header */}
        <div className="p-6 border-b-2 border-orange-100/40 bg-gradient-to-tr from-orange-50 via-pink-50/40 to-[#fff8f0] relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-orange-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[13px] font-black tracking-tight text-slate-900 uppercase flex items-center gap-1 font-sans">
                KidAI Configurator
              </h1>
              <p className="text-[9.5px] text-orange-500 font-mono tracking-wider font-extrabold flex items-center gap-1 uppercase">
                <span>🍭 Children CMF Studio</span>
              </p>
            </div>
          </div>
        </div>

        {/* Create new design report entrance */}
        <div className="p-5 border-b border-orange-100/25 bg-white/70">
          <button
            type="button"
            onClick={handleNewReport}
            className="w-full flex items-center justify-center gap-2 bg-[#fffcfa] hover:bg-orange-50/50 text-orange-600 text-xs font-extrabold py-3 px-4 rounded-xl border-2 border-orange-200 border-b-4 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            新建糖果色设计草案
          </button>
        </div>

        {/* Saved Drafts */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between text-[10px] font-extrabold text-orange-600/90 uppercase tracking-widest px-1 font-mono">
            <span className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              本地积木草稿槽 ({history.length} / 5)
            </span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-xs text-orange-400/80 border-2 border-dashed border-orange-100/80 rounded-xl bg-orange-50/10 p-4">
              <span className="text-2xl block mb-2">🧸</span>
              草稿隔间暂无备份
              <p className="text-[9.5px] text-slate-400 mt-2 leading-relaxed">
                点击上方<b>“备份本地”</b>，您的糖果色创意规格会自动在此封存。
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLoadFromHistory(item)}
                  className={`group relative flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    form.id === item.id 
                    ? 'bg-gradient-to-r from-orange-50 to-pink-50/30 border-2 border-pink-300 text-pink-700 font-bold shadow-md shadow-orange-50/50' 
                    : 'bg-white border-orange-100/60 hover:border-orange-200 text-slate-600 hover:bg-orange-50/10'
                  }`}
                >
                  <div className="text-xs font-bold truncate pr-6 text-slate-800">
                    🧩 {item.name}
                  </div>
                  <div className="text-[9px] font-mono text-orange-500 mt-2 flex justify-between items-center font-bold">
                    <span>{item.lastSaved ? item.lastSaved.split(' ')[0] : '刚才备份'}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-all cursor-pointer"
                      title="清除此草稿"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Designer Profile Footer */}
        <div className="p-5 border-t border-orange-105/60 border-t-orange-100/40 bg-orange-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-200 to-pink-300 border border-orange-300 flex items-center justify-center relative">
              <User className="w-4 h-4 text-white" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800">
                设计师: yamachi
              </div>
              <div className="text-[10px] text-orange-500 font-mono font-bold">
                CMF 创造力专家 🎈
              </div>
            </div>
          </div>
          <div className="text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 font-extrabold uppercase">
            CMF_LAB
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto relative z-10">
        
        {/* Main top header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-orange-100/40 px-6 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="lg:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="text-sm font-black text-slate-900 bg-transparent hover:bg-orange-50/30 focus:bg-white border-2 border-dashed border-orange-200 focus:border-orange-400 focus:outline-none transition-all px-2.5 py-1.5 rounded-lg w-full sm:w-96 font-sans"
                title="点击重写标题名称"
                placeholder="键入硬件定义案名称"
              />
              <p className="text-[9.5px] text-orange-500/80 flex items-center gap-1.5 mt-1 font-mono tracking-wide font-extrabold uppercase">
                <span>ID SPECIFICATION &amp; CMF BLOCKS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleNewReport}
              className="lg:hidden p-2 text-orange-600 bg-orange-50 hover:bg-orange-100/50 border border-orange-200 rounded-lg transition"
              title="新建配置"
            >
              <Plus className="w-4 h-4 font-black" />
            </button>
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-amber-400 hover:opacity-95 text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-md border-b-4 border-orange-500 transition-all cursor-pointer"
            >
              <span>💾 备份本地卡槽</span>
            </button>
          </div>
        </header>

        {/* Step-by-step progress guide bar indicator (Candy Train track style) */}
        <div className="bg-orange-50/20 border-b-2 border-orange-100/40 px-6 py-4 shrink-0 overflow-x-auto">
          <div className="max-w-5xl mx-auto flex items-center gap-2 md:gap-4 justify-between select-none min-w-[700px]">
            {[
              { num: 1, label: 'Ⅰ. 场景与成长建模' },
              { num: 2, label: 'Ⅱ. 智能载具与 CMF' },
              { num: 3, label: 'Ⅲ. 视觉指示与振谱' },
              { num: 4, label: 'Ⅳ. 习惯链条与 HALT' },
              { num: 5, label: 'Ⅴ. 规格技术书印签' },
            ].map((step) => {
              const isCurrent = currentStep === step.num;
              const isPassed = currentStep > step.num;

              return (
                <React.Fragment key={step.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      isCurrent 
                        ? 'text-pink-600 font-black border-2 border-pink-400 bg-white shadow-md shadow-pink-50/50 scale-105' 
                        : isPassed 
                        ? 'text-emerald-600 hover:text-emerald-700 font-bold' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10.5px] font-mono font-bold border-2 ${
                      isCurrent 
                        ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white border-pink-400 shadow-sm' 
                        : isPassed 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-300' 
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}>
                      {step.num}
                    </span>
                    <span className="tracking-tight font-sans text-[12px]">{step.label}</span>
                  </button>
                  {step.num < 5 && (
                    <div className={`h-[3px] flex-1 min-w-[12px] rounded-full ${isPassed ? 'bg-gradient-to-r from-emerald-300 to-emerald-400' : 'bg-orange-100'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STEP SANDBOX CONTAINER */}
        <section className="flex-1 p-6 max-w-5xl w-full mx-auto animate-fade-in flex flex-col justify-between">
          
          <div className="bg-white border-4 border-orange-100/70 rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-between shadow-lg relative overflow-hidden">
            
            {/* Whimsical small background stamp */}
            <div className="absolute top-4 right-4 text-[50px] opacity-10 select-none pointer-events-none">🧸</div>

            {/* STEP 1: USER MODELING & ERGONOMICS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Users className="w-5 h-5 text-orange-500" />
                    第一阶段：目标幼儿成长评级、空间环境规划与人格反射建模
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    以我国儿童（重点对齐半学龄前 4-6 岁幼儿）心理人机工学为基准：此阶段幼儿空间几何坐标重构力较弱，需要工业硬件提供即时的 CMF 习惯闭环介入，并根据不同成长层级、探索场景以及神经过敏性格定制反馈包络。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left Column Controls */}
                  <div className="space-y-5">
                    {/* Fixed Standard */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-orange-550 uppercase tracking-widest mb-1.5 font-mono">
                        🧸 目标学龄前儿童心理生理基准限制
                      </label>
                      <div className="bg-gradient-to-r from-orange-50/50 to-pink-50/20 border-2 border-orange-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-slate-800">认知行为前运算阶段（中、大班）</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">（对标 EN71 非吞机械力学安全尺寸规范）</span>
                        </div>
                        <span className="px-3 py-1 text-[11px] font-mono font-bold text-orange-700 bg-white border-2 border-orange-200 rounded-lg shadow-sm">
                          Age: 4 - 6 周岁适龄
                        </span>
                      </div>
                    </div>

                    {/* Travel Scenes (Environments Map with Rainbow buttons) */}
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-700 mb-2">
                        🍭 空间微环境探索场景 (Travel scenes - 激活即对齐指向传感器舱)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['交通枢纽', '游乐园', '自然探索', '住宿', '短途', '长途'].map((scene) => {
                          const active = form.travelScenes.includes(scene);
                          const styleObj = SCENE_THEMES[scene];
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
                              className={`p-3 text-xs font-bold rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? styleObj.activeClass 
                                  : 'bg-white border-orange-50 text-slate-650 hover:bg-orange-50/20'
                              }`}
                            >
                              <span>{styleObj.text}</span>
                              <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[9px] ${
                                active ? 'border-transparent bg-white/30 text-white font-extrabold' : 'border-orange-100 bg-slate-50'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Independence level with playful colors */}
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-700 mb-2">
                        ⭐ 幼儿独立性抗挫评级 (Children maturity &amp; independence levels)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['初学', '有点经验', '比较独立'] as const).map((level) => {
                          const active = form.independenceLevel === level;
                          let activeStyle = '';
                          if (level === '初学') activeStyle = 'bg-sky-400 text-white border-sky-400 shadow-md shadow-sky-100';
                          if (level === '有点经验') activeStyle = 'bg-amber-400 text-slate-900 border-amber-400 shadow-md shadow-amber-105';
                          if (level === '比较独立') activeStyle = 'bg-violet-400 text-white border-violet-400 shadow-md shadow-violet-100';

                          return (
                            <button
                              type="button"
                              key={level}
                              onClick={() => setForm({ ...form, independenceLevel: level })}
                              className={`p-3.5 text-xs font-bold rounded-xl border-2 text-center transition-all cursor-pointer ${
                                active 
                                  ? activeStyle 
                                  : 'bg-white border-orange-50 text-slate-600 hover:bg-orange-50/20'
                              }`}
                            >
                              <div className="text-[11.5px] font-black">
                                {level === '初学' ? '👶 L1 萌芽级' : level === '有点经验' ? '🍭 L2 自立级' : '🚀 L3 授权级'}
                              </div>
                              <div className="text-[8.5px] opacity-75 mt-1 font-sans">
                                {level === '初学' ? '被动物理围堵' : level === '有点经验' ? '即时条件打卡' : '物理徽章释能'}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column Controls */}
                  <div className="space-y-5">
                    {/* Habits enhancements target */}
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-700 mb-2">
                        🎯 狙击纠偏强化习惯机制 (Autonomic habits loops - 联动反馈震谱)
                      </label>
                      <div className="space-y-2">
                        {['不跑远', '记住物品', '完成简单指令'].map((target) => {
                          const active = form.habitsTarget.includes(target);
                          let activeColor = '';
                          if (target === '不跑远') activeColor = 'bg-emerald-50 border-emerald-300 text-emerald-700';
                          if (target === '记住物品') activeColor = 'bg-pink-50 border-pink-300 text-pink-700';
                          if (target === '完成简单指令') activeColor = 'bg-amber-50 border-amber-300 text-amber-800';

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
                              className={`w-full p-3 text-xs font-bold rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? `${activeColor} font-black shadow-sm` 
                                  : 'bg-white border-orange-55 border-orange-100 hover:border-orange-200 text-slate-600'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="text-left">
                                  <div className="text-xs font-black">🌟 {target}习惯</div>
                                  <div className="text-[9.5px] opacity-75 font-mono mt-0.5">{HABITS_DISPLAY[target]}</div>
                                </div>
                              </div>
                              <span className={`w-4.5 h-4.5 rounded-lg border-2 flex items-center justify-center text-[10px] shrink-0 ${
                                active ? 'border-transparent bg-white text-emerald-600 font-extrabold' : 'border-orange-200 bg-orange-50/10'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Personality profiles */}
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-700 mb-2">
                        🧬 神经唤醒过敏与感官防颤敏感特征 (Arousal preference)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['内向', '外向'] as const).map((p) => {
                          const active = form.personality === p;
                          let activeStyle = active 
                            ? 'bg-rose-450 bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-100' 
                            : 'bg-white border-orange-50 text-slate-650 hover:bg-orange-50/20';
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setForm({ ...form, personality: p })}
                              className={`p-3 text-xs font-bold rounded-xl border-2 text-center transition-all cursor-pointer ${activeStyle}`}
                            >
                              <div className="font-extrabold text-[11.5px]">{p === '内向' ? '🌸 稳态感细度敏感型' : '⚡ 跃迁动能反应活跃型'}</div>
                              <div className="text-[8px] opacity-75 mt-1 font-sans">（匹配低阻弱震 vs 高响应微谱）</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Profile Card */}
                <div className="bg-gradient-to-tr from-amber-50/40 via-[#fffcf9] to-pink-50/30 border-2 border-orange-100 rounded-2xl p-5 mt-4 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4.5 h-4.5 text-orange-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600 font-sans">
                      🎈 儿童心理与人机安全诊断档案 (Ergonomical ID Spec)
                    </span>
                  </div>
                  <div className="bg-white border border-orange-100/55 p-4 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-400 to-pink-400 text-white flex items-center justify-center font-mono text-sm font-black shrink-0 shadow-sm">
                      KID-1
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-black text-slate-900">
                          安全定位干预参数自适应对齐：
                        </span>
                        <span className="text-[9px] bg-pink-100 text-pink-600 border border-pink-200 px-2 rounded-full font-mono font-bold">
                          {form.personality === '外向' ? 'HIGH_AROUSAL' : 'CALM_AROUSAL'}
                        </span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-slate-500 mt-2">
                        适用微空间场景: <span className="text-orange-600 font-black">{form.travelScenes.join(' + ') || '[未指定]'}</span> | 评定层级: <span className="text-pink-600 font-black">“{LEVEL_DISPLAY[form.independenceLevel]}”</span>。依据我国儿童成长人机工学规范，系统正在自适应对靶纠偏 <span className="text-indigo-600 font-bold">{form.habitsTarget.join('与') || '无'}</span> 习惯序列，采用极微声压与平缓振谱包络。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Carrier & Sensors (With Blueprint integrated) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Cpu className="w-5 h-5 text-orange-500" />
                    第二阶段：智能硬件载具选型工艺、传感芯片密封坞以及无毒材料 CMF 规范
                  </h2>
                  <p className="text-xs text-slate-505 mt-1 leading-relaxed">
                    形态即是感觉界面。为防止学龄前儿童物理咽下、摩擦磨损及电磁漏电风险，选定下方智能形态可直接自适配出厂主传感器（改变形态系统将智能装配对应的传感芯片）。
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Parameter Panel */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* ID specification recommend view */}
                    <div className="bg-[#fffefe] border-2 border-orange-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest font-mono">
                          自适应交互反馈参数预解算
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#fffdfb] p-3 rounded-lg border border-orange-100/55">
                          <div className="text-[8.5px] text-orange-500 font-bold font-mono uppercase tracking-wider">定位推荐层级</div>
                          <div className="text-xs font-black text-slate-800 mt-1">{getAbilityLevel().level}</div>
                        </div>
                        <div className="bg-[#fffdfb] p-3 rounded-lg border border-orange-100/55">
                          <div className="text-[8.5px] text-orange-500 font-bold font-mono uppercase tracking-wider">动作行为阻封干预反射</div>
                          <span className="text-[11px] leading-relaxed text-slate-500 mt-1 block font-medium">
                            {getAbilityLevel().desc}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Carriers Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11.5px] font-black text-slate-700">🍬 形态硬件载体基座 (Carriers - 可多选进行趣味产品融合)</label>
                        <span className="text-[9px] font-mono text-orange-500 font-extrabold">[ 自动分配配套传感器 ]</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['可穿戴手环', '挂坠', '智能鞋带扣', '小行李箱', '背包', '旅行印章机', '贴纸机'].map((c) => {
                          const active = form.carriers.includes(c);
                          return (
                            <button
                              type="button"
                              key={c}
                              onClick={() => handleCarrierChange(c)}
                              className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer border-2 ${
                                active 
                                  ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white border-pink-400 shadow-md shadow-pink-100' 
                                  : 'bg-white text-[#556070] border-orange-100/50 hover:border-orange-200 hover:bg-orange-50/10'
                              }`}
                            >
                              {active ? `🧸 ${c}` : c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sensor Checkboxes Category */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11.5px] font-black text-slate-700 font-mono">⚡ SENSOR MATRIX 传感器芯片及感知舱矩阵</label>
                        <button
                          type="button"
                          onClick={handleSelectAllSensors}
                          className="text-[10px] text-orange-600 hover:text-orange-700 font-black underline cursor-pointer"
                        >
                          [ ⚡ 传感器芯片满载配置 ]
                        </button>
                      </div>

                      <div className="space-y-3 bg-white p-4 border-2 border-orange-100/70 rounded-xl max-h-[170px] overflow-y-auto">
                        {[
                          { title: '💡 视觉及多轴温湿状态芯片组', items: ['环境光传感器', '环境温度传感器'], color: 'text-sky-500' },
                          { title: '👂 听力防耳刺与骨传振动声阻件', items: ['麦克风', '骨传导传感器'], color: 'text-violet-500' },
                          { title: '🎯 Haptic 压敏微阻与振荡发生单元', items: ['震动马达', '压力传感器', '触感传感器'], color: 'text-rose-500' },
                          { title: '🛰️ UWB 超宽带与星历惯导定位芯片', items: ['GPS', 'IMU', '地磁传感器', 'UWB'], color: 'text-amber-500' },
                          { title: '🌸 皮电情绪脉冲及情绪呼吸电极组', items: ['心率传感器', '皮电传感器', '体温传感器'], color: 'text-pink-500' },
                        ].map((grp) => (
                          <div key={grp.title} className="space-y-1.5 border-b border-dashed border-orange-50 pb-2.5 last:border-0 last:pb-0">
                            <h4 className={`text-[9.5px] font-extrabold ${grp.color} uppercase tracking-wider font-sans`}>{grp.title}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {grp.items.map((item) => {
                                const checked = form.sensors.includes(item);
                                return (
                                  <label
                                    key={item}
                                    onClick={() => handleSensorToggle(item)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-lg transition-all cursor-pointer select-none border-2 ${
                                      checked
                                        ? 'bg-orange-50/70 text-[#903000] border-orange-300 font-black'
                                        : 'bg-white text-slate-500 border-orange-50/40 hover:border-orange-200'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${checked ? 'bg-orange-500 animate-pulse' : 'bg-slate-250 bg-slate-200'}`} />
                                    <span>{item}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CMF Notes Narrative */}
                    <div>
                      <label className="block text-[11.5px] font-black text-slate-700 mb-1.5 flex items-center gap-1">
                        🎨 CMF 安全倒珠、无毒工艺、双射结构与防咽安全说明
                      </label>
                      <textarea
                        value={form.designNotes}
                        onChange={(e) => setForm({ ...form, designNotes: e.target.value })}
                        className="w-full text-xs p-3.5 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:outline-none min-h-[95px] bg-[#fffdfb] leading-relaxed text-slate-600 focus:ring-2 focus:ring-orange-100"
                        placeholder="记录 CMF 规范、LSR 双射模口圆角及受拉合力安全极限..."
                      />
                    </div>
                  </div>

                  {/* Right Column: AutoCAD rendering */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* CAD Preview */}
                    <div className="h-[310px]">
                      <CarrierCanvas carriers={form.carriers} />
                    </div>

                    {/* Image Uploader */}
                    <div className="bg-white border-2 border-orange-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700">🎨 自定义概念 CMF 彩色图纸 (PNG/JPEG)</span>
                        {form.sketchImage && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, sketchImage: null })}
                            className="text-[10px] text-pink-600 hover:text-pink-700 font-bold underline cursor-pointer"
                          >
                            释放图纸
                          </button>
                        )}
                      </div>

                      {form.sketchImage ? (
                        <div className="relative aspect-[4/3] rounded-lg border-2 border-orange-100 overflow-hidden bg-slate-50 p-1 bg-white shadow-inner">
                          <img 
                            src={form.sketchImage} 
                            alt="Custom user engineering sketch" 
                            className="w-full h-full object-cover rounded-md"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-orange-400 to-pink-500 text-[9.5px] text-white py-1.5 px-2 text-center font-mono font-bold">
                            ATTACHED: SPECIFICATION SKETCH READY
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 text-center flex flex-col items-center justify-center bg-[#fffefd] hover:bg-orange-50/10 transition-all relative cursor-pointer">
                          <span className="text-2xl mb-1.5">🖼️</span>
                          <span className="text-xs text-slate-800 font-extrabold">导入儿童创想草稿或 3D 着色渲染图</span>
                          <span className="text-[9.5px] text-slate-400 font-mono mt-0.5">可直接拖拽或点按上传 2D 图</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSketchUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Sensory signaling */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Sliders className="w-5 h-5 text-orange-500" />
                    第三阶段：听觉防刺降噪声级限制、视觉稳态指示呼吸灯与 120Hz 极微触控振谱
                  </h2>
                  <p className="text-xs text-slate-505 mt-1 leading-relaxed">
                    保障学龄前儿童感官发育：内耳毛细胞及视皮层神经敏感脆弱。硬件提示声音必须低于 73dBA 安全阻尼限线，LED 采用纯正向稳频。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-5">
                    
                    {/* Heart Rate integration toggle */}
                    <div className="bg-gradient-to-tr from-pink-50/30 to-orange-50/20 border-2 border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex-1 pr-3">
                        <div className="text-xs font-black text-slate-900 flex items-center gap-1 font-sans">
                          <Heart className="w-4.5 h-4.5 text-pink-500 shrink-0 animate-pulse" />
                          PPG HEART RATE COUPLING 生物理情绪心率指示灯联动
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed font-medium">
                          调用腕壁 PPG 传感器捕捉焦躁心率波频，联动自控 3200K 吸入式暖橙色温灯，实现自理时的生理安抚交互。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, feedbackHeartRate: !form.feedbackHeartRate })}
                        className={`w-12 h-7 rounded-full transition-all relative border-2 flex items-center p-0.5 outline-none cursor-pointer shrink-0 ${
                          form.feedbackHeartRate ? 'bg-gradient-to-t from-pink-400 to-rose-400 border-pink-400 justify-end' : 'bg-slate-205 bg-slate-200 border-slate-300 justify-start'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-md" />
                      </button>
                    </div>

                    {/* Safe margins */}
                    <div>
                      <label className="block text-[12px] font-extrabold text-slate-700 mb-2">
                        🧸 钝化防割圆倒角及零配件吞咽物理红线 (Safety margins)
                      </label>
                      <div className="bg-white border-2 border-orange-100 rounded-2xl p-4.5 shadow-sm">
                        <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <ShieldCheck className="w-5 h-5 text-[#059669]" />
                          符合 ASTM F963 &amp; EN71 安全基准：所有拆装零配件包络均 &gt; 31.7mm
                        </div>
                        <p className="text-[10.5px] text-slate-550 mt-1.5 leading-relaxed font-medium">
                          机壳边缘圆融倒角严格执行 R &gt;= 6.5mm 双面无锐角限制；整机在 &gt; 50N 静态拉伸及抗撕咬冲击中结构物不损坏不脱落，彻底阻绝气道误吞窒息。
                        </p>
                      </div>
                    </div>

                    {/* Color tone */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-extrabold text-slate-700">🎨指示 LED 色温 (无频闪视力防护光谱选型)</label>
                        <span className="text-[9.5px] font-mono text-orange-500 font-bold">LED SHADOW SHIELD</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['冷色', '暖色'].map((vTone) => {
                          const active = form.visualLightTone === vTone;
                          const activeStyle = vTone === '暖色' 
                            ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-md shadow-amber-100' 
                            : 'bg-sky-400 text-white border-sky-400 shadow-md shadow-sky-100';

                          return (
                            <button
                              type="button"
                              key={vTone}
                              onClick={() => setForm({ ...form, visualLightTone: vTone as '冷色' | '暖色' })}
                              className={`p-3 text-xs font-black rounded-xl border-2 text-center transition-all cursor-pointer ${
                                active 
                                  ? activeStyle 
                                  : 'bg-white border-orange-100 hover:border-orange-200 hover:bg-orange-50/10 text-slate-650'
                              }`}
                            >
                              {vTone === '暖色' ? '☀️ 暖色向日葵色 (3000K 防频闪)' : '❄️ 冷光荧蓝指示色 (6500K 高醒目)'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Acoustics and Haptic Vibe specs */}
                  <div className="space-y-5">
                    
                    {/* Sound spec slider */}
                    <div className="space-y-2 bg-gradient-to-br from-[#fffefc] to-[#fffdf5] border-2 border-orange-100 p-4 rounded-2xl text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <label className="font-extrabold text-[#703010] flex items-center gap-1.5 text-xs">
                          <Volume2 className="w-4 h-4 text-orange-500" />
                          内耳纤毛听觉声压安全抑制档
                        </label>
                        <span className="font-mono font-bold text-orange-600 bg-orange-100/40 px-2 py-0.5 rounded-lg text-[10.5px]">{form.audioVolume} % 出放量</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form.audioVolume}
                        onChange={(e) => setForm({ ...form, audioVolume: parseInt(e.target.value) })}
                        className="w-full h-2.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-400 my-1"
                      />
                      <div className="flex justify-between items-center text-[9.5px] text-slate-500 font-extrabold font-mono">
                        <span>学龄前儿歌级声压抑制</span>
                        <span className="text-orange-600">
                          {form.audioVolume <= 78 ? '物理防跌落降噪 <= 73dBA 绝对防聋保护' : '⚠️ 注意：已临界听觉防护峰值 >= 75dBA'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePlaySoundTest}
                        className="mt-2.5 w-full py-2.5 bg-[#fffcfa] hover:bg-orange-50/40 border-2 border-orange-200 border-b-4 text-orange-700 text-xs font-black rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                      >
                        🔔 听力安全防护：试听真实叮当音
                      </button>
                    </div>

                    {/* Resonant vibration settings with shaking wiggling effect */}
                    <div className="space-y-2.5">
                      <label className="text-[12px] font-extrabold text-slate-700 block">
                        ⏰ 触觉反馈：120Hz 极限低位移窄限震动反馈 (Narrowband Resonance)
                      </label>
                      
                      {[
                        { key: 'Success', name: '🏆 好习惯条件正向表扬强化', val: form.vibrationModeSuccess, stateProp: 'vibrationModeSuccess' },
                        { key: 'Danger', name: '🚨 溢出电子围栏防丢阻尼物理警戒', val: form.vibrationModeDanger, stateProp: 'vibrationModeDanger' },
                        { key: 'Nav', name: '✨ 导航雷达指针偏转角惯导对齐', val: form.vibrationModeNav, stateProp: 'vibrationModeNav' },
                      ].map((item) => {
                        const isShakingNow = shakeTrigger === item.name;
                        return (
                          <div 
                            key={item.key} 
                            style={{ contentVisibility: 'auto' }}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-white border-2 border-orange-100 rounded-xl hover:border-orange-300 transition-all ${
                              isShakingNow ? 'animate-bounce shadow-md border-orange-400' : ''
                            }`}
                          >
                            <span className="text-[11.5px] font-extrabold text-slate-750 flex items-center gap-1">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                              {['弱', '中', '强'].map((st) => (
                                <button
                                  type="button"
                                  key={st}
                                  onClick={() => setForm({ ...form, [item.stateProp]: st })}
                                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                                    item.val === st 
                                      ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white' 
                                      : 'bg-orange-50/50 text-[#8a5a40]/90 border border-orange-100 hover:bg-orange-100/30'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => handlePlayVibeTest(item.name, item.val)}
                                className="ml-1 px-3 py-1 bg-white hover:bg-orange-50 text-orange-600 border border-orange-250 hover:border-orange-450 rounded-lg text-[9.5px] font-black cursor-pointer shadow-sm transition-all"
                              >
                                <span>振动测试</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Habits closure and HALT checklists */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <CheckSquare className="w-5 h-5 text-orange-500" />
                    第四阶段：巴甫洛夫糖果色彩打卡链条、物理寿命应力疲劳可靠性 (HALT) 判定
                  </h2>
                  <p className="text-xs text-slate-505 mt-1 leading-relaxed">
                    好习惯闭环构建：依托物理感官表扬由外源辅助平滑引合至自主自觉。为了保障穿戴硬件在严酷冲击中的精密度，我们将多轴定位、跌落疲劳和出厂核签全线对齐。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Habits Enhancement Stages styled as a Train track list */}
                  <div className="space-y-2">
                    <label className="block text-[12px] font-extrabold text-[#903000] font-sans">
                      🍭 CANDY TRAIN TRACK 糖果列车习惯条件反射链
                    </label>
                    <div className="space-y-1.5 w-full max-h-[310px] overflow-y-auto pr-1">
                      {[
                        '设定挑战（家长APP）',
                        '执行与辅助（产品提示）',
                        '即时反馈（震动+语音表扬）',
                        '记录与复盘（同步APP）',
                        '升级难度（连续3次成功减半提示）',
                        '习惯内化（累计20次自动行为）'
                      ].map((stepText, idx) => {
                        const checked = form.habitClosedLoopSteps.includes(stepText);
                        
                        // Fun train coach colors
                        const colors = [
                          'border-[#fda4af] bg-[#fff5f6] text-pink-700',
                          'border-[#fed7aa] bg-[#fffbf0] text-amber-700',
                          'border-[#fef08a] bg-[#fffdf5] text-amber-800',
                          'border-[#a7f3d0] bg-[#f6fff9] text-emerald-700',
                          'border-[#c084fc] bg-[#faf5ff] text-indigo-700',
                          'border-[#93c5fd] bg-[#f0f7ff] text-sky-700'
                        ];

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
                                ? `${colors[idx % colors.length]} font-black shadow-sm` 
                                : 'bg-white border-orange-50 text-slate-500 hover:bg-orange-50/10'
                            }`}
                          >
                            <span className="text-[9px] font-bold font-sans bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md mt-0.5 shrink-0">车头 0{idx + 1}</span>
                            <div className="flex-1">
                              <div className="text-xs flex items-center justify-between font-black">
                                <span>{stepText}</span>
                                <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center text-[8px] shrink-0 ${
                                  checked ? 'bg-orange-400 border-orange-400 text-white' : 'border-orange-100'
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

                  {/* HALT Reliable tests */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-extrabold text-[#703010] mb-2 font-sans">
                        ⭐ 整机疲劳抗压阻抗 HALT 安全应力通过项
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'IMU姿态对齐算法', '跌落冲击抗震疲劳', '连接吞吐防穿墙', '听觉防刺高分频', 
                          'IP67防泪汗三防', '抗断拉及咬嚼限', '多轴传感容错机制', 
                          '物理打卡弹闩释能', '低压自恢复降额度'
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
                              className={`p-2.5 text-[11px] font-black rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#f4fbf8] border-emerald-400 text-emerald-700 shadow-sm' 
                                  : 'bg-white border-orange-100 hover:border-orange-200 text-slate-550'
                              }`}
                            >
                              <span>🍬 {test}</span>
                              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[7px] ${
                                active ? 'bg-[#059669] border-[#059669] text-white font-extrabold' : 'border-orange-200 bg-orange-50/10'
                              }`}>
                                {active && '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Standard safety audit */}
                    <div className="bg-gradient-to-br from-amber-50/40 to-pink-50/20 border-2 border-orange-100 rounded-2xl p-4.5 relative">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <FileCheck className="w-4 h-4 text-orange-550" />
                        <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest font-mono">
                          可靠性检测 Checklist
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-[#805040] leading-relaxed font-sans font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-500 font-extrabold">•</span>
                          <span>外壳双射高耐磨食品级液体硅胶 50°A 全包覆防护检验及格</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-500 font-extrabold">•</span>
                          <span>UWB 天线防静电突穿、物理天线容错信号衰估测及格</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-orange-500 font-extrabold">•</span>
                          <span>声能外放最高音调声压安全级低于 73dBA 听觉保护及格</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-orange-200/50 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-black text-slate-800">可信性安全签批状态：</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, checklistReady: !form.checklistReady })}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 border-b-4 shadow-sm cursor-pointer ${
                            form.checklistReady 
                              ? 'bg-gradient-to-tr from-emerald-400 to-[#10b981] border-emerald-450 text-white' 
                              : 'bg-[#fffcf9] border-orange-300 text-slate-650'
                          }`}
                        >
                          {form.checklistReady ? '✅ 物理可信性准予签发通过' : '🔬 参数测试自校评定中'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Technical Specification & PDF out */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-orange-100/40 pb-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                      <FileCheck className="w-5 h-5 text-orange-500" />
                      第五阶段：伴游儿童硬件自适应 AI 心理及 CMF 规格书装封签印
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      设计师 yamachi：本产品规格已经自动解算对齐，糖果色 A4 规格书已就绪，可一键发送并备份。
                    </p>
                  </div>
                  
                  {/* Export Trigger */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex items-center gap-1.5 bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-700 text-xs font-black px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-orange-500" />
                      <span>复制设计规格参数包</span>
                    </button>
                    <button
                      type="button"
                      onClick={exportPdfReport}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-95 text-white border-2 border-orange-400 text-xs font-black px-4.5 py-2.5 rounded-xl shadow-md border-b-4 border-orange-600 cursor-pointer transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>汇出 A4 糖果色规格书 PDF</span>
                    </button>
                  </div>
                </div>

                {/* Technical blueprint block (Styled as a gorgeous childlike colored blueprints layout) */}
                <div 
                  id="product-report-panel" 
                  className="bg-[#faf6f0] border-4 border-orange-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-md text-slate-805 select-text max-w-4xl mx-auto font-sans relative overflow-hidden"
                  style={{ backgroundImage: 'radial-gradient(#fed7aa 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}
                >
                  {/* Watermark bear stamp */}
                  <div className="absolute bottom-5 right-5 w-24 h-24 border-4 border-orange-300 border-dashed rounded-full flex flex-col items-center justify-center text-orange-400 opacity-25 font-bold font-sans rotate-12 select-none pointer-events-none">
                    <span className="text-xs">KidAI Approved</span>
                    <span className="text-[10px]">CMF合格印证</span>
                  </div>

                  {/* Header info */}
                  <div className="border-b-2 border-orange-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[9.5px] font-sans font-black tracking-widest rounded-lg shadow-sm">
                          🍭 TECHNICAL CMF SPECIFICATION SHEET V4.2
                        </span>
                      </div>
                      <h3 className="text-[17px] font-black text-slate-900 mt-2.5 flex items-center gap-2">
                        {reportName}
                      </h3>
                      <p className="text-[10.5px] text-orange-600/90 mt-1 flex items-center gap-2 font-mono font-bold">
                        <span>PRJ_代号: #{form.id}</span>
                        <span>|</span>
                        <span>签批签发时间: {form.lastSaved || new Date().toLocaleString()}</span>
                      </p>
                    </div>
                    
                    {/* Visual indicators */}
                    <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center border-t border-dashed border-orange-200 md:border-0 pt-3 md:pt-0">
                      <div className="text-[11.5px] font-mono font-bold text-white bg-pink-400 border-2 border-pink-450 rounded-xl px-3 py-1 tracking-wide shadow-sm">
                        LEVEL: L{form.independenceLevel === '比较独立' ? '3 授权级' : form.independenceLevel === '有点经验' ? '2 自立级' : '1 萌芽级'}
                      </div>
                      <div className="text-[8.5px] text-orange-500 font-mono mt-1 font-extrabold uppercase">KidAI Hardware lab</div>
                    </div>
                  </div>

                  {/* Specification Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Segment A */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-4.5 border-2 border-orange-100 shadow-sm relative">
                        <h4 className="text-[11.5px] font-black text-orange-600 uppercase tracking-wider mb-3 pb-1.5 border-b border-orange-50 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-orange-400" /> SECTION 01: 人机工学与心理建模层
                        </h4>
                        <table className="w-full text-[11.5px] text-slate-600 leading-normal">
                          <tbody className="divide-y divide-orange-50">
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">年龄基准分配层级</td>
                              <td className="py-2.5 text-slate-800 font-black text-right">适我国 4-6 岁安全设计对准</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">推荐探索地理微场景</td>
                              <td className="py-2.5 text-slate-800 font-black text-right truncate max-w-[170px]" title={form.travelScenes.map(s => SCENES_DISPLAY[s] || s).join(', ')}>
                                {form.travelScenes.map(s => s).join(' / ') || '未指定'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">自理自控抗挫评级</td>
                              <td className="py-2.5 text-right font-black">
                                <span className="px-2 py-0.5 rounded-lg bg-pink-50 text-pink-600 font-sans text-[9px] font-bold border border-pink-200">
                                  {LEVEL_DISPLAY[form.independenceLevel] || form.independenceLevel}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">安全目标干预反射因子</td>
                              <td className="py-2.5 text-slate-800 font-black text-right">
                                {form.habitsTarget.length > 0 ? form.habitsTarget.join(' + ') : '暂无'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">情绪唤醒性格反应阀级</td>
                              <td className="py-2.5 text-slate-800 font-black text-right">{PERSONALITY_DISPLAY[form.personality]}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Segment C */}
                      <div className="bg-white rounded-2xl p-4.5 border-2 border-orange-100 shadow-sm relative">
                        <h4 className="text-[11.5px] font-black text-[#8b5cf6] uppercase tracking-wider mb-3 pb-1.5 border-b border-orange-50 flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-violet-400" /> SECTION 03: 声振防刺与视觉色谱层
                        </h4>
                        <table className="w-full text-[11.5px] text-slate-600 leading-normal">
                          <tbody className="divide-y divide-orange-50">
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">情绪心率彩虹呼吸指示</td>
                              <td className="py-2.5 text-slate-805 font-bold text-right">{form.feedbackHeartRate ? '开 (反射式 PPG 双向呼吸闪烁)' : '关 (常稳态基本指示)'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">整机防咽圆角工艺厚度</td>
                              <td className="py-2.5 text-slate-805 font-bold text-right">安全外廓 &gt; 31.7mm + 倒角 R &gt;= 6.5mm</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">防闪烁 LED 发光色温</td>
                              <td className="py-2.5 text-slate-805 font-bold text-right">{vColorToneDesc(form.visualLightTone)}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">听力防护出外放最大级</td>
                              <td className="py-2.5 text-slate-805 font-mono text-right">不溢出 EN71 &lt;= 73dBA 隔膜范围 ({form.audioVolume}%设定)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-slate-450 font-bold">120Hz 微线性谐振分配档</td>
                              <td className="py-2.5 text-slate-850 font-black text-right text-pink-600">
                                奖赏/寻阻/警告: [{form.vibrationModeSuccess} / {form.vibrationModeNav} / {form.vibrationModeDanger}] 档
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Segment B */}
                    <div className="space-y-4">
                      
                      {/* Segment D */}
                      <div className="bg-white rounded-2xl p-4.5 border-2 border-orange-100 shadow-sm relative">
                        <h4 className="text-[11.5px] font-black text-emerald-600 uppercase tracking-wider mb-3 pb-1.5 border-b border-orange-50 flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-emerald-400" /> SECTION 02: 物理形态选型与传感阵
                        </h4>
                        <div className="space-y-3 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-450 block mb-1 font-bold">主穿戴物理形态工艺基座：</span>
                            <div className="flex flex-wrap gap-1.5">
                              {form.carriers.map(c => (
                                <span key={c} className="px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-100/60 text-orange-700 font-extrabold text-[9.5px]">
                                  {c}
                                </span>
                              ))}
                              {form.carriers.length === 0 && <span className="text-slate-400 font-mono">未选定载体形态</span>}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-450 block mb-1 font-bold">绑定精密多轴传感感知坞：</span>
                            <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto">
                              {form.sensors.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-md bg-slate-50 border border-orange-50 text-slate-500 text-[8.5px] font-mono">
                                  {s}
                                </span>
                              ))}
                              {form.sensors.length === 0 && <span className="text-slate-400 font-mono">暂无关联传感器</span>}
                            </div>
                          </div>

                          <div className="border-t border-dashed border-orange-250 border-orange-200 pt-3 leading-relaxed">
                            <span className="font-extrabold text-orange-600 block mb-1 text-[10px]">AI 自适应成长强化提示定义：</span>
                            <p className="text-slate-500 italic font-medium">{getRecommendedTask()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Notes Narrative */}
                      <div className="bg-[#fffefe] rounded-2xl p-4.5 border-2 border-dashed border-orange-200 text-[11px] text-[#805040] leading-relaxed shadow-3xs relative">
                        <span className="block font-black text-[#a04010] mb-1.5">
                          🗒️ 工业设计 CMF 婴幼防护工艺备注手记：
                        </span>
                        <p className="italic font-medium">
                          "{form.designNotes || '未提供手稿说明。设计团队默认强制执行: 100%无毒亲肤液体 LSR、边缘滚珠 R>=6.5mm 双射包覆指标阻燃标准。'}"
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Low part */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t-2 border-orange-200 col-span-1 md:col-span-2">
                    
                    {/* Closed loop habit series */}
                    <div className="space-y-2">
                      <h4 className="text-[11.5px] font-black text-[#0c4a6e] uppercase tracking-wider pb-1 border-b border-dashed border-orange-200 flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-sky-400" /> SECTION 04: 巴甫洛夫习惯条件反射打卡回路
                      </h4>
                      {form.habitClosedLoopSteps.length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-mono">未设置强化打卡环节</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                          {form.habitClosedLoopSteps.map((step, idx) => (
                            <div key={step} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 text-[10.5px] border border-orange-100/70 rounded-xl shadow-3xs">
                              <span className="w-4 h-4 rounded bg-orange-400 text-white text-[9px] font-mono font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-[#903000]/90 font-bold truncate">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* HALT test indicators */}
                    <div className="space-y-2">
                      <h4 className="text-[11.5px] font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-dashed border-orange-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECTION 05: HALT 可靠应力与出厂测试
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {form.testItems.map((test) => (
                          <div key={test} className="p-1.5 border border-orange-100 rounded-xl bg-white flex items-center gap-1 text-[10.5px] text-slate-655 text-slate-600 shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                            <span className="truncate">{test}试验合格</span>
                          </div>
                        ))}
                        {form.testItems.length === 0 && (
                          <span className="text-[10px] text-slate-400 font-mono col-span-2 py-3 bg-white border border-dashed border-orange-100 text-center rounded-xl">
                            未分配可靠应力检测
                          </span>
                        )}
                      </div>

                      {/* Safety sign status */}
                      <div className="pt-2 border-t border-dashed border-orange-200 flex items-center justify-between text-[11px] font-black text-slate-700">
                        <span>出厂安全审核总准入：</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-sans">
                          {form.checklistReady ? '✅ 机械力学/毒性检验总审签发通行' : '🔬 参数指标调试中'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* CAD margins */}
                  <div className="pt-4 border-t-2 border-orange-200/50 flex flex-col sm:flex-row items-center justify-between text-[8px] text-orange-500 font-mono font-bold col-span-1 md:col-span-2 gap-1.5">
                    <span>DESIGN SPECIFICATION AND CMF CHART APPROVED BY KIDAI LABS</span>
                    <span>yamachi DESIGN CO-CREATION LABS AT CURRENT WORKSPACE</span>
                  </div>
                </div>

                {/* Final advice guidance cards */}
                <div className="bg-orange-50/20 border-2 border-orange-100 rounded-2xl p-4 text-center max-w-4xl mx-auto">
                  <p className="text-[11.5px] text-[#a04010] leading-relaxed font-sans font-bold">
                    💡 出厂提示：可随时上滑点按上方彩虹列车 5 阶段直接进行参数重置调试。每次修改，系统都会在左侧备份卡槽中同步同步更新，时刻捍卫您的创意硬件规格！
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Nav Footer */}
          <footer className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => {
                setCurrentStep(currentStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4.5 py-3 text-xs font-black rounded-xl border-2 border-b-4 transition-all ${
                currentStep === 1 
                  ? 'bg-slate-100 text-slate-305 border-slate-200 cursor-not-allowed' 
                  : 'bg-white text-[#8a5020] border-orange-200 hover:bg-orange-50/20 cursor-pointer shadow-sm'
              }`}
            >
              <span className="flex items-center gap-1"><ArrowLeft className="w-4 h-4 stroke-[2.5]" /> 上一步</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && form.carriers.length === 0) {
                    showToast('请至少勾选一种形态载体基座（如手环、挂机等），以装载传感器！', 'error');
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 text-xs font-black rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 border-2 border-orange-400 border-b-4 text-white hover:opacity-95 shadow-md shadow-orange-100 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1">下一步 <ArrowRight className="w-4 h-4 stroke-[2.5]" /></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  showToast('已经返回第一步成长建模页，可重新校验参数', 'info');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4.5 py-2.5 text-xs font-black rounded-xl text-pink-600 hover:text-white bg-white hover:bg-pink-400 transition-all cursor-pointer border-2 border-dashed border-pink-300"
              >
                <span>返回首部重新建模 🔄</span>
              </button>
            )}
          </footer>

        </section>
      </main>
    </div>
  );
}

// Helpers
function vColorToneDesc(tone: string) {
  if (tone === '暖色') {
    return '☀️ 温暖向日葵系无频闪发光光谱 (3200K)';
  }
  return '❄️ 高色温冷白安全高亮指示发光光谱 (6500K)';
}
