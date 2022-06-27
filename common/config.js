let config = {
	imgUrl: 'https://tuan.100dtc.com',
	baseUrl: 'https://tuan.100dtc.com/',
	// websocketUrl: "wss://spike.bdtc100.com:2345",
}

if (process.env.NODE_ENV == 'development') { // 开发环境
	config = {
		// imgUrl: 'https://tuan.100dtc.com',
		// baseUrl: 'https://tuan.100dtc.com/',

		imgUrl: 'https://retail.shouchuangtx.cn',
		baseUrl: 'https://retail.shouchuangtx.cn/' // 一亩莲
		// websocketUrl: "wss://spike.bdtc100.com:2345",
	}
}

export default config
