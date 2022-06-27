-<template>
	<view class="page-wrap register">

		<view class="hender">
			<view>您好，</view>
			<view>欢迎来到一亩莲</view>
		</view>

		<view class="whiteBg">
			<view class="title acea-row">
				<view :class="formItem === index+1 ? 'item on' : ''" v-for="(item, index) in navList"
					@click="navTap(index+1)" :key="index">{{ item }}</view>
			</view>
			<template v-if="formItem === 1">
				<view class="list">
					<view class="item">
						<view class="acea-row row-between-wrapper">
							<input @input="judge" type="text" maxlength="16" placeholder="请输入账号" v-model="account" />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-between-wrapper">
							<input @confirm="submit" type="password" maxlength="16" placeholder="输入密码"
								v-model="password" />
						</view>
					</view>
				</view>
				<view class="logon" @click="submit">登录</view>
				<view class="Logintip">
					<view style="margin-top: 20rpx;">
						第一次使用?
						<!-- <text @click="formItem = 2" class="font-color-red" style="margin-left: 30rpx;">立即注册</text> -->
						<text @click="findPwd" class="font-color-red" style="margin-left: 30rpx;">忘记密码？</text>
					</view>
					<view style="line-height: 40rpx;margin-top: 40rpx;">
						<!-- #ifdef H5 -->
						<!-- <text @click="changeClient" class="font-color-red" style="margin: 10rpx;">切换到商家端</text> -->
						<!-- #endif -->
					</view>
					<view class="protocol-style">
						<checkbox-group @change="agreeProtocol">
							<label>
								<checkbox color="#DC201F" style="transform:scale(0.7)" value="1" />
							</label>
						</checkbox-group>
						<view class="protocol-text">
							<text>我已阅读并同意</text>
							<text class="font-color-red"
								@click="$util.diyRedirectTo({wap_url: '/hybrid/html/yhxy.html',title: '用户协议'})">
								《用户协议》
							</text>
							<!-- <text @click="$util.redirectTo('/pages/my/protocol?title=用户协议&type=0')" class="font-color-red">《用户协议》</text> -->
							<text>和</text>
							<text class="font-color-red"
								@click="$util.diyRedirectTo({wap_url: '/hybrid/html/yszc.html',title: '隐私政策'})">
								《隐私政策》
							</text>
							<!-- <text @click="$util.redirectTo('/pages/my/protocol?title=隐私政策&type=1')" class="font-color-red">《隐私政策》</text> -->
						</view>
					</view>
				</view>

				<!-- <view class="tip" style="margin: 0 0 30rpx; padding: 0; height: 30rpx; line-height: 30rpx;">
					忘记了密码?
					<text class="font-color-red" @click="toRetrieve" style="margin-left: 30rpx;">找回密码</text>
				</view> -->

				<!-- <view class="protocol-style">
					<checkbox-group @change="agreeProtocol">
						<label>
							<checkbox color="#DC201F" style="transform:scale(0.7)" value="1" />
						</label>
					</checkbox-group>
					<view class="protocol-text">
						<text>我已阅读并同意</text>
						<text class="font-color-red"
							@click="$util.diyRedirectTo({wap_url: '/hybrid/html/yhxy.html',title: '用户协议'})">
							《用户协议》
						</text>
						<text @click="$util.redirectTo('/pages/my/protocol?title=用户协议&type=0')" class="font-color-red">《用户协议》</text>
						<text>和</text>
						<text class="font-color-red"
							@click="$util.diyRedirectTo({wap_url: '/hybrid/html/yszc.html',title: '隐私政策'})">
							《隐私政策》
						</text>
						<text @click="$util.redirectTo('/pages/my/protocol?title=隐私政策&type=1')" class="font-color-red">《隐私政策》</text>
					</view>
				</view> -->
				<!-- <view class="protocol-empty-style"></view> -->

			</template>
			<template v-else>

				<view class="list">
					<view class="item">
						<view>
							<input name="account" @input="judge" type="text" maxlength="16" placeholder="请输入账号"
								v-model="account" />
						</view>
					</view>
					<!-- <view class="item">
						<view class="align-left">
							<input name="verifyCode" type="number" maxlength="6" placeholder="填写验证码" class="codeIput"
								v-model="captcha" />
							<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''"
								@click="code">获取验证码</button>
						</view>
					</view> -->
					<view class="item">
						<view>
							<input name="password" type="password" maxlength="16" placeholder="填写您的登录密码"
								v-model="password" />
						</view>
					</view>
					<view class="item">
						<view>
							<input name="inviteCode" type="text" placeholder="邀请码" v-model="inviteCode" />
						</view>
					</view>
				</view>
				<view class="logon" @click="register">注册</view>
				<view class="tip">
					已有账号?
					<text @click="formItem = 1" class="font-color-red">立即登录</text>
				</view>
			</template>
		</view>

		<!-- 注册 -->
		<!-- <view class="whiteBg">
			<view class="title acea-row row-between-wrapper">
				<view class="item on">注册账号</view>
			</view>
		</view> -->

	</view>
