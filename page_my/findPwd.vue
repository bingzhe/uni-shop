<template>
	<view class="page-wrap">

		<view class="whiteBg">
			<view class="title acea-row row-between-wrapper">
				<view class="item on">找回密码</view>
			</view>
			<view class="list">
				<view class="item">
					<view>
						<input name="mobile" type="number" maxlength="11" placeholder="请输入手机号" v-model="param.mobile" />
					</view>
				</view>
				<view class="item flex-title">
					<view>
						<input name="code" type="number" maxlength="6" placeholder="验证码" v-model="param.code" />
					</view>
					<view @click="sendCode" class="send-code" :class="{'disabled': sendCodeText!='发送验证码'}">
						<text>{{sendCodeText}}</text>
					</view>
				</view>
				<view class="item">
					<view>
						<input name="new_password" type="password" maxlength="16" placeholder="填写您的新密码"
							v-model="param.new_password" />
					</view>
				</view>
				<view class="item">
					<view>
						<input name="again_password" type="password" maxlength="16" placeholder="确认您的新密码"
							v-model="param.again_password" />
					</view>
				</view>
			</view>
			<view @click="confirmClick" class="logon">确认</view>
		</view>
	</view>
</template>

<script>
	import {
		mobileCodeApi,
		revisePwdByMobileApi
	} from '@/api/tuanApi.js';
	export default {
		data() {
			return {
				sendCodeText: "发送验证码",
				param: {
					mobile: "",
					code: "",
					new_password: "",
					again_password: ""
				}
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {},
			async mobileCode() {
				let res = await mobileCodeApi({
					mobile: this.param.mobile,
					is_pwd: 1
				});
				this.$util.showToast({
					title: '验证码已发送'
				});
				this.sendCodeText = 60;
				let interval = setInterval(() => {
					this.sendCodeText = this.sendCodeText - 1;
					if (this.sendCodeText == 0) {
						this.sendCodeText = "发送验证码";
						clearInterval(interval)
					}
				}, 1000)
			},
			async revisePwdByMobile() {
				let res = await revisePwdByMobileApi(this.param);
				this.$util.showToast({
					title: '修改成功'
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
				}, 200)
				// uni.navigateBack({})
				// this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
			},
			// 发送验证码
			async sendCode() {
				if (this.sendCodeText != "发送验证码") {
					return;
				}
				if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.param.mobile)) {
					this.$util.showToast({
						title: '请输入正确的手机号'
					});
					return;
				}
				this.mobileCode();
			},

			confirmClick() {
				this.revisePwdByMobile();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: $white-color;
	}

	.send-code {
		background-color: $app-primary-color;
		color: $white-color;
		font-size: $font-26;
		@extend %flex-center;
		width: 160rpx;
		height: 60rpx;
		border-radius: 12rpx;

		&.disabled {
			background-color: $gray-color;
		}
	}

	.whiteBg {
		padding: 0 60rpx;
	}

	.whiteBg .title {
		line-height: 2em;
		font-size: 0.36 * 100rpx;
		color: #282828;
		text-align: left;
		font-weight: bold;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		width: 150rpx;
		text-align: center;
	}

	.whiteBg .title .item~.item {
		margin-left: 0.85 * 100rpx;
	}

	.whiteBg .title .item {
		color: #999999;
		border-bottom: 0.05 * 100rpx solid #fff;
		padding-bottom: 0.1 * 100rpx;
	}

	.whiteBg .title .item.on {
		color: #282828;
		border-bottom-color: $app-primary-color;
	}

	.whiteBg .list .item {
		border-bottom: 1px solid #cccccc;
		padding: 30rpx 0 30rpx 0rpx;
		position: relative;
	}

	.whiteBg .list .item .name {
		font-size: 0.26 * 100rpx;
		color: #2d3342;
		margin-bottom: 0.27 * 100rpx;
		text-align: left;
	}

	.whiteBg .list .item .icon {
		font-size: 0.35 * 100rpx;
		margin-right: 0.32 * 100rpx;
	}

	.whiteBg .list .item input {
		font-size: 0.33 * 100rpx;
		width: 100%;
	}

	.whiteBg .list .item input::placeholder {
		color: #cccccc;
	}

	.whiteBg .list .item .codeIput {
		width: 2.5 * 100rpx;
	}

	.whiteBg .list .item .code {
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

	.whiteBg .list .item .code.on {
		background-color: #bbbbbb;
	}

	.whiteBg .list .forgetPwd {
		text-align: right;
		font-size: 0.28 * 100rpx;
		color: #cccccc;
		margin-top: 0.2 * 100rpx;
	}

	.whiteBg .list .forgetPwd .iconfont {
		font-size: 0.3 * 100rpx;
		margin-right: 0.1 * 100rpx;
		vertical-align: middle;
	}

	.whiteBg .logon {
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

	.whiteBg .tip {
		height: 1.1 * 100rpx;
		text-align: center;
		line-height: 1.05 * 100rpx;
		font-size: 0.3 * 100rpx;
		color: #cccccc;
	}
</style>
