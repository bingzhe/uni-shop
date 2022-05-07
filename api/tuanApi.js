import request from '@/common/http/request.js' // 自己的接口

const url = {
	Banner: 'Api/Index/getBanner', // 轮播图

	GroupList: 'Api/Group/groupList', //热门拼团列表
	GroupDetail: 'Api/Group/getGroupInfo', //拼团详情

	OrderCreate: 'Api/Order/OrderCreate', //创建拼团订单
	PayGroupOrder: 'Api/OrderPay/groupOrder', //支付拼团订单

	OrderBalanceCreate: 'Api/Order/createBalanceOrder', //创建充值余额订单
	OrderPay: 'Api/OrderPay/userOrder', //支付充值余额订单

	Withdraw: 'Api/UsersWithdraw/index', //提现
	WithdrawConfig: 'Api/UsersWithdraw/getWithdrawConfig', //提现配置
	WithdrawBill: 'Api/UsersWithdraw/withdrawBill', // 提现明细 积分 保证金

	GetAddress: 'Api/Usersinfo/getAddress', // 获取地址列表
	GetDefaultAddress: 'Api/Usersinfo/getDefaultAddress', // 获取用户默认地址
	SaveAddress: 'Api/Usersinfo/saveAddress', // 增加用户地址
	DelAddress: 'Api/Usersinfo/delAddress', // 删除用户地址


	Statistics: 'Api/Usersinfo/statistics', // 推广统计
	SaveAvatar: 'Api/Usersinfo/saveAvatar', // 上传头像
	MobileCode: 'Api/Login/mobileCode', // 获取验证码
	BindMobile: 'Api/Login/bindMobile', // 绑定手机号
	RevisePwdByMobile: 'Api/Login/RevisePwdByMobile', // 手机号修改密码
	RevisePwdByPwd: 'Api/Login/RevisePwdByPwd', // 旧密码修改密码
}


/**
 * @param {Object} data
 * 提现明细 积分 保证金
 */
export function withdrawBillApi(data) {
	return request.request({
		url: url.WithdrawBill,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 上传头像
 */
export function saveAvatarApi(data) {
	return request.request({
		url: url.SaveAvatar,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 推广统计
 */
export function statisticsApi(data) {
	return request.request({
		url: url.Statistics,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 旧密码修改密码
 */
export function revisePwdByPwdApi(data) {
	return request.request({
		url: url.RevisePwdByPwd,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 手机号修改密码
 */
export function revisePwdByMobileApi(data) {
	return request.request({
		url: url.RevisePwdByMobile,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 绑定手机号
 */
export function bindMobileApi(data) {
	return request.request({
		url: url.BindMobile,
		method: 'post',
		data
	})
}


/**
 * @param {Object} data
 * 获取验证码
 */
export function mobileCodeApi(data) {
	return request.request({
		url: url.MobileCode,
		method: 'post',
		data
	})
}


/**
 * @param {Object} data
 * 删除用户地址
 */
export function delAddressApi(data) {
	return request.request({
		url: url.DelAddress,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 增加用户地址
 */
export function saveAddressApi(data) {
	return request.request({
		url: url.SaveAddress,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 获取用户默认地址
 */
export function getDefaultAddressApi(data) {
	return request.request({
		url: url.GetDefaultAddress,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 用户地址列表
 */
export function getAddressApi(data) {
	return request.request({
		url: url.GetAddress,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 支付订单
 */
export function orderPayApi(data) {
	return request.request({
		url: url.OrderPay,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 创建订单
 */
export function orderBalanceCreateApi(data) {
	return request.request({
		url: url.OrderBalanceCreate,
		method: 'post',
		data
	})
}


/**
 * @param {Object} data
 * //提现配置
 */
export function withdrawConfigApi(data) {
	return request.request({
		url: url.WithdrawConfig,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * //提现
 */
export function withdrawApi(data) {
	return request.request({
		url: url.Withdraw,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 拼团详情
 */
export function groupDetailApi(data) {
	return request.request({
		url: url.GroupDetail,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 支付订单
 */
export function payGroupOrderApi(data) {
	return request.request({
		url: url.PayGroupOrder,
		method: 'post',
		data
	})
}
/**
 * @param {Object} data
 * 创建订单
 */
export function orderCreateApi(data) {
	return request.request({
		url: url.OrderCreate,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 热门拼团列表
 */
export function groupListApi(data) {
	return request.request({
		url: url.GroupList,
		method: 'post',
		noToken: true,
		data
	})
}
