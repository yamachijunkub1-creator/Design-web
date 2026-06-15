export interface ProductConfig {
  id: string;
  name: string;
  lastSaved: string;
  
  // Step 1: User Modeling
  travelScenes: string[]; // ['交通枢纽', '游乐园', '自然探索', '住宿', '短途', '长途']
  independenceLevel: '初学' | '有点经验' | '比较独立';
  habitsTarget: string[]; // ['不跑远', '记住物品', '完成简单指令']
  personality: '内向' | '外向';
  
  // Step 2: Product Carrier & Sensors
  carriers: string[]; // ['可穿戴手环', '挂坠', '智能鞋带扣', '小行李箱', '背包', '旅行印章机', '贴纸机']
  sensors: string[]; // List of sensors checked
  designNotes: string;
  sketchImage: string | null; // Base64 or ObjectURL string for preview
  
  // Step 3: Sensory Delivery Design
  feedbackHeartRate: boolean;
  visualLightTone: '冷色' | '暖色';
  audioVolume: number; // 0 - 100
  vibrationModeSuccess: '弱' | '中' | '强';
  vibrationModeDanger: '弱' | '中' | '强';
  vibrationModeNav: '弱' | '中' | '强';
  
  // Step 4: Habits & Test
  habitClosedLoopSteps: string[]; // Selected steps
  testItems: string[]; // Selected verification tests
  checklistReady: boolean;
}

export interface HistoryItem {
  id: string;
  name: string;
  lastSaved: string;
  config: ProductConfig;
}
