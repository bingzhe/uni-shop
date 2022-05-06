import Config from '@/common/config.js';

// 工具类
export default {
	config: Config,
	/**
	 * 页面跳转
	 * @param {string} to 跳转链接 /pages/index/index
	 * @param {Object} param 参数 {key : value, ...}
	 * @param {string} mode 模式 
	 */
	redirectTo(to, param, mode) {
		let url = to;
		// console.log({"$store":store.state.$store.tabbarList.list}) 
		let tabbarList = ['/pages/index/index', '/pages/my/my'];
		for (let i = 0; i < tabbarList.length; i++) {
			if (to.indexOf(tabbarList[i]) != -1) {
				uni.switchTab({
					url: url
				})
				return;
			}
		}
		// // #ifdef H5
		// window.history.pushState(null, null, url);
		// // #endif
		if (param != undefined) {
			Object.keys(param).forEach(function(key) {
				if (url.indexOf('?') != -1) {
					url += "&" + key + "=" + param[key];
				} else {
					url += "?" + key + "=" + param[key];
				}
			});
		}
		switch (mode) {
			case 'tabbar':
				// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				uni.switchTab({
					url: url
				})
				break;
			case 'redirectTo':
				// 关闭当前页面，跳转到应用内的某个页面。
				uni.redirectTo({
					url: url
				});
				break;
			case 'reLaunch':
				// 关闭所有页面，打开到应用内的某个页面。
				uni.reLaunch({
					url: url
				});
				break;
			default:
				// 保留当前页面，跳转到应用内的某个页面
				uni.navigateTo({
					url: url
				});
		}
	},

	/**
	 * 图片路径转换
	 * @param {String} img_path 图片地址
	 * @param {Object} params 参数，针对商品、相册里面的图片区分大中小，size: big、mid、small
	 */
	img(img_path, params) {
		var path = "";
		if (img_path && img_path != undefined && img_path != "") {
			if (params && img_path != this.getDefaultImage().default_goods_img) {
				// 过滤默认图
				let arr = img_path.split(".");
				let suffix = arr[arr.length - 1];
				arr.pop();
				arr[arr.length - 1] = arr[arr.length - 1] + "_" + params.size;
				arr.push(suffix);
				img_path = arr.join(".");
			}
			if (img_path.indexOf("http://") == -1 && img_path.indexOf("https://") == -1) {
				path = Config.imgUrl + "/" + img_path;
			} else {
				path = img_path;
			}
		}
		return path;
	},

	/**
	 * 显示消息提示框
	 *  @param {Object} params 参数
	 */
	showToast(params = {}) {
		params.title = params.title || "";
		params.icon = params.icon || "none";
		params.position = params.position || 'bottom';
		params.duration = 1500;
		uni.showToast(params);
	},

	/**
	 * TODO（不能只根据token验证）
	 * 判断是否登录
	 */
	checkLogin() {
		if (uni.getStorageSync('token')) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 判断是否会员
	 */
	checkMember() {
		let _userInfo = uni.getStorageSync('userInfo');
		if (_userInfo.member_level) {
			return true;
		} else {
			return false;
		}
	},


	/**
	 * 复制
	 * @param {Object} message
	 * @param {Object} callback
	 */
	copy(value, callback) {
		// #ifdef H5
		var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
		oInput.value = value; //赋值
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		uni.hideKeyboard();
		this.showToast({
			title: '复制成功'
		});
		typeof callback == 'function' && callback();
		// #endif
		// #ifdef MP || APP-PLUS
		uni.setClipboardData({
			data: value,
			success: () => {
				typeof callback == 'function' && callback();
			}
		});
		// #endif
	},

	/**
	 * 是否是微信浏览器
	 */
	isWeiXin() {
		// #ifndef H5
		return false;
		// #endif
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 自定义模板的跳转链接
	 * @param {Object} link
	 */
	diyRedirectTo(link, method) {
		console.log(link)
		if (link == null || link == '' || !link.wap_url) return;
		if (link.wap_url.indexOf('http') != -1) {
			this.redirectTo('/otherpages/webview/webview', {
				link: encodeURIComponent(link.wap_url)
			});
		} else {
			var params = link.site_id ? {
				site_id: link.site_id
			} : {};
			this.redirectTo(link.wap_url);
		}
	},

	/**
	 * 获取url参数
	 * @param {Object} callback
	 */
	getUrlCode(callback) {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf('?') != -1) {
			var str = url.substr(1);
			var strs = str.split('&');
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		typeof callback == 'function' && callback(theRequest);
	}

}
