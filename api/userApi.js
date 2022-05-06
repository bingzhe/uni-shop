import request from '@/common/http/request.js' // 自己的接口

const url = {
	Login: 'Api/Login/login', // 登录
	Register: 'Api/Login/register', // 注册
	UserInfo: 'Api/Usersinfo/index', // 用户信息
	Logout: 'api/taskApp/auth/logout', // 登出
	OpenId: 'Api/Wxlogin/getOpenid', // 获取openid
}

/**
 * @param {Object} data
 * 获取用户信息
 */
export function openIdApi(data) {
	return request.request({
		url: url.OpenId,
		method: 'post',
		data
	})
}

/**
 * @param {Object} data
 * 获取用户信息
 */
export function userInfoApi(data) {
	return request.request({
		url: url.UserInfo,
		method: 'post',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		flagz: 1,
		data
	})
}

/**
 * @param {Object} data
 * 登录
 */
export function loginApi(data) {
	return request.request({
		url: url.Login,
		method: 'post',
		noToken: true,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data
	})
}

/**
 * @param {Object} data
 * 注册
 */
export function registerApi(data) {
	return request.request({
		url: url.Register,
		method: 'post',
		noToken: true,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data
	})
}

/**
 * @param {Object} data
 * 登出
 */
export function logoutApi(data) {
	return request.request({
		url: url.Logout,
		method: 'post',
		flagz: 1,
		data
	})
}
