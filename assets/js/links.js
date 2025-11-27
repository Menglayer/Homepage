/* External links and image assets */

const IMG = "assets/images/";
window.LINKS = {
  tools: [
	  // ✅ 新增：人类文明基石定投计算器
  {
    id: "dca_calc",
    href: "https://civ.menglayer.lol/",
    img: IMG + "civ.jpg",
    open: "modal"
  },
    {
      id: "falcon",
      href: "https://falcon.menglayer.lol/",
      img: IMG + "falcon.png",
      open: "modal"          // 保持原来的弹窗打开
    },
	  // === 新增：Jane 收益面板 ===
    {
      id: "jane",
      href: "https://jane.menglayer.lol/",
      img: IMG + "jane.png",   // 建议放一张 512x512 左右的图到 assets/images/jane.jpg
      open: "modal"            // 和其他工具一样走站内弹窗
    },
    {
      id: "DocMergeTool",
      href: "https://www.addrproof.top?referrerCode=8085970963",
      img: IMG + "addproof.png",
      open: "modal"          // 新开页面
    },
	{
	      id: "bnalpha",
	      href: "https://www.bn-alpha.top/register.html?referralCode=9651614813",
	      img: IMG + "icon-binance.jpg", // 
	      open: "modal"    // 改成 "blank" 可新开页

	    },
		{
		      id: "pendleyt",
		      href: "https://quantsheep.com/",
		      img: IMG + "YT.jpg",
			  open: "blank"
		    },
	  {
      id: "backpack_calc",
      href: "https://backpack.menglayer.lol/",
      img: IMG + "icon-backpack.jpg",
	  open: "modal"
    },
	   {
      id: "tsc",
      href: "https://tsc.menglayer.lol/",
      img: IMG + "tsc.jpg",     
      open: "modal"                  
    },
    {
      id: "airdrop_universal",
      href: "https://airdropestimator.menglayer.lol/",
      img: IMG + "airdrop_universal.jpg",
      open: "modal"
    },
    {
      id: "fundingfee",
      href: "https://fundingfee.menglayer.lol/",
      img: IMG + "fundingfee.jpg",
      open: "modal"
    },
	  {
    id: "apr",
    href: "https://apr.menglayer.lol/",
    img: IMG + "icon-apr-apy.jpg",
    open: "modal" // 页面内弹窗打开；如果将来需要新开页，把值改成 "blank"
},
	  {
  id: "borrow_risk",
  href: "https://borrow.menglayer.lol/",
  img: IMG + "borrow-risk.jpg",
  open: "modal"   // 如需新开页，改为 "blank"
},
	  {
  id: "kaito_yaps",
  href: "https://gomtu.xyz/yapper-stats",
  img: IMG + "icon-kaito.png",
  open: "modal"     // 如需新开页改成 "blank"
},
	  {
  id: "clammv3",
  href: "https://clamm.menglayer.lol/",
  // 先用站点 favicon 作为占位图标，后续你给我图再换
  img: IMG + "clamm.jpg",
  open: "modal"   // 如需新开标签页，改为 "blank"
},
	 {
  id: "stable_radar",
  href: "https://stable.menglayer.lol/",
  img: IMG + "stable-radar.jpg",   // 占位图；有正式图后可改为 "stable-radar.jpg"
  open: "modal"               // 与现有工具一致，弹窗内打开
},{
  id: "cex_radar",
  href: "https://cextoken.menglayer.lol/",
  img: IMG + "cex-token-radar.jpg",   // 占位图；有正式图后可改为 "cex-token-radar.jpg"
  open: "modal"
},
{
  id: "bridge_optimizer",
  href: "https://bridge.menglayer.lol/",   // 如有最终域名不同，改这里即可
  img: IMG + "bridge-optimizer.jpg",
  open: "modal"                            // 保持站内弹窗；若后续被目标站点拦 iframe，可改成 "blank"
},
	  {
  id: "allowance",
  href: "https://allowance.menglayer.lol/",
  img: IMG + "allowance.png",   // 先用站点通用图标；有专属图后替换
  open: "modal"               // 如需新开标签页，改成 "blank"
},
{
  id: "subdomain",
  href: "https://subdomain.menglayer.lol/",
  img: IMG + "subdomain.png",
  open: "modal"
},
{
  id: "e712",
  href: "https://e712.menglayer.lol/",
  img: IMG + "e712.png",
  open: "modal"
},
	  {
  id: "vanity",
  href: "https://vanity.menglayer.lol/",
  img: IMG + "vanity.png"   // 放一张图到 assets/images/vanity.jpg
  // 不写 open 或 open:"modal" => 默认以弹窗方式在 iframe 内打开
}
  ],
  exchanges: [
    { id:"binance",  href:"https://www.binance.com/en/join?ref=UYSU519R", img:IMG + "icon-binance.jpg" },
    { id:"backpack", href:"https://backpack.exchange/signup?code=mengya", img:IMG + "icon-backpack.jpg" },
    { id:"bitget",   href:"https://www.bitget.com/zh-CN/expressly?channelCode=1hql&vipCode=meng66&languageType=1&groupId=436589", img:IMG + "icon-bitget.png" },
    { id:"bybit",    href:"https://www.bybit.com/sign-up?affiliate_id=91392&group_id=533607&group_type=1&ref_code=91392", img:IMG + "icon-bybit.jpg" },
    { id:"okx",      href:"https://www.okx.com/zh-hans/join/5367051", img:IMG + "icon-okx.jpg" },
    { id:"ourbit",   href:"https://www.ourbit.com/register?inviteCode=FPL69V", img:IMG + "icon-ourbit.jpg" },
    { id:"gate",     href:"https://www.gateweb.store/share/xiaomeng", img:IMG + "icon-gate.jpg" }
  ],
  broker: [
    { id:"ifast",       href:"https://www.ifastgb.com/en/account-opening-home?component=new-or-old-client", img:IMG + "icon-ifast.jpg" },
    { id:"longbridge",  href:"https://activity.longbridgehk.com/pipeline/2023welcomegift/index.html?account_channel=lb&app_id=longbridge&channel=HM2023001&invite-code=G70BUL&org_id=1", img:IMG + "icon-longbridge.jpg" },
    { id:"t212",        href:"https://www.trading212.com/invite/19BZbbUMir", img:IMG + "icon-t212.jpg" }
  ]
};





























