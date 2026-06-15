import React, { useEffect, useRef, useState } from 'react';

interface CarrierCanvasProps {
  carriers: string[];
}

const CARRIER_MUTED_THEMES: Record<string, { bg: string, text: string, border: string, dot: string, activeClass: string }> = {
  '可穿戴手环': {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-300',
    dot: 'bg-pink-500',
    activeClass: 'bg-pink-400 text-white border-pink-400 shadow-sm shadow-pink-100'
  },
  '挂坠': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    activeClass: 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-100'
  },
  '智能鞋带扣': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
    activeClass: 'bg-emerald-400 text-white border-emerald-400 shadow-sm shadow-emerald-100'
  },
  '小行李箱': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-300',
    dot: 'bg-sky-500',
    activeClass: 'bg-sky-400 text-white border-sky-400 shadow-sm shadow-sky-100'
  },
  '背包': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-300',
    dot: 'bg-violet-500',
    activeClass: 'bg-violet-400 text-white border-violet-400 shadow-sm shadow-violet-100'
  },
  '旅行印章机': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    dot: 'bg-rose-500',
    activeClass: 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-100'
  },
  '贴纸机': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
    activeClass: 'bg-orange-400 text-white border-orange-400 shadow-sm shadow-orange-100'
  }
};

export default function CarrierCanvas({ carriers }: CarrierCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');

  // Settle active carrier selection when carrier list changes
  useEffect(() => {
    if (carriers.length > 0) {
      if (!carriers.includes(selectedCarrier)) {
        setSelectedCarrier(carriers[0]);
      }
    } else {
      setSelectedCarrier('');
    }
  }, [carriers, selectedCarrier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background: Playful, sweet cream milk color instead of clinical white
    ctx.fillStyle = '#fffcfa';
    ctx.fillRect(0, 0, width, height);

    // Draw precise child-friendly blueprint grids (20px spacing with whimsical pastel colors)
    ctx.strokeStyle = '#fbf0eb'; 
    ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Technical Alignment Crosshair with sweet peach-orange accent
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 1.2;
    
    // Corner Markups - Cute round target style marks
    const drawCornerCircularMark = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawCornerCircularMark(20, 20);
    drawCornerCircularMark(width - 20, 20);
    drawCornerCircularMark(20, height - 20);
    drawCornerCircularMark(width - 20, height - 20);

    // Cute Kid-themed scale bar in bottom left
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, height - 16);
    ctx.lineTo(75, height - 16);
    ctx.moveTo(25, height - 20); ctx.lineTo(25, height - 12);
    ctx.moveTo(75, height - 20); ctx.lineTo(75, height - 12);
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('50 mm 积木刻度', 50, height - 24);

    const cx = width / 2;
    const cy = height / 2;

    if (!selectedCarrier) {
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍭 未选定物理载体 🎈', cx, cy - 8);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10.5px "Inter", sans-serif';
      ctx.fillText('请在步骤中选定形态载体以载入 2D 糖果色机构概念图', cx, cy + 14);
      ctx.fillText('（支持手环、挂坠、鞋扣、背包等童趣模型）', cx, cy + 28);
      return;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Helper to draw clean paths with sweet color fills
    const drawColoredShape = (
      strokeColor: string, 
      fillColor: string, 
      weight: number, 
      drawFn: () => void
    ) => {
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.lineWidth = weight;
      ctx.beginPath();
      drawFn();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    // Draw specific carrier design vector mapping in a gorgeous, playful style
    switch (selectedCarrier) {
      case '可穿戴手环':
        // Wristband background strap (Bubblegum pink)
        drawColoredShape('#f43f5e', '#ffe4e6', 2.5, () => {
          ctx.arc(cx - 20, cy, 65, 0, Math.PI * 2);
        });

        // Inner security skin layer (Cream lilac)
        drawColoredShape('#fb7185', '#fff1f2', 1.5, () => {
          ctx.arc(cx - 20, cy, 55, 0, Math.PI * 2);
        });

        // Cat or Bear-eared Main Tracker Module Case (Active Coral Red)
        drawColoredShape('#e11d48', '#fda4af', 2.2, () => {
          // Left rounded ear
          ctx.arc(cx - 36, cy - 65, 12, 0, Math.PI * 2);
          // Right rounded ear
          ctx.arc(cx - 4, cy - 65, 12, 0, Math.PI * 2);
        });

        // Core round rect display screen housing
        drawColoredShape('#be123c', '#ffffff', 2.2, () => {
          ctx.roundRect(cx - 42, cy - 58, 44, 34, 10);
        });

        // Playful smiling HUD face on display screen
        drawColoredShape('#be123c', '#be123c', 1.5, () => {
          ctx.arc(cx - 28, cy - 43, 2, 0, Math.PI * 2);
          ctx.arc(cx - 12, cy - 43, 2, 0, Math.PI * 2);
        });
        ctx.beginPath();
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 1.8;
        ctx.arc(cx - 20, cy - 39, 4, 0, Math.PI);
        ctx.stroke();

        // Professional child CMF comments in rich styling
        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('LSR 食品级液体硅胶双色手环', cx + 55, cy - 35);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・双射包模：邵氏51°A极柔手感', cx + 55, cy - 18);
        ctx.fillText('・物理阻尼：倒角R>=6.8mm无切角', cx + 55, cy - 2);
        ctx.fillText('・色彩配置：糖果玫瑰粉配防敏膜面', cx + 55, cy + 14);

        ctx.fillStyle = '#db2777';
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
        ctx.fillText('内壁防滑双向排汗防丢环圈 D:110mm', cx - 145, cy + 85);
        break;

      case '挂坠':
        // Draw hanging loop lanyard (Cute Skyblue braided rope)
        drawColoredShape('#0284c7', '#e0f2fe', 2, () => {
          ctx.moveTo(cx - 12, cy - 25);
          ctx.quadraticCurveTo(cx - 12, cy - 55, cx - 12, cy - 85);
          ctx.quadraticCurveTo(cx - 12, cy - 55, cx + 4, cy - 25);
        });

        // Pendant body is drawn as a cute golden star or blossom cookie
        drawColoredShape('#d97706', '#fef3c7', 2.2, () => {
          const spikes = 5;
          const outerRadius = 38;
          const innerRadius = 18;
          let rot = (Math.PI / 2) * 3;
          let x = cx - 12;
          let y = cy + 15;
          const step = Math.PI / spikes;

          ctx.moveTo(cx - 12, y - outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = cx - 12 + Math.cos(rot) * outerRadius;
            y = cy + 15 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx - 12 + Math.cos(rot) * innerRadius;
            y = cy + 15 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.closePath();
        });

        // Face profile detail - cute star smiley
        drawColoredShape('#b45309', '#b45309', 1.5, () => {
          ctx.arc(cx - 18, cy + 10, 1.8, 0, Math.PI * 2);
          ctx.arc(cx - 6, cy + 10, 1.8, 0, Math.PI * 2);
        });
        ctx.beginPath();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.8;
        ctx.arc(cx - 12, cy + 15, 3.5, 0, Math.PI);
        ctx.stroke();

        // CMF and Specs notes
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('防勒脱卸骨传导声振挂坠', cx + 55, cy - 5);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・材质：环保阻燃抗菌ABS树脂壳', cx + 55, cy + 12);
        ctx.fillText('・拉力扣：受恒拉力>45N自主物理脱销', cx + 55, cy + 28);
        ctx.fillText('・扬声：骨传导振片安全过滤中低频', cx + 55, cy + 44);

        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
        ctx.fillText('星月饼干挂绳扣重: 仅 14.5g', cx - 145, cy - 55);
        break;

      case '智能鞋带扣':
        // Clovers active green wing clip layout (Left wing)
        drawColoredShape('#059669', '#d1fae5', 2, () => {
          ctx.moveTo(cx - 12, cy);
          ctx.bezierCurveTo(cx - 45, cy - 35, cx - 65, cy - 15, cx - 45, cy);
          ctx.bezierCurveTo(cx - 65, cy + 15, cx - 45, cy + 35, cx - 12, cy);
          ctx.closePath();
        });

        // Right wing
        drawColoredShape('#059669', '#d1fae5', 2, () => {
          ctx.moveTo(cx + 12, cy);
          ctx.bezierCurveTo(cx + 45, cy - 35, cx + 65, cy - 15, cx + 45, cy);
          ctx.bezierCurveTo(cx + 65, cy + 15, cx + 45, cy + 35, cx + 12, cy);
          ctx.closePath();
        });

        // Center protective capsule (Sunny yellow cookie style)
        drawColoredShape('#d97706', '#fef3c7', 2, () => {
          ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        });

        // Smiling capsule face design
        drawColoredShape('#b45309', '#b45309', 1, () => {
          ctx.arc(cx - 4, cy - 3, 1.5, 0, Math.PI * 2);
          ctx.arc(cx + 4, cy - 3, 1.5, 0, Math.PI * 2);
        });
        ctx.beginPath();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.8;
        ctx.arc(cx, cy + 2, 4, 0, Math.PI);
        ctx.stroke();

        // Technical annotations
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('微型10轴IMU智能鞋扣', cx - 110, cy - 65);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・外壳：高抗冲超声波熔接尼龙玻纤', cx + 62, cy - 10);
        ctx.fillText('・卡接：免踩带双档高阻咬合卡槽', cx + 62, cy + 6);
        ctx.fillText('・颜色：丛林四叶草绿，防丢率+90%', cx + 62, cy + 22);
        break;

      case '小行李箱':
        // Skyblue Rounded penguin suitcase outline
        drawColoredShape('#0284c7', '#e0f2fe', 2.2, () => {
          ctx.roundRect(cx - 50, cy - 35, 100, 95, 20);
        });

        // Inner belly panel layout (Cute snow belly)
        drawColoredShape('#0ea5e9', '#fafafa', 1.2, () => {
          ctx.ellipse(cx, cy + 20, 36, 36, 0, 0, Math.PI * 2);
        });

        // Face profile details (Cute yellow penguin mouth/cheeks)
        drawColoredShape('#ea580c', '#fed7aa', 1.2, () => {
          ctx.arc(cx - 15, cy + 5, 2.5, 0, Math.PI * 2);
          ctx.arc(cx + 15, cy + 5, 2.5, 0, Math.PI * 2);
        });
        drawColoredShape('#d97706', '#f59e0b', 1, () => {
          ctx.moveTo(cx - 6, cy + 12);
          ctx.lineTo(cx + 6, cy + 12);
          ctx.lineTo(cx, cy + 18);
          ctx.closePath();
        });

        // Suitcase Pulling telescopic rod (Yellow star handle!)
        drawColoredShape('#475569', '#cbd5e1', 2, () => {
          ctx.rect(cx - 22, cy - 68, 5, 33);
          ctx.rect(cx + 17, cy - 68, 5, 33);
        });
        // Drawing star head on the handle
        drawColoredShape('#d97706', '#fef3c7', 2, () => {
          ctx.roundRect(cx - 16, cy - 75, 32, 10, 4);
        });

        // Two bouncy roller wheels in deep active teal
        drawColoredShape('#115e59', '#14b8a6', 2, () => {
          ctx.arc(cx - 32, cy + 60, 10, 0, Math.PI * 2);
          ctx.arc(cx + 32, cy + 60, 10, 0, Math.PI * 2);
        });

        // Suitcase specifications details
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('小企鹅自随智感声像拉杆箱', cx + 64, cy - 35);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・聚碳酸酯：三层复合防撞防刮壳体', cx + 64, cy - 18);
        ctx.fillText('・UWB芯片：定位精度控制在5cm以内', cx + 64, cy - 2);
        ctx.fillText('・防撞锁嘴：阻尼减震结构消弭侧翻迹', cx + 64, cy + 14);
        break;

      case '背包':
        // Bear-eared backpack outline in cheerful Grape violet
        drawColoredShape('#7c3aed', '#f3e8ff', 2.2, () => {
          ctx.moveTo(cx - 42, cy + 60);
          ctx.quadraticCurveTo(cx - 42, cy - 50, cx + 3, cy - 50);
          ctx.quadraticCurveTo(cx + 48, cy - 50, cx + 48, cy + 60);
          ctx.closePath();
        });

        // Soft toy bear ears shapes on top (Lavender violet)
        drawColoredShape('#7c3aed', '#edd9ff', 1.2, () => {
          ctx.arc(cx - 24, cy - 50, 12, 0, Math.PI * 2);
          ctx.arc(cx + 30, cy - 50, 12, 0, Math.PI * 2);
        });

        // Toy-style zipper pocket panel (Bright lemon yellow)
        drawColoredShape('#d97706', '#fef3c7', 1.2, () => {
          ctx.roundRect(cx - 25, cy + 12, 56, 40, 8);
        });

        // Pack's small bear nose face
        drawColoredShape('#4c1d95', '#4c1d95', 1, () => {
          ctx.arc(cx - 4, cy + 28, 1.2, 0, Math.PI * 2);
          ctx.arc(cx + 12, cy + 28, 1.2, 0, Math.PI * 2);
          ctx.beginPath();
          ctx.arc(cx + 4, cy + 32, 2.5, 0, Math.PI);
          ctx.stroke();
        });

        // Lanyard loop hanger on top
        drawColoredShape('#6d28d9', '#c084fc', 2, () => {
          ctx.arc(cx + 3, cy - 50, 8, Math.PI, 0);
        });

        // Annotations
        ctx.fillStyle = '#6d28d9';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('抗菌定位防摔熊耳双肩背包', cx + 60, cy + 10);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・防震：高孔蜂窝透气中空物理肩垫', cx + 60, cy + 26);
        ctx.fillText('・反光：背面高透微晶逆反射荧光条', cx + 60, cy + 42);
        ctx.fillText('・工艺：高耐磨防割拒水涤纶长棉织', cx + 60, cy + 58);
        break;

      case '旅行印章机':
        // Mushroom dynamic plunger design (Strawberry Red cap)
        drawColoredShape('#dc2626', '#fee2e2', 2.2, () => {
          ctx.arc(cx - 8, cy - 25, 36, Math.PI, 0);
          ctx.closePath();
        });

        // White decorative polka dots inside strawberry cap
        drawColoredShape('#ef4444', '#ffffff', 0.5, () => {
          ctx.arc(cx - 25, cy - 38, 4.5, 0, Math.PI * 2);
          ctx.arc(cx + 10, cy - 38, 4.5, 0, Math.PI * 2);
          ctx.arc(cx - 8, cy - 48, 5, 0, Math.PI * 2);
        });

        // White sturdy ergonomic stem container
        drawColoredShape('#ef4444', '#ffffff', 1.8, () => {
          ctx.roundRect(cx - 20, cy - 10, 24, 65, 5);
        });

        // Cheerful ink stamp base housing (Vibrant candy orange)
        drawColoredShape('#ea580c', '#ffedd5', 2.2, () => {
          ctx.roundRect(cx - 32, cy + 40, 48, 18, 5);
        });

        // Specifications and details
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('物理微机电印盖打卡模组', cx + 50, cy - 35);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・印油：无毒环保可洗植物花青素浆', cx + 50, cy - 18);
        ctx.fillText('・卡销：近场UWB验证解锁自动爆破栓', cx + 50, cy - 2);
        ctx.fillText('・防护：整件尺寸符合ASTM窒息基准', cx + 50, cy + 14);
        break;

      case '贴纸机':
        // Printer casing (Bright Tangerine Orange)
        drawColoredShape('#ea580c', '#fff7ed', 2.2, () => {
          ctx.roundRect(cx - 45, cy - 30, 85, 70, 15);
        });

        // Exit printed sticker sheet paper (Sweet Lime green printed sheet)
        drawColoredShape('#15803d', '#f0fdf4', 1.8, () => {
          ctx.rect(cx - 28, cy + 30, 52, 22);
        });

        // Printed teddy smile face illustration on sticker
        drawColoredShape('#166534', '#166534', 1, () => {
          ctx.arc(cx - 8, cy + 38, 1.2, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy + 38, 1.2, 0, Math.PI * 2);
          ctx.beginPath();
          ctx.arc(cx, cy + 41, 3, 0, Math.PI);
          ctx.stroke();
        });

        // Cute gear wheel for rotary paper scroll
        drawColoredShape('#1e293b', '#64748b', 1.5, () => {
          ctx.arc(cx - 45, cy - 5, 6, 0, Math.PI * 2);
        });

        // Descriptions
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 11.5px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('热敏不干胶徽章打印模组', cx + 55, cy - 20);
        
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('・载体：零双酚A不干胶热敏微层析', cx + 55, cy - 3);
        ctx.fillText('・防护：带物理绝缘齿的钝化裁纸口', cx + 55, cy + 14);
        ctx.fillText('・打卡：自理挑战成功瞬时吐出贴纸', cx + 55, cy + 30);
        break;

      default:
        break;
    }
  }, [selectedCarrier, carriers]);

  return (
    <div className="bg-gradient-to-br from-amber-50/40 to-pink-50/30 border-2 border-orange-200/60 rounded-2xl p-4.5 overflow-hidden shadow-sm flex flex-col h-full justify-between select-none relative">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100/55 pb-2.5 mb-3">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans tracking-wide uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
          2D 儿童硬件载具糖果色剖面设计图
        </span>
        {carriers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {carriers.map((carrier) => {
              const theme = CARRIER_MUTED_THEMES[carrier];
              const isSelected = selectedCarrier === carrier;
              return (
                <button
                  key={carrier}
                  type="button"
                  onClick={() => setSelectedCarrier(carrier)}
                  className={`px-3 py-1 text-[11px] font-bold transition-all rounded-lg border-2 ${
                    isSelected
                      ? theme?.activeClass || 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-650 border-orange-100 hover:border-orange-200 hover:bg-orange-50/30'
                  }`}
                >
                  {carrier}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative bg-[#fffdfa]/80 rounded-xl p-1.5 border-2 border-orange-100/50 shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="rounded-lg max-w-full aspect-[20/13]"
        />
        {carriers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-orange-50/20 backdrop-blur-[0.5px] pointer-events-none">
            <span className="text-xs text-orange-600 font-extrabold bg-white px-3.5 py-2 rounded-full border border-orange-200 shadow-md flex items-center gap-1">
              🍭 请在步骤中选定形态载具 (手环、挂坠等) 🎈
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 text-[9.5px] text-orange-400/80 font-mono text-center flex items-center justify-center gap-1.5">
        <span>© KidAI CAD-Draft Co-creation Labs • Child Safety Approved</span>
      </div>
    </div>
  );
}
