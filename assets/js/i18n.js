/* Global i18n dictionary */
window.I18N = {
  zh: {
    site_title: "萌芽社区丨陈小萌",
    // 新增文案
    sp_fans: "全网粉丝 <strong>10K+</strong>",
    sp_value: "捕获空投 <strong>$1000W+</strong>",
    sp_yield: "投资年化 <strong>30%+</strong>",
    btn_vip: "👑 加入核心群",
    btn_biz: "🤝 商务合作",
    banner_title: "加入萌芽 VIP 核心群",
    banner_desc: "获取最新独家研报、空投埋伏策略与 Alpha 信号。",
    // 标签
    tag_hot: "热门",
    tag_new: "最新",
    tag_rec: "推荐",
    tag_pro: "付费",
    btn_tg: "加入萌芽社区",
    btn_x: "关注 X（Twitter）",
    search_placeholder: "搜索 工具 / 交易所 / 券商…",
    no_results_found: "没有找到相关结果 🫠",  // ✅ 新增
    btn_discord: "加入 Discord",
    btn_wechat: "加入 核心群",
    tools_title: "工具",
    falcon_modal_title: "Falcon 空投计算器",
    modal_close: "关闭",
    exchanges_title: "交易所",
    broker_title: "美/港股",
    footer_note: "made by @Menglayer",
    // === 新增 FOMO 弹窗文案 ===
    fomo_badge: "INTERNAL ONLY",
    fomo_title: "萌芽核心群（付费）",
    fomo_progress: "本期招募进度",
    // 注意：这里保留了 span 标签以便数字闪烁，所以等下 HTML 里要用 data-i18n-html
    fomo_alert: "🔥 仅剩最后 <span class='blink-num'>3</span> 个席位",
    fomo_b1: "📈 <strong>项目埋伏：</strong>早期项目资源与研报",
    fomo_b2: "⚡ <strong>循环策略：</strong>高息挖矿与套利方案",
    fomo_b3: "🛡️ <strong>资产复利：</strong>获取独家DEAL/OFFER机会",
    fomo_action: "点击下方按钮，联系小助手入群（请备注：核心群）",
    fomo_btn_tg: "✈️ 添加小助手", // 新增按钮文案
    fomo_tip: "⚠️ 萌芽核心群不定时开放，也可添加小助手排队等待。",

    // === zh Donate / Modal ===
    btn_donate: "请我喝咖啡 ☕",
    donate_title: "请我喝杯咖啡",
    donate_desc: "如果这个网站对你有帮助，欢迎小额捐赠支持。（可能会发生一些好事🎁）",
    donate_btc: "BTC",
    donate_eth: "ETH（ERC20）",
    donate_sol: "SOL",
    donate_copy: "复制",
    donate_copied: "已复制！",
    loading_tool: "正在加载工具…",
    open_newtab: "新窗口打开",
    loading_slow_tip: "如 10 秒内未加载完成，可能站点较慢或屏蔽 iframe。",

    cards: {
      /* 工具 */
      earnfaq: { title: "加密理财十五问", desc: "用十五个问题判断理财项目能不能存。" },
      yyy: { title: "DeFi 收益聚合器", desc: "全网 DeFi 协议收益率聚合对比，一站式发现最高年化及挖矿机会。" },
      civcalc: { title: "人类文明基石定投计算器", desc: "人类文明基石资产定投收益分析。" },
      watermark: { title: "萌芽水印", desc: "一键为图片添加文字/图片水印，支持批量处理与自定义样式。" },
      strc: { title: "Strc 收益追踪器", desc: "追踪微策略 STRC 分红权益。" },
      jane: { title: "Jane 收益面板", desc: "Jane的日收益、权重与总年化。" },
      pendleyt: { title: "Pendle YT计算器", desc: "计算 YT 到期赎回价值、贴现/年化收益率与盈亏平衡点." },
      addrproof: { title: "地址证明生成器", desc: "生成钱包地址签名证明，用于账户归属与身份验证场景。" },
      tsc: { title: "代币合约检测", desc: "一键检测 ERC/BEP 等合约的常见风险与权限。" },
      airdrop_universal: { title: "通用空投计算器", desc: "自定义 FDV/空投比例，估算积分/代币价值与份额。" },
      fundingfee: { title: "合约价差/资金费看板", desc: "多交易所基差、资金费率与期现价差对比。" },
      apr: { title: "年化复利计算器", desc: "APR ↔ APY 转换、复利周期可选、可视化收益曲线" },
      borrow_risk: { title: "借贷风险计算器", desc: "支持抵押率/清算阈值/循环贷次数等一键换算。" },
      clammv3: { title: "LP V3 模拟器", desc: "Uniswap V3 区间做市 & IL（无常损失）模拟器。" },
      stable_radar: { title: "稳定币雷达", desc: "跟踪主流稳定币市值、锚定偏离、链上分布与增减速。" },
      cex_radar: { title: "平台币雷达", desc: "聚合各大 CEX 平台币市值、估值、供给与回购/销毁动态。" },
      bridge_optimizer: { title: "跨链桥费率 & 风险比价器", desc: "对比跨链费用、到达时间与风控提示；常用桥与路线一览。" },
      allowance: { title: "授权批量撤销", desc: "批量查看并撤销各链代币授权（Allowance）。" },
      subdomain: { title: "子域名探查器", desc: "一键枚举子域名，解析 DNS/HTTP 状态，支持导出。" },
      e712: { title: "签名解析器（EIP-712）", desc: "解析/验证 EIP-712 TypedData 与签名，解码结构体字段。" },
      vanity: { title: "靓号地址生成器", desc: "EVM / SOL / TRX / SUI / APT 一键生成靓号，支持前/后缀与并行。" },

      /* 交易所 */
      binance: { title: "币安", desc: "全球交易量领先的加密货币交易所，覆盖现货、合约与理财。" },
      backpack: { title: "Backpack ", desc: "由 Backpack 团队打造的合规交易所，SOL 原生生态友好。" },
      bitget: { title: "Bitget", desc: "以合约见长的交易平台，支持复制交易与量化工具。" },
      bybit: { title: "Bybit", desc: "头部衍生品交易所，深度充足、撮合稳定，产品完善。" },
      okx: { title: "OKX", desc: "综合型交易所，集交易、Web3 钱包与 DeFi 聚合于一体。" },
      deribit: { title: "Deribit", desc: "专注期权与永续合约的专业衍生品交易所，适合进阶交易者。" },
      ourbit: { title: "Ourbit", desc: "新兴现货与衍生品平台，提供多资产交易与返佣激励。" },
      gate: { title: "Gate", desc: "老牌平台，币种丰富、上新快速，支持现货、合约与理财。" },

      /* 出入金/券商 */
      ifast: { title: "iFAST 英国银行（送 £40）", desc: "英国受监管的数字银行，提供多币种账户与支付卡。" },
      longbridge: { title: "长桥证券 终身免佣（送￥900）", desc: "港美股券商，长期 0 佣金，研究与行情工具完整。" },
      t212: { title: "Trading212（送 £100）", desc: "英国券商，支持零碎股与免佣 ETF/股票投资。" },
      // === 新增部分 ===
      ibkr: { title: "盈透证券 (IBKR)", desc: "全球顶尖券商，超低佣金直连全球市场 (最高赚取 $1000 股票)。" },
      bybit_card: { title: "Bybit Card U卡", desc: "加密货币消费卡，支持全球万事达商户支付与 ATM 取现。" },
      bitget_card: { title: "Bitget Card U卡", desc: "高额度多币种虚拟卡，支持绑定支付宝/微信消费。" },
      kast_card: { title: "Kast 卡", desc: "支持链上资产消费的加密支付卡入口。" },
      etherfi_card: { title: "Ether.fi 卡", desc: "Ether.fi 提供的加密支付卡推荐入口。" }
    }
  },

  en: {
    site_title: "MengLayer Community",
    sp_fans: "Fans <strong>10K+</strong>",
    sp_value: "Airdrops <strong>$10M+</strong>",
    sp_yield: "APY <strong>30%+</strong>",
    btn_vip: "👑 Join VIP",
    btn_biz: "🤝 Business",
    banner_title: "Join MengLayer VIP Alpha",
    banner_desc: "Get exclusive on-chain alerts, airdrop strategies and Alpha signals.",
    tag_hot: "HOT",
    tag_new: "NEW",
    tag_rec: "REC",
    tag_pro: "PRO",
    hero_title: "Menglayer",
    hero_tagline: "MengLayer Community Founder/BTC Holder/DEFI Players",
    btn_tg: "Join Telegram",
    btn_x: "Follow on X",
    search_placeholder: "Search tools / exchanges / brokerage…",
    no_results_found: "No results found 🫠", // ✅ 新增
    btn_discord: "Join Discord",
    btn_wechat: "Become VIP",
    tools_title: "Tools",
    falcon_modal_title: "Falcon Airdrop Calculator",
    modal_close: "Close",
    exchanges_title: "Exchanges",
    broker_title: "US/HK Brokerage",
    footer_note: "made by @Menglayer",
    // === New FOMO Modal Content ===
    fomo_badge: "INTERNAL ONLY",
    fomo_title: "Menglayer VIP Group",
    fomo_progress: "Current Batch Progress",
    fomo_alert: "🔥 Only <span class='blink-num'>3</span> spots left",
    fomo_b1: "📈 <strong>Alpha Hunter:</strong> Early access & exclusive reports",
    fomo_b2: "⚡ <strong>Yield Strategy:</strong> High APY farming & arbitrage",
    fomo_b3: "🛡️ <strong>Verification:</strong> High net-worth network only",
    fomo_action: "Click below to contact assistant for waitlist",
    fomo_btn_tg: "✈️ Contact Assistant (@monii00001)", // 新增按钮文案
    fomo_tip: "⚠️ Group opens sporadically. Add assistant to waitlist.",

    // === en Donate / Modal ===
    btn_donate: "Buy me a coffee ☕",
    donate_title: "Buy me a coffee",
    donate_desc: "If this site helped you, a small tip is appreciated.",
    donate_btc: "BTC",
    donate_eth: "ETH(ERC20)",
    donate_sol: "SOL",
    donate_copy: "Copy",
    donate_copied: "Copied!",
    loading_tool: "Loading tool…",
    open_newtab: "Open in new tab",
    loading_slow_tip: "If it takes over 10s, the site may be slow or blocking iframes.",

    cards: {
      /* Tools */
      earnfaq: { title: "Crypto Yield FAQ", desc: "Use 15 questions to determine if a wealth management project is safe to deposit." },
      yyy: { title: "DeFi Yield Aggregator", desc: "One-stop aggregator for DeFi protocol yields. Find the highest APY and farming opportunities." },
      civcalc: { title: "Civilization Foundation DCA Calculator", desc: "Backtest DCA into BTC, gold and index 'civilization base assets' with returns & drawdowns." },
      watermark: { title: "MengYa Watermark", desc: "Add text/image watermarks to your photos with batch processing & custom styles." },
      strc: { title: "Strc Yield Tracker", desc: "Track MicroStrategy STRC dividend rights & yields." },
      jane: { title: "Jane Yield Dashboard", desc: "Compare daily returns and weights of USD3 / LP / YT positions in one view." },
      pendleyt: { title: "Pendle YT Calculator", desc: "Compute YT redemption value, discount/APY." },
      addrproof: { title: "Address Proof Generator", desc: "Generate signed wallet address proof for ownership and identity verification." },
      tsc: { title: "Token Smart Contract Checker", desc: "Scan ERC/BEP contracts for common risks and privileged roles." },
      airdrop_universal: { title: "Universal Airdrop Estimator", desc: "Estimate point/token value by FDV and airdrop rate." },
      fundingfee: { title: "Funding/Basis Dashboard", desc: "Cross-exchange basis, funding rate & spot–futures spread." },
      apr: { title: "APR/APY Compound Calculator", desc: "APR ↔ APY conversion, selectable compounding, and charts" },
      borrow_risk: { title: "Borrowing Risk Calculator", desc: "Collateral ratio, liquidation threshold & loop leverage at a glance." },
      clammv3: { title: "LP V3 Simulator", desc: "Uniswap V3 range MM & impermanent loss simulator." },
      stable_radar: { title: "Stablecoin Radar", desc: "Track market cap, depeg, chain distribution, and supply changes." },
      cex_radar: { title: "CEX Token Radar", desc: "Aggregate exchange-token cap, valuation, supply, and buyback/burns." },
      bridge_optimizer: { title: "Bridge Fees & Risk Comparator", desc: "Compare bridge fees, ETA, and risk signals across popular routes." },
      allowance: { title: "Allowance Bulk Revoker", desc: "List and revoke token allowances across chains." },
      subdomain: { title: "Subdomain Enumerator", desc: "Enumerate subdomains, resolve DNS/HTTP status, and export." },
      e712: { title: "EIP-712 Signature Decoder", desc: "Decode/verify typed data & signatures; inspect struct fields." },
      vanity: { title: "Vanity Address Generator", desc: "Generate vanity addresses for EVM/SOL/TRX/SUI/APT with prefix/suffix & parallel workers." },

      /* Exchanges */
      binance: { title: "Binance", desc: "Leading global crypto exchange for spot, futures, and earn." },
      backpack: { title: "Backpack", desc: "Exchange by the Backpack team; SOL-native and compliance-first." },
      bitget: { title: "Bitget", desc: "Derivatives-focused platform with copy trading and quant tools." },
      bybit: { title: "Bybit", desc: "Top derivatives exchange with deep liquidity and fast matching." },
      okx: { title: "OKX", desc: "Full-stack exchange with trading, Web3 wallet, and DeFi hub." },
      deribit: { title: "Deribit", desc: "A professional derivatives exchange focused on options and perpetuals." },
      ourbit: { title: "Ourbit", desc: "Emerging spot & derivatives venue with multi-asset trading." },
      gate: { title: "Gate", desc: "Established exchange offering wide listings, spot and futures." },

      /* Brokerage */
      ifast: { title: "iFAST UK Bank (Free £40)", desc: "UK-regulated digital bank with multi-currency accounts and cards." },
      longbridge: { title: "Longbridge (Zero-Commission ¥900)", desc: "US/HK broker with long-term zero commission and robust tools." },
      t212: { title: "Trading212 (Free £100)", desc: "UK broker offering fractional shares and commission-free ETFs." },
      // === New Additions ===
      ibkr: { title: "Interactive Brokers", desc: "Top-tier global broker. Low commissions. Earn up to $1000 in IBKR stock." },
      bybit_card: { title: "Bybit Card", desc: "Spend crypto globally with Mastercard. Auto-savings & rewards." },
      bitget_card: { title: "Bitget Card", desc: "High-limit virtual card supporting multi-currency instant payments." },
      kast_card: { title: "Kast Card", desc: "Crypto payment card gateway for spending on-chain assets." },
      etherfi_card: { title: "Ether.fi Card", desc: "Referral entry for the Ether.fi crypto payment card." }
    }
  }
};
