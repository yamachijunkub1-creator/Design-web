import React, { useEffect, useRef, useState } from 'react';

interface CarrierCanvasProps {
  carriers: string[];
}

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

    // Background: Playful warm drawing paper texture
    ctx.fillStyle = '#fffdf7'; // soft yellow-cream paper
    ctx.fillRect(0, 0, width, height);

    // Draw playful sketch-grid lines (resembles kids mathematics notebook)
    ctx.strokeStyle = '#f1e4d3'; 
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

    // Centered paper coordinates
    const cx = width / 2;
    const cy = height / 2;

    // Draw some little background kid doodles (tiny stars and clouds)
    // Star 1
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(35, 35, 3, 0, Math.PI * 2);
    ctx.stroke();
    // Cloud 1
    ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
    ctx.beginPath();
    ctx.arc(width - 40, 35, 8, 0, Math.PI * 2);
    ctx.arc(width - 32, 33, 10, 0, Math.PI * 2);
    ctx.arc(width - 24, 35, 7, 0, Math.PI * 2);
    ctx.fill();

    if (!selectedCarrier) {
      // Draw playful empty state
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#b45309'; // warm amber-700
      ctx.font = 'bold 13px "Fredoka", "Quicksand", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧸 呜呼！暂无选中的设备载体', cx, cy - 15);
      
      ctx.fillStyle = '#d97706';
      ctx.font = '11px "Quicksand", sans-serif';
      ctx.fillText('请在步骤二勾选你喜欢的形态 (例如手环/挂坠)', cx, cy + 12);
      ctx.fillText('即可开始绘制童趣 AI 物理草图 ✨', cx, cy + 30);
      return;
    }

    // Set crayon style strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Helper to draw crayon style lines (rough hand-drawn feel by dual painting)
    const drawCrayonPath = (action: () => void, strokeColor: string, weight: number = 3) => {
      ctx.save();
      // Apply shadow to mimic soft wax color bleeds
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 1.5;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = weight;
      action();
      ctx.restore();
    };

    // Draw specific carrier design vector mapping
    switch (selectedCarrier) {
      case '可穿戴手环':
        // Draw band underneath in a soft pastel pink-red crayon tone
        drawCrayonPath(() => {
          ctx.beginPath();
          // Wristband background circle
          ctx.arc(cx, cy, 65, 0, Math.PI * 2);
          ctx.stroke();
        }, '#fda4af', 4); // soft rose wrist ring

        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.arc(cx, cy, 55, 0, Math.PI * 2);
          ctx.stroke();
        }, '#fecdd3', 2);

        // Core Bezel: Cute cat/bear-eared wrist device on top
        drawCrayonPath(() => {
          ctx.fillStyle = '#fffdf7';
          ctx.beginPath();
          // Cute cat ear left
          ctx.moveTo(cx - 20, cy - 65);
          ctx.lineTo(cx - 28, cy - 85);
          ctx.lineTo(cx - 10, cy - 75);
          // Cute cat ear right
          ctx.moveTo(cx + 20, cy - 65);
          ctx.lineTo(cx + 28, cy - 85);
          ctx.lineTo(cx + 10, cy - 75);
          ctx.stroke();
          ctx.fill();

          // Bezel round-rect body
          ctx.beginPath();
          ctx.roundRect(cx - 25, cy - 75, 50, 32, 10);
          ctx.fill();
          ctx.stroke();
        }, '#f43f5e', 3); // vibrant rose-500 crayon

        // Draw Screen Smiles face :)
        drawCrayonPath(() => {
          ctx.beginPath();
          // eyes
          ctx.arc(cx - 8, cy - 62, 2, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy - 62, 2, 0, Math.PI * 2);
          ctx.fill();
          // smile mouth arc
          ctx.beginPath();
          ctx.arc(cx, cy - 58, 6, 0.1, Math.PI - 0.1);
          ctx.stroke();
        }, '#1e293b', 2);

        // Kid-themed label callout annotations
        ctx.fillStyle = '#be123c'; // rose-700
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🐱 萌猫咪物理外壳', cx + 75, cy - 35);
        
        ctx.fillStyle = '#0f766e'; // teal-700
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('🍭 亲肤防敏硅胶 (Soft Food-Grade)', cx + 75, cy - 18);
        ctx.fillText('✨ 双色透光呼吸灯提示', cx + 75, cy - 2);

        ctx.fillStyle = '#6d28d9'; // purple-700
        ctx.fillText('📏 宝宝手骨适配 R:55mm', cx - 120, cy + 85);
        break;

      case '挂坠':
        // Draws pendant styled as a bright yellow lucky star!
        drawCrayonPath(() => {
          ctx.fillStyle = '#fffbeb'; // amber-50 background for star
          ctx.beginPath();
          // Draw lucky star
          const spikes = 5;
          const outerRadius = 40;
          const innerRadius = 18;
          let rot = (Math.PI / 2) * 3;
          let x = cx;
          let y = cy + 10;
          const step = Math.PI / spikes;

          ctx.moveTo(cx, cy + 10 - outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + 10 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + 10 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy + 10 - outerRadius);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#eab308', 3); // yellow neon crayon outline

        // Add a friendly smiley heart in the centers
        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.arc(cx - 6, cy + 6, 1.8, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy + 6, 1.8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(cx, cy + 12, 5, 0.1, Math.PI - 0.1);
          ctx.stroke();
        }, '#b45309', 2);

        // Top fabric dynamic safety hanging loop
        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy - 28);
          ctx.quadraticCurveTo(cx, cy - 55, cx, cy - 85);
          ctx.quadraticCurveTo(cx, cy - 55, cx + 8, cy - 28);
          ctx.stroke();
        }, '#3b82f6', 2.5); // sky-blue lanyard string

        // Annotations
        ctx.fillStyle = '#a16207'; // amber-800
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('⭐️ 黄金向日葵幸运星挂坠', cx + 60, cy + 10);
        
        ctx.fillStyle = '#0f766e';
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('🎀 防勒窒息安全扣挂绳 (Safety Grip)', cx + 60, cy + 26);
        ctx.fillText('🔊 骨传导提示 + 微振动马达', cx + 60, cy + 42);

        ctx.fillStyle = '#be123c';
        ctx.fillText('⚖️ 纯机身仅重 16克 (Super Light)', cx - 110, cy - 55);
        break;

      case '智能鞋带扣':
        // Angel Wings / Butterfly kid lace clip
        // Left Wing
        drawCrayonPath(() => {
          ctx.fillStyle = '#f0fdf4'; // Light green back fill
          ctx.beginPath();
          ctx.moveTo(cx - 10, cy);
          ctx.bezierCurveTo(cx - 45, cy - 40, cx - 65, cy - 20, cx - 45, cy);
          ctx.bezierCurveTo(cx - 65, cy + 20, cx - 45, cy + 40, cx - 10, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#22c55e', 2.5); // friendly emerald-500

        // Right Wing
        drawCrayonPath(() => {
          ctx.fillStyle = '#f0fdf4';
          ctx.beginPath();
          ctx.moveTo(cx + 10, cy);
          ctx.bezierCurveTo(cx + 45, cy - 40, cx + 65, cy - 20, cx + 45, cy);
          ctx.bezierCurveTo(cx + 65, cy + 20, cx + 45, cy + 40, cx + 10, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#22c55e', 2.5);

        // Center oval button
        drawCrayonPath(() => {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }, '#3b82f6', 3.5); // sky blue center

        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.arc(cx - 4, cy - 2, 1.5, 0, Math.PI * 2);
          ctx.arc(cx + 4, cy - 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy + 2, 4, 0, Math.PI);
          ctx.stroke();
        }, '#1e293b', 1.5);

        // Annotations
        ctx.fillStyle = '#15803d'; // green-700
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('👟 奔跑小飞翼鞋带搭扣', cx - 110, cy - 65);
        
        ctx.fillStyle = '#1e3a8a'; // navy-900
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('⚡ 蹦蹦跳跳压力传感器搭载', cx + 62, cy - 10);
        ctx.fillText('🧱 物理双扣咬合，稳固不丢掉', cx + 62, cy + 6);
        break;

      case '小行李箱':
        // Cute playful chubby penguin suitcase with round body & wheels!
        // Body outline
        drawCrayonPath(() => {
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(cx - 50, cy - 45, 100, 105, 25);
          ctx.fill();
          ctx.stroke();
        }, '#0284c7', 3.5); // bright sky-600

        // Cute penguin face belly shape
        drawCrayonPath(() => {
          ctx.fillStyle = '#fffbeb';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 15, 38, 40, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }, '#bae6fd', 1.5);

        // Smile eyes and tiny orange penguin beak
        drawCrayonPath(() => {
          ctx.fillStyle = '#eab308'; // orange/yellow peak
          ctx.beginPath();
          // left eye arc
          ctx.arc(cx - 15, cy - 10, 2.5, 0, Math.PI * 2);
          // right eye arc
          ctx.arc(cx + 15, cy - 10, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Beak
          ctx.beginPath();
          ctx.moveTo(cx - 6, cy - 2);
          ctx.lineTo(cx + 6, cy - 2);
          ctx.lineTo(cx, cy + 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#d97706', 2);

        // Suitcase Pulling rod
        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy - 45);
          ctx.lineTo(cx - 24, cy - 85);
          ctx.lineTo(cx + 24, cy - 85);
          ctx.lineTo(cx + 24, cy - 45);
          ctx.stroke();

          // Cute circular handle on top
          ctx.beginPath();
          ctx.arc(cx, cy - 85, 8, 0, Math.PI * 2);
          ctx.stroke();
        }, '#0284c7', 3);

        // Two chubby circular roller wheels at the bottom
        drawCrayonPath(() => {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 32, cy + 60, 10, 0, Math.PI * 2);
          ctx.arc(cx + 32, cy + 60, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }, '#64748b', 2.5);

        // Annotations
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🐧 伴游超萌企鹅拉杆箱', cx + 64, cy - 35);
        
        ctx.fillStyle = '#b45309';
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('🎡 双向多重防倾倒静音避震轮', cx + 64, cy - 18);
        ctx.fillText('📡 内嵌UWB高精度近场雷达', cx + 64, cy - 2);
        break;

      case '背包':
        // Playful dino-shelled backpack or bear-eared backpack
        // Main outline
        drawCrayonPath(() => {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          // Draw backpack bag curves
          ctx.moveTo(cx - 45, cy + 60);
          ctx.quadraticCurveTo(cx - 45, cy - 55, cx, cy - 55);
          ctx.quadraticCurveTo(cx + 45, cy - 55, cx + 45, cy + 60);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#8b5cf6', 3.5); // sweet violet-500

        // Draw cute baby-bear ears on top of bagpack
        drawCrayonPath(() => {
          ctx.fillStyle = '#f3e8ff';
          ctx.beginPath();
          ctx.arc(cx - 30, cy - 55, 12, 0, Math.PI * 2);
          ctx.arc(cx + 30, cy - 55, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }, '#8b5cf6', 2);

        // Draw sweet smiling face embroidery on backpack pocket
        drawCrayonPath(() => {
          ctx.fillStyle = '#faf5ff';
          ctx.beginPath();
          ctx.roundRect(cx - 30, cy + 10, 60, 42, 10);
          ctx.fill();
          ctx.stroke();
        }, '#a78bfa', 2);

        // face
        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.arc(cx - 10, cy + 25, 1.5, 0, Math.PI * 2);
          ctx.arc(cx + 10, cy + 25, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, cy + 29, 3.5, 0, Math.PI);
          ctx.stroke();
        }, '#4c1d95', 1.5);

        // Annotations
        ctx.fillStyle = '#6d28d9';
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🎒 熊嘟嘟萌耳防丢防拐小书包', cx + 58, cy + 10);
        
        ctx.fillStyle = '#0f766e';
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('🎈 双肩超柔云感减压肩带 (Ultra Light)', cx + 58, cy + 26);
        ctx.fillText('🌈 背面全彩微晶透亮柔光灯组', cx + 58, cy + 42);
        break;

      case '旅行印章机':
        // Draw cute stamp machine modeled like a happy little mushroom!
        drawCrayonPath(() => {
          ctx.fillStyle = '#fff5f5'; // red hue
          ctx.beginPath();
          // Round mushroom cap
          ctx.arc(cx, cy - 25, 35, Math.PI, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }, '#ef4444', 3.5); // red-500 crayons

        // Mushroom white dots
        drawCrayonPath(() => {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 15, cy - 38, 5, 0, Math.PI * 2);
          ctx.arc(cx + 15, cy - 38, 5, 0, Math.PI * 2);
          ctx.arc(cx, cy - 48, 6, 0, Math.PI * 2);
          ctx.fill();
        }, '#ffffff', 0.5);

        // Stem plunger and base
        drawCrayonPath(() => {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(cx - 16, cy - 10, 32, 70, 8);
          ctx.fill();
          ctx.stroke();
        }, '#f43f5e', 2.5);

        // Little stamp inkpad bottom
        drawCrayonPath(() => {
          ctx.fillStyle = '#ffe4e6';
          ctx.beginPath();
          ctx.roundRect(cx - 28, cy + 45, 56, 18, 6);
          ctx.fill();
          ctx.stroke();
        }, '#ef4444', 3);

        // Annotations
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🍄 敲章打卡“小红菇”趣味印章机', cx + 45, cy - 35);
        
        ctx.fillStyle = '#0f766e';
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('🎨 亲肤级天然无毒防过敏安全印油', cx + 45, cy - 18);
        ctx.fillText('🗺️ 走到特定景区集点自动释放锁扣', cx + 45, cy - 2);
        break;

      case '贴纸机':
        // Draw sweet friendly sticker tape printer looking like a happy toy toaster
        // Printer casing
        drawCrayonPath(() => {
          ctx.fillStyle = '#fffbeb';
          ctx.beginPath();
          ctx.roundRect(cx - 45, cy - 35, 90, 75, 15);
          ctx.fill();
          ctx.stroke();
        }, '#f59e0b', 3.5); // amber crayons yellow

        // Sticker tape strip feeding out with wave line
        drawCrayonPath(() => {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.rect(cx - 28, cy + 30, 56, 25);
          ctx.fill();
          ctx.stroke();
        }, '#10b981', 2); // green sticker tape paper outline

        // smiley face sticker print drawing
        drawCrayonPath(() => {
          ctx.beginPath();
          // eyes
          ctx.arc(cx - 8, cy + 40, 1.5, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy + 40, 1.5, 0, Math.PI * 2);
          ctx.fill();
          // smile
          ctx.beginPath();
          ctx.arc(cx, cy + 42, 4, 0, Math.PI);
          ctx.stroke();
        }, '#047857', 1.5);

        // Cute rotary key button on side
        drawCrayonPath(() => {
          ctx.beginPath();
          ctx.arc(cx - 45, cy - 5, 6, 0, Math.PI * 2);
          ctx.stroke();
        }, '#d97706', 2);

        // Annotations
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 11px "Quicksand", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📸 宝宝成长勋章打卡贴纸机', cx + 58, cy - 20);
        
        ctx.fillStyle = '#1e3a8a';
        ctx.font = '10px "Quicksand", sans-serif';
        ctx.fillText('📄 免墨水热敏高阻粘性儿童无毒贴纸', cx + 58, cy - 3);
        ctx.fillText('🎯 自带裁切齿型，防割手安全保护', cx + 58, cy + 14);
        break;

      default:
        break;
    }
  }, [selectedCarrier, carriers]);

  return (
    <div className="bg-[#fdf9f3] border-3 border-amber-950/20 rounded-3xl p-4 overflow-hidden shadow-[4px_4px_0px_0px_#7c2d12] flex flex-col h-full justify-between select-none relative">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-amber-200 pb-2 mb-3">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-display tracking-wide uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          🎨 奇趣 2D 搭载物理手绘草案
        </span>
        {carriers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {carriers.map((carrier) => (
              <button
                key={carrier}
                type="button"
                onClick={() => setSelectedCarrier(carrier)}
                className={`px-3 py-1 text-xs font-bold transition-all rounded-full border-2 ${
                  selectedCarrier === carrier
                    ? 'bg-rose-500 text-white border-amber-900 shadow-[2px_2px_0px_0px_#7c2d12]'
                    : 'bg-white text-amber-900 border-amber-900/40 hover:bg-amber-100/50'
                }`}
              >
                {carrier}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center relative bg-white/40 rounded-2xl p-1.5 border border-dashed border-amber-200">
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="rounded-xl border-2 border-amber-950/15 max-w-full aspect-[20/13]"
        />
        {carriers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-50/20 backdrop-blur-[1px] pointer-events-none">
            <span className="text-xs text-amber-700/60 font-medium bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200">
              🧸 暂未勾选产品物理形态
            </span>
          </div>
        )}
      </div>

      <div className="mt-2.5 text-[10px] text-amber-800/65 font-mono text-center flex items-center justify-center gap-1">
        <span>✏️ 童伴实验室自动拟定 CMF 安全工程图样 / Vector Blueprint</span>
      </div>
    </div>
  );
}
