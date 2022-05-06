import request from '@/common/http/request.js' // 自己的接口

const url = {
	GroupList: 'Api/Group/groupList', //热门拼团列表
}


/**
 * @param {Object} data
 * 热门拼团列表
 */
export function groupListApi(data) {
	return request.request({
		url: url.GroupList,
		method: 'post',
		data
	})
}