</template>

<script>
	import {
		mapActions,
		mapMutations
	} from 'vuex';

	import {
		openIdApi,
		registerApi
	} from '@/api/userApi.js';

	export default {
		name: "Login",
		data: function() {
			return {
				navList: ["账号登录", "注册账号"],
				current: 0,
				account: "",
				password: "",
				protocolAgree: false,
				captcha: "",
				inviteCode: "",
				formItem: 1,
				type: "login",
				timer: null,
				clock: 60,
				clockText: '验证码',
				disabled: false,
				isWeixin: '', // 判断是否为微信内置浏览器
				openId: '',
				weapp_openid: ''
			};
		},
		onLoad(option) {
			if (option.type == 'register') {
				this.formItem = 2;
			}
			if (option.inviteCode) {
				this.inviteCode = option.inviteCode;
			}
			this.isWeixin = this.isWechat() // 判断是否为微信内置浏览器
			if (this.isWeixin && !uni.getStorageSync('openId')) {
				this.checkWeChatCode() //通过微信官方接口获取code之后，会重新刷新设置的回调地址【redirect_uri】
			} else {
				this.openId = uni.getStorageSync('openId');
			}
		},
		onShow() {},
		methods: {
			...mapActions(['Login', 'GetInfo', 'Logout']),
			agreeProtocol(e) {
				if (e.detail.value.length > 0) {
					this.protocolAgree = true;
					return
				}
				this.protocolAgree = false;
			},
			// 登录 注册 切换
			navTap(index) {
				this.current = index
				this.formItem = this.current
			},
			async bindOpenId(code) {
				let res = await openIdApi({
					code
				});
				this.openId = res.data.data;
				uni.setStorageSync('openId', this.openId);
			},
			// 登录按钮
			async submit() {
				if (!this.protocolAgree) {
					uni.showToast({
						title: '请阅读并同意隐私政策！',
						icon: 'none',
						duration: 2000
					})
					return
				}
				const {
					account,
					password
				} = this;
				if (!account || !password) {
					uni.showToast({
						title: '帐号或密码不能为空',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (password.length > 16 || password.length < 6) {
					uni.showToast({
						title: '密码长度必须在6-16位',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (!/^[\w-_\@\!#\$\%\&\*\^]{6,16}$/.test(password)) {
					uni.showToast({
						title: '密码必须是6-16的数字或字母组合',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let _param = {
					username: account,
					password: password,
					wx_openid: this.openId,
					weapp_openid: this.weapp_openid
				};
				let res = await this.Login(_param);
				let resz = await this.GetInfo();
				this.$util.redirectTo('/pages/index/index');
			},

			// 注册按钮
			async register() {
				const {
					account,
					password,
					inviteCode
				} = this;
				if (!account || !password) {
					uni.showToast({
						title: '帐号或密码不能为空',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (!/^[\w-_\@\!#\$\%\&\*\^]{6,16}$/.test(this.password)) {
					uni.showToast({
						title: '密码必须是6-16的数字或字母组合',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				// TODO
				// if (!inviteCode) {
				// 	uni.showToast({
				// 		title: '邀请码不能为空',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// 	return false;
				// }
				let _param = {
					username: account,
					password: password,
					// invitation_code: inviteCode //TODO
				};
				let res = await registerApi(_param);
				// let result = res.data.data;
				if(res.data.code == 200) {
					this.$util.showToast({
						title: '注册成功请登录'
					});
					this.inviteCode = ''
					this.formItem = 1;
				}else{
					this.$util.showToast({
						title: res.data.msg
					});
				}
				// uni.setStorageSync('token', result.token);
				// this.$store.commit('SET_TOKEN', result.token);
				// let resz = await this.GetInfo();
				// this.$util.showToast({
				// 	title: '注册成功已自动登录'
				// });
				
			},

			judge(e) {
				this._timer = setTimeout(() => {
					let value = e.target.value;
					const pattern = /[\W]/g; //修改inputRule 的值
					const patt = /[^\u4E00-\u9FA5W]/g; //修改inputRule 的值
					let _str = ''
					for (let i = 0, len = value.length; i < len; i++) {
						if (!pattern.test(value[i])) {
							// console.log(pattern.test(value[i]));
							_str += value[i].replace(pattern, '')
						} else {
							console.log(pattern.test(value[i]));
							_str += value[i].replace(patt, '')
						}
					}
					this.account = _str;
				}, 10)
			},

			/*微信登录相关  start*/
			//方法：用来判断是否是微信内置的浏览器
			isWechat() {
				return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
			},
			//方法:用来提取code
			getUrlCode(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) ||
					[, ''
					])[1]
					.replace(/\+/g, '%20')) || null
			},

			//检查浏览器地址栏中微信接口返回的code
			checkWeChatCode() {
				let code = this.getUrlCode('code')
				// console.log(code, 'code');
				if (code) {
					this.bindOpenId(code)
					// this.getOpenidAndUserinfo(code)
				} else {
					this.getWeChatCode()
				}
			},

			// 请求微信接口，用来获取code
			getWeChatCode() {
				// TODO
				let local = encodeURIComponent(window.location.href); //获取当前页面地址作为回调地址
				let appid = 'wxa912862c39071507'
				//通过微信官方接口获取code之后，会重新刷新设置的回调地址【redirect_uri】
				window.location.href =
					"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
					appid +
					"&redirect_uri=" +
					local +
					"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
			},

			changeClient() {
				// #ifdef H5
				uni.clearStorageSync()
				location.replace('https://tuan.100dtc.com/mshop/pages/login/login')
				// #endif
			},
			// 忘记密码
			findPwd() {
				this.$util.redirectTo('/page_my/findPwd')
			}

		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		
		// min-height: 800rpx;
	}
	.hender {
		margin-top: 50rpx;
		margin-left: 50rpx;
		font-size: 50rpx;
		font-weight: 700;
		color: #363636;
	}

	.register {
		width: 100%;
		background-color: $white-color;
		display: flex;
		flex-direction: column;
	}

	.register .whiteBg {
		padding: 0 60rpx;
	}

	.register .whiteBg .title {
		line-height: 2em;
		font-size: 0.36 * 100rpx;
		color: #282828;
		
		font-weight: bold;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		// width: 150rpx;
		text-align: center;
		
		display: flex;
		flex-direction: row;
		
		view:nth-child(2) {
			margin-left: 20px;
		}
	}

	.register .whiteBg .title .item~.item {
		margin-left: 0.85 * 100rpx;
	}

	.register .whiteBg .title .item {
		color: #999999;
		border-bottom: 0.05 * 100rpx solid #fff;
		padding-bottom: 0.1 * 100rpx;
	}

	.register .whiteBg .title .item.on {
		color: #282828;
		border-bottom-color: #0095DA;
	}

	.register .whiteBg .list .item {
		border-bottom: 1px solid #cccccc;
		padding: 30rpx 0 30rpx 0rpx;
		position: relative;
	}

	.register .whiteBg .list .item .name {
		font-size: 0.26 * 100rpx;
		color: #2d3342;
		margin-bottom: 0.27 * 100rpx;
		text-align: left;
	}

	.register .whiteBg .list .item .icon {
		font-size: 0.35 * 100rpx;
		margin-right: 0.32 * 100rpx;
	}

	.register .whiteBg .list .item input {
		font-size: 0.33 * 100rpx;
		width: 100%;
	}

	.register .whiteBg .list .item input::placeholder {
		color: #cccccc;
	}

	.register .whiteBg .list .item .codeIput {
		width: 2.5 * 100rpx;
	}

	.register .whiteBg .list .item .code {
		position: absolute;
		width: 200rpx;
		height: 0.5 * 100rpx;
		background-color: $app-primary-color;
		border-radius: 0.3 * 100rpx;
		color: #fff;
		line-height: 0.5 * 100rpx;
		text-align: center;
		bottom: 0.17 * 100rpx;
		right: 0;
		font-size: 0.25 * 100rpx;
	}

	.register .whiteBg .list .item .code.on {
		background-color: #bbbbbb;
	}

	.register .whiteBg .list .forgetPwd {
		text-align: right;
		font-size: 0.28 * 100rpx;
		color: #cccccc;
		margin-top: 0.2 * 100rpx;
	}

	.register .whiteBg .list .forgetPwd .iconfont {
		font-size: 0.3 * 100rpx;
		margin-right: 0.1 * 100rpx;
		vertical-align: middle;
	}

	.register .whiteBg .logon {
		font-size: 0.34 * 100rpx;
		color: #fff;
		font-weight: bold;
		height: 0.86 * 100rpx;
		border-radius: 0.43 * 100rpx;
		background: linear-gradient(to right, $app-primary-color 0%, rgba($app-primary-color, 0.4) 100%);
		text-align: center;
		line-height: 0.86 * 100rpx;
		margin-top: 0.47 * 100rpx;
	}

	.register .whiteBg .Logintip {
		// height: 110rpx;
		text-align: center;
		// line-height: 105rpx;
		font-size: 30rpx;
		color: #cccccc;
		display: flex;
		flex-direction: column;
	}
	.register .whiteBg .tip {
		height: 110rpx;
		text-align: center;
		line-height: 105rpx;
		font-size: 30rpx;
		color: #cccccc;
	}

	.register .bottom {
		// background-image: url("https://wx.yixiang.co/static/images/registerB.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 6.2 * 100rpx;
		height: 0.36 * 100rpx;
		margin: 0 auto;
	}

	.register .whiteBg .title .item {
		border-bottom: 2px solid;
	}

	.register .whiteBg .title .item.on {
		border-bottom-color: $app-primary-color;
	}

	.font-color-red {
		color: $app-primary-color;
	}

	.getPhoneCode {
		display: flex;
		justify-content: space-between;

		.phoneInput {
			width: 70%;
		}

		.phoneCode {
			width: 30%;
			text-align: center;
			color: #FFFFFF;
			background-color: $app-primary-color;
			padding: 12rpx;
			font-size: 28rpx;
			border-radius: 30rpx;
		}
	}

	.protocol-style {
		// position: absolute;
		// bottom: 100rpx;
		// left: 0;
		// width: 100%;
		// height: 240rpx;
		margin-top: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #cccccc;
		font-size: 28rpx;

		.protocol-text {
			text-align: center;
			line-height: 50rpx;
		}
	}

	.protocol-empty-style {
		height: 120rpx;
	}
</style>
