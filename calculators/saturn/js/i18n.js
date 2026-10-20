const I18N = {
  "zh": {
    "title": "S1 $STRN 空投计算器",
    "subtitle": "输入 S1 积分，计算代币数量与价值",
    "langSwitch": "EN",
    "yourPoints": "我的 S1 积分",
    "parameters": "S1 分配参数",
    "s1Total": "S1 最终积分总量",
    "pointsLoading": "正在加载 S1 总积分…",
    "pointsUnavailable": "S1 总积分加载失败，请刷新页面重试。",
    "totalHint": "使用现有接口积分总量作为 S1 固定分母，不预测增长。",
    "fdv": "估算 FDV（USD）",
    "supply": "代币总量",
    "allocation": "空投比例（沿用原假设）",
    "tokens": "预估获得代币数量",
    "value": "预估空投价值",
    "price": "代币单价",
    "formula": "代币数量 = 我的 S1 积分 ÷ S1 总积分 × 5% × 10 亿；价值 = 代币数量 ×（FDV ÷ 10 亿）。",
    "missing": "等待 S1 总积分加载后计算。",
    "invalid": "个人积分不能为负数或超过 S1 总量，FDV 必须是非负数。",
    "loading": "正在获取 Aspecta 盘前 FDV，可手动修改。",
    "synced": "已获取 Aspecta 盘前 FDV，可手动修改。",
    "manual": "盘前 FDV 暂不可用，请手动填写估值。",
    "footer_note": "按积分占比分配的估算结果，实际空投以项目方最终方案为准。"
  },
  "en": {
    "title": "S1 $STRN Airdrop Calculator",
    "subtitle": "Enter S1 points to estimate tokens and value",
    "langSwitch": "中",
    "yourPoints": "My S1 Points",
    "parameters": "S1 Allocation Parameters",
    "s1Total": "Final S1 Total Points",
    "pointsLoading": "Loading S1 total points…",
    "pointsUnavailable": "S1 points unavailable. Refresh to retry.",
    "totalHint": "Uses the existing API points total as the fixed S1 denominator, without growth projections.",
    "fdv": "Estimated FDV (USD)",
    "supply": "Total Supply",
    "allocation": "Airdrop Allocation (existing assumption)",
    "tokens": "Estimated Token Allocation",
    "value": "Estimated Airdrop Value",
    "price": "Token price",
    "formula": "Tokens = your S1 points / total S1 points × 5% × 1 billion. Value = tokens × (FDV / 1 billion).",
    "missing": "Waiting for the S1 total points to calculate.",
    "invalid": "Your points must be between zero and the S1 total. FDV must be non-negative.",
    "loading": "Loading Aspecta premarket FDV; you can edit it manually.",
    "synced": "Aspecta premarket FDV loaded; you can edit it manually.",
    "manual": "Premarket FDV unavailable. Enter your valuation manually.",
    "footer_note": "Proportional allocation estimate. Actual airdrop depends on the final project rules."
  }
};
let currentLang = 'zh';
function t(key) { return I18N[currentLang][key] || key; }
function toggleLang() {
  const ids = ['currentPoints', 'fdv'];
  const values = ids.map(id => document.getElementById(id).value);
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  renderAll();
  ids.forEach((id, index) => { document.getElementById(id).value = values[index]; });
  updateResults();
}
