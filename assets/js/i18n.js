/* Global i18n dictionary */
window.I18N = {
  zh: {
    site_title: "萌芽社区",
    hero_title: "陈小萌",
    hero_tagline: "萌芽社区 Founder/BTC Holder/DEFI 玩家",
    btn_tg: "加入 Telegram 群",
    btn_x: "关注 X（Twitter）",
	search_placeholder: "搜索 工具 / 交易所 / 券商…",
    btn_discord: "加入 Discord",
    btn_wechat: "加入 微信群",
    tools_title: "工具",
    falcon_modal_title: "Falcon 空投计算器",
    modal_close: "关闭",
    exchanges_title: "交易所",
    broker_title: "出入金渠道 · 美/港股",
    footer_note: "made by @Menglayer",
	// === zh 新增 ===
	btn_donate: "请我喝咖啡 ☕",
	donate_title: "请我喝杯咖啡",
	donate_desc: "如果这个网站对你有帮助，欢迎小额捐赠支持。（可能会发生一些好事🎁）",
	donate_btc: "BTC",
	donate_eth: "ETH（ERC20）",
	donate_sol: "SOL",
	donate_copy: "复制",
	donate_copied: "已复制！",
    cards: {
      /* 工具 */
      falcon: { title: "Falcon 空投计算器", desc: "估算你的 $Falcon 空投额度。" },
	  addrproof: { title: "地址证明生成器", desc: "一键生成地址/居住证明照片/PDF。" },
	  bnalpha: { title: "币安 Alpha 助手",  desc: "Alpha信号助手,空投闹钟提醒。" },
	  pendleyt: { title: "Pendle YT计算器",  desc: "计算 YT 到期赎回价值、贴现/年化收益率与盈亏平衡点。" },
	  backpack_calc: {title: "Backpack 空投计算器", desc: "一键估算 Backpack 大空投的积分价值与占比。"},
	  tsc: { title: "代币合约检测", desc: "一键检测 ERC/BEP 等合约的常见风险与权限。" },
      airdrop_universal: { title: "通用空投计算器", desc: "自定义 FDV/空投比例，估算积分/代币价值与份额。" },
      fundingfee: { title: "合约价差/资金费看板", desc: "多交易所基差、资金费率与期现价差对比。" },
	  apr: {title: "年化复利计算器", desc: "APR ↔ APY 转换、复利周期可选、可视化收益曲线"},
	  borrow_risk: { title: "借贷风险计算器", desc: "支持抵押率/清算阈值/循环贷次数等一键换算。" },
	  kaito_yaps: { title: "Kaito Yaps 看板", desc: "跟踪 Kaito 社区 YAP/活跃度趋势，支持按用户/时间查看。" },
	  clammv3: { title: "LP V3 模拟器", desc: "Uniswap V3 区间做市 & IL（无常损失）模拟器。" },



      /* 交易所 */
      binance:   { title: "币安",        desc: "全球交易量领先的加密货币交易所，覆盖现货、合约与理财。" },
      backpack:  { title: "Backpack ",   desc: "由 Backpack 团队打造的合规交易所，SOL 原生生态友好。" },
      bitget:    { title: "Bitget",      desc: "以合约见长的交易平台，支持复制交易与量化工具。" },
      bybit:     { title: "Bybit",       desc: "头部衍生品交易所，深度充足、撮合稳定，产品完善。" },
      okx:       { title: "OKX",         desc: "综合型交易所，集交易、Web3 钱包与 DeFi 聚合于一体。" },
      ourbit:    { title: "Ourbit",      desc: "新兴现货与衍生品平台，提供多资产交易与返佣激励。" },
      gate:      { title: "Gate",        desc: "老牌平台，币种丰富、上新快速，支持现货、合约与理财。" },

      /* 出入金/券商 */
      ifast:     { title: "iFAST 英国银行（送 £40）",    desc: "英国受监管的数字银行，提供多币种账户与支付卡。" },
      longbridge:{ title: "长桥证券 终身免佣（送￥900）", desc: "港美股券商，长期 0 佣金，研究与行情工具完整。" },
      t212:      { title: "Trading212（送 £100）",       desc: "英国券商，支持零碎股与免佣 ETF/股票投资。" }
    }
  },
  en: {
    site_title: "MengLayer Community",
    hero_title: "Menglayer",
    hero_tagline: "MengLayer Community Founder/BTC Holder/DEFI Players",
    btn_tg: "Join Telegram",
    btn_x: "Follow on X",
	search_placeholder: "Search tools / exchanges / brokerage…",
    btn_discord: "Join Discord",
    btn_wechat: "Join WeChat",
    tools_title: "Tools",
    falcon_modal_title: "Falcon Airdrop Calculator",
    modal_close: "Close",
    exchanges_title: "Exchanges",
    broker_title: "On/Off-Ramp · US/HK Brokerage",
    footer_note: "made by @Menglayer",
	// === en 新增 ===
	btn_donate: "Buy me a coffee ☕",
	donate_title: "Buy me a coffee",
	donate_desc: "If this site helped you, a small tip is appreciated.",
	donate_btc: "BTC",
	donate_eth: "ETH(ERC20)",
	donate_sol: "SOL",
	donate_copy: "Copy",
	donate_copied: "Copied!",
    cards: {
      /* Tools */
      falcon: { title: "Falcon Airdrop Calculator", desc: "Estimate your $Falcon airdrop value" },
	  addrproof: { title: "Address Proof Generator", desc: "Instantly generate address/residency proof Picture&PDF." },
	  bnalpha: { title: "Binance Alpha Assistant",   desc: "Alpha signal assistant, airdrop alarm reminder!" },
	  pendleyt: { title: "Pendle YT Calculator",       desc: "Compute YT redemption value, discount/APY, and break-even." },
	  backpack_calc: {title: "Backpack Airdrop Calculator",  desc: "Estimate Backpack airdrop point value and your share in one click."},
	  tsc: { title: "Token Smart Contract Checker", desc: "Scan ERC/BEP contracts for common risks and privileged roles." },
      airdrop_universal: { title: "Universal Airdrop Estimator", desc: "Estimate point/token value by FDV and airdrop rate." },
      fundingfee: { title: "Funding/Basis Dashboard", desc: "Cross-exchange basis, funding rate & spot–futures spread." },
	  apr: {title: "APR/APY Compound Calculator", desc: "APR ↔ APY conversion, selectable compounding, and charts"},
      borrow_risk: {title: "Borrowing Risk Calculator", desc: "Collateral ratio, liquidation threshold & loop leverage at a glance." },
	  kaito_yaps: { title: "Kaito Yaps Dashboard", desc: "Track YAP activity and trends by user/time." },
      clammv3: { title: "LP V3 Simulator",  desc: "Uniswap V3 range MM & impermanent loss simulator." },




      /* Exchanges */
      binance:   { title: "Binance",  desc: "Leading global crypto exchange for spot, futures, and earn." },
      backpack:  { title: "Backpack", desc: "Exchange by the Backpack team; SOL-native and compliance-first." },
      bitget:    { title: "Bitget",   desc: "Derivatives-focused platform with copy trading and quant tools." },
      bybit:     { title: "Bybit",    desc: "Top derivatives exchange with deep liquidity and fast matching." },
      okx:       { title: "OKX",      desc: "Full-stack exchange with trading, Web3 wallet, and DeFi hub." },
      ourbit:    { title: "Ourbit",   desc: "Emerging spot & derivatives venue with multi-asset trading." },
      gate:      { title: "Gate",     desc: "Established exchange offering wide listings, spot and futures." },

      /* Brokerage */
      ifast:     { title: "iFAST UK Bank (Free £40)",           desc: "UK-regulated digital bank with multi-currency accounts and cards." },
      longbridge:{ title: "Longbridge (Zero-Commission ¥900)",  desc: "US/HK broker with long-term zero commission and robust tools." },
      t212:      { title: "Trading212 (Free £100)",             desc: "UK broker offering fractional shares and commission-free ETFs." }
    }
  }
};






