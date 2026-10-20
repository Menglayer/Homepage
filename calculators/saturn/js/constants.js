const DEFAULTS = { fdv: 200_000_000, airdropPercent: 5, tokenSupply: 1_000_000_000 };

const ASPECTA_PREMARKET = {
  projectUrl: 'https://trade.aspecta.ai/projects/usdt/Saturn',
  assetApi: 'https://aspecta.ai/api/hermes/trading/assets?current_page=1&page_size=20&project_name=Saturn&visible=true',
  rpcUrls: [
    'https://bsc-rpc.publicnode.com',
    'https://bsc-dataseed.binance.org/',
    'https://1rpc.io/bnb',
    'https://bsc-mainnet.public.blastapi.io',
  ],
  fallbackAsset: {
    poolAddress: '0xa71F986F89Eb28A232AdDFd64dE29A7A0485f6e7',
    paymentTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
    paymentTokenDecimals: 18,
    assetDecimals: 2,
  },
  selectors: {
    decimals: '0x313ce567',
    getCurrentPrice: '0xeb91d37e',
    getSettlementInfo: '0xe805156e',
  },
};
