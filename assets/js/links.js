/* External links and image assets */

const IMG = "assets/images/";
window.LINKS = {
  tools: [
    {
      id: "falcon",
      href: "https://falcon.menglayer.lol/",
      img: IMG + "falcon.png",
      open: "modal"          // 保持原来的弹窗打开
    },
    {
      id: "addrproof",
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
		      // 先用站点通用图标占位；若你有专属图标，可换成如 "icon-pendle-yt.jpg"
		      img: IMG + "YT.jpg",
			  open: "modal"
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
      img: IMG + "tsc.jpg",     // 先用站点通用图标；后续可换专属图标
      open: "modal"                  // 如被目标站点拦截，改成 "blank"
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
    img: IMG + "icon-apr.jpg",
    open: "modal" // 页面内弹窗打开；如果将来需要新开页，把值改成 "blank"
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




