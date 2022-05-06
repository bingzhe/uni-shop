let config = {
	imgUrl: 'http://tuan.100dtc.com',
	baseUrl: 'http://tuan.100dtc.com/',
	// websocketUrl: "wss://spike.bdtc100.com:2345",
}

if (process.env.NODE_ENV == 'development') { // 开发环境
	config = {
		imgUrl: 'http://tuan.100dtc.com',
		baseUrl: 'http://tuan.100dtc.com/',
		// websocketUrl: "wss://spike.bdtc100.com:2345",
	}
}

export default config
