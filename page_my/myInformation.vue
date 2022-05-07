<template>
	<view>
		<view class="information border_t" @click="chooseImage()">
			<view class="">头像</view>
			<view class="portrait">
				<view class="portrait_img">
					<image v-if="!userInfo.avatar" style="width: 100%;height: 100%;border-radius: 50%;"
						src="/static/imgs/logo.png" mode="aspectFill"></image>
					<image v-else style="width: 100%;height: 100%;border-radius: 50%;" :src="portraitImg"
						mode="aspectFill"></image>
				</view>
				<uni-icons type="forward" size="28"></uni-icons>
			</view>
		</view>
		<view class="information border_t" @click="phoneShow">
			<view class="">手机号</view>
			<view class="portrait">
				<view v-if="userInfo.phone">{{userInfo.phone}}</view>
				<!-- <view class="">还未绑定手机，请绑定手机号！</view> -->
				<uni-icons type="forward" size="28"></uni-icons>
			</view>
		</view>
		<view class="information border_t">
			<view class="">账号</view>
			<view class="portrait">
				<view class="">{{userInfo.username}}</view>
				<uni-icons type="forward" size="28"></uni-icons>
			</view>
		</view>
		<view class="changePassword" @click="changePassword()">修改密码</view>

		<!-- 绑定手机号 -->
		<uni-popup ref="popup" type="center">
			<view class="phonePopup">
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">手机号：</view>
					<input v-model="mobile" @input="mobileIpt()" type="number" maxlength="11" placeholder="请输入手机号"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">验证码：</view>
					<input v-model="yzm" type="text" placeholder="请输入验证码" placeholder-style="font-size: 28rpx;" />
					<!-- <wyb-button class="btn" width="190rpx" type="hollow" border-size="0" font-size="18" height="80rpx"
						:count-down="countDown" count-down-text="" >获取验证码</wyb-button> -->
					<wyb-button :count-down="countDown" class="btn" count-down-text="" border-size="0" font-size="24"
						width="190rpx" height="80rpx" type="hollow" @click="obtainYzM()">获取验证码</wyb-button>
				</view>
				<view class="butBox">
					<button class="but" @click="close()">取消</button>
					<button class="but but_determine" @click="determine()">确定</button>
				</view>
			</view>
		</uni-popup>

		<!-- 修改密码 -->
		<uni-popup ref="popupPwd" type="center">
			<view class="phonePopup">
				<view class="phonePopup_sj" v-if="modifyShow">
					<view style="margin-right: 20rpx;">手机号：</view>
					<input v-model="mobile" @input="mobileIpt" type="number" maxlength="11" placeholder="请输入手机号"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj" v-if="modifyShow">
					<view style="margin-right: 20rpx;">验证码：</view>
					<input v-model="yzm" type="text" placeholder="请输入验证码" placeholder-style="font-size: 28rpx;" />

					<wyb-button :count-down="countDown" class="btn" count-down-text="" border-size="0" font-size="24"
						width="190rpx" height="80rpx" type="hollow" @click="obtainYzM(1)">获取验证码</wyb-button>
				</view>
				<view class="phonePopup_sj" v-if="!modifyShow">
					<view style="margin-right: 20rpx;">旧 密 码：</view>
					<input v-model="old_password" type="text" placeholder="请输入新密码"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">新 密 码：</view>
					<input v-model="new_password" type="text" placeholder="请输入新密码"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj" style="margin-bottom: 30rpx;">
					<view style="margin-right: 20rpx;">确定密码：</view>
					<input v-model="again_password" type="text" placeholder="请确定密码"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="switch" @click="changeShow()">{{modifyShow ?  '旧密码修改' : '手机号验证码修改' }}</view>
				<view class="butBox">
					<button class="but" @click="closePwd()">取消</button>
					<button class="but but_determine" @click="determinePwd()">确定</button>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		saveAvatarApi,
		mobileCodeApi,
		bindMobileApi,
		revisePwdByPwdApi,
		revisePwdByMobileApi
	} from '@/api/tuanApi.js';
	import {
		userInfoApi,
	} from '@/api/userApi.js'

	import config from '@/common/config.js'

	export default {
		data() {
			return {
				userInfo: null,
				portraitImg: '',
				countDown: false,
				mobile: '',
				yzm: '',
				new_password: '',
				again_password: '',
				old_password: '',
				modifyShow: false
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {
				this.userInfo = uni.getStorageSync('userInfo')
				this.portraitImg = config.imgUrl + this.userInfo.avatar
				console.log(this.userInfo);
			},
			chooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					success: (res) => {
						console.log(res);
						// this.imgShow = res.tempFilePaths[0]
						this.save(res.tempFilePaths[0])
					}
				});
			},
			
			save(file) {
				let token = uni.getStorageSync("token")
				uni.uploadFile({
					url: config.baseUrl + 'Api/Usersinfo/saveAvatar',
					formData: {
						token: token,
					},
					filePath: file, //哪张图片
					name: 'file', //对应接口的文件名称
					success: res => {
						// console.log(JSON.parse(res.data))
						if (res.data && JSON.parse(res.data).code != 200) {
							this.$util.showToast({
								title: JSON.parse(res.data).meg
							})
							return
						}
						this.getUserInfo()
					}
				})
			},

			async getUserInfo() {
				let res = await userInfoApi();
				let result = res.data.data;
				this.userInfo = result;
				uni.setStorageSync('userInfo', result)
				this.portraitImg = config.imgUrl + uni.getStorageSync('userInfo').avatar
			},

			// 绑定手机弹出层
			phoneShow() {
				this.$refs.popup.open()
				this.mobile = this.userInfo.phone
				this.yzm = ''
			},

			mobileIpt() {
				if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile)) {
					this.countDown = true
				}
			},

			// 获取验证码
			async obtainYzM(e) {
				console.log(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile))
				if (this.mobile) {
					let res = await mobileCodeApi({
						mobile: this.mobile,
						is_pwd: e
					})
					// this.countDown = false
					// setTimeout(() => {
					// 	this.countDown = true
					// }, 60000)

					// this.countDown = false
				} else {
					this.$util.showToast({
						title: '请输入正确的手机号码'
					})
					// this.$util.showToast({
					// 	title: '请输入手机号'
					// })
				}
			},

			close() {
				this.$refs.popup.close()
			},
			async determine() {
				if (this.mobile) {
					let res = await bindMobileApi({
						mobile: this.mobile,
						code: this.yzm
					})
					this.$util.showToast({
						title: res.data.data
					})
					this.getUserInfo()
					this.$refs.popup.close()
				} else if (this.yzm) {
					this.$util.showToast({
						title: '请输入验证码'
					})
				} else {
					this.$util.showToast({
						title: '请输入手机号'
					})
				}
			},
			// 修改密码弹出层
			changePassword() {
				this.mobile = ''
				this.yzm = ''
				this.new_password = ''
				this.again_password = ''
				this.old_password = ''
				this.$refs.popupPwd.open()
			},
			closePwd() {
				this.$refs.popupPwd.close()
			},
			// 切换修改密码方式
			changeShow() {
				if (this.modifyShow) {
					this.modifyShow = false
				} else {
					this.modifyShow = true
				}
			},
			async determinePwd() {
				if (!this.new_password) {
					this.$util.showToast({
						title: '新密码不能为空'
					})
					return
				} else if (!this.again_password) {
					this.$util.showToast({
						title: '确定密码不能为空'
					})
					return
				} else if (this.new_password != this.again_password) {
					this.$util.showToast({
						title: '新密码和确定密码不一致！'
					})
					return
				}
				if (!this.modifyShow) {
					if (!this.old_password) {
						this.$util.showToast({
							title: '旧密码不能为空'
						})
					} else {
						let res = await revisePwdByPwdApi({
							old_password: this.old_password,
							new_password: this.new_password,
							again_password: this.again_password
						})
						this.$util.showToast({
							title: res.data.data
						})
					}
				} else {
					let res = await revisePwdByMobileApi({
						mobile: this.mobile,
						code: this.old_password,
						new_password: this.new_password,
						again_password: this.again_password
					})
					this.$util.showToast({
						title: res.data.data
					})
				}
				this.$refs.popupPwd.close()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F6F6;
	}

	.border_t {
		border-top: 3rpx solid #F6F6F6;
	}

	.information {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 200rpx;
		padding: 0 20rpx;
		background-color: #fff;

		.portrait {
			display: flex;
			align-items: center;

			.portrait_img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100%;
				overflow: hidden;
			}
		}

	}

	.phonePopup {
		width: 600rpx;
		// height: 500rpx;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 60rpx 30rpx;

		.phonePopup_sj {
			position: relative;
			display: flex;
			border-bottom: 1rpx solid #ece9ed;
			height: 70rpx;
			margin-bottom: 60rpx;
			font-size: 28rpx;
			padding-left: 10rpx;

			.btn {
				position: absolute;
				right: 0rpx;
				top: -20%;
			}
		}

		.switch {
			width: 100%;
			text-align: right;
			font-size: 24rpx;
			color: $red-color;
			margin-bottom: 60rpx;
		}

		.butBox {
			display: flex;
			justify-content: space-around;

			.but {
				width: 170rpx;
				height: 80rpx;
				font-size: 28rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				border: none;
			}

			.but_determine {
				color: #fff;
				background-color: $app-primary-color;
			}
		}
	}


	.changePassword {
		width: 60%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		margin: auto;
		margin-top: 100rpx;
		background-color: $app-primary-color;
		color: #fff;
	}
</style>