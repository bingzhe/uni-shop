<template>
	<view class="container">
		<!-- 背景 -->
		<image class="bg-img" src="../static/imgs/promoterBg.jpg"></image>

		<view class="promote_ct">
			<view class="promote_ct_hander">
				<view class="promote_ct_hander_title">邀请码</view>
				<view class="promote_ct_hander_code flex-center">
					<view>{{userInfo.invitation_code}}</view>
					<view @click="$util.copy(userInfo.invitation_code)" class="copy-btn">复制</view>
				</view>
				<view class="promote_ct_hander_ts">您的好友在注册时也可以填写邀请码</view>
			</view>
			<view class="ermweima" @longtap="saveImg()">
				<image :src="erweima" mode="widthFix"></image>
			</view>
			<view style="margin-top: 15rpx;color: #9b9b9a;font-size: 26rpx;">长按保存二维码可分享</view>
			<button class="saveImg" @click="saveImg">保存图片</button>
		</view>
	</view>
</template>

<script>
	import config from '@/common/config.js';
	
	export default {
		data() {
			return {
				invitationCode: '', //邀请码
				erweima: '', // 要生成的二维码值
				flag: true,
				userInfo: uni.getStorageSync('userInfo'),
				size: 256,
				margin: 10,
				backgroundColor: '#FFFFFF',
				foregroundColor: '#000000'
			}
		},
		onReady() {
			// #ifdef MP-WEIXIN
			this.userInfo = uni.getStorageSync('userInfo')
			// #endif
		},

		onLoad() {
			this.init()
		},

		methods: {
			init() {
				this.userInfo = uni.getStorageSync('userInfo')
				this.erweima = config.imgUrl + this.userInfo.invitation_qr_code
			},
			// saveImg() {
			// 	// H5 保存图片
			// 	// #ifdef H5
			// 	const imgUrl = this.erweima;
			// 	if (window.navigator.msSaveOrOpenBlob) {
			// 		let bstr = atob(imgUrl.split(",")[1]);
			// 		let n = bstr.length;
			// 		let u8arr = new Uint8Array(n);
			// 		while (n--) {
			// 			u8arr[n] = bstr.charCodeAt(n);
			// 		}
			// 		let blob = new Blob([u8arr]);
			// 		window.navigator.msSaveOrOpenBlob(blob, "chart-download" + "." + "png");
			// 	} else {
			// 		let a = document.createElement("a");
			// 		a.href = imgUrl;
			// 		a.setAttribute("download", "chart-download");
			// 		a.click();
			// 	}
			// 	// #endif
			// },
			saveImg(){
				// #ifdef H5
				const imgUrl = this.erweima;
				if (window.navigator.msSaveOrOpenBlob) {
					let bstr = atob(imgUrl.split(",")[1]);
					let n = bstr.length;
					let u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					let blob = new Blob([u8arr]);
					window.navigator.msSaveOrOpenBlob(blob, "chart-download" + "." + "png");
				} else {
					let a = document.createElement("a");
					a.href = imgUrl;
					// a.setAttribute("download", "chart-download");
					a.download = 'chart-download'
					a.click();
				}
				// #endif
				// #ifdef MP-WEIXIN
				// 获取APP的所有页面列表
				const pages = getCurrentPages();
				// 获取到当前页面
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				let bitmap = new plus.nativeObj.Bitmap('amway_img');
				// 将webview内容绘制到Bitmap对象中
				currentWebview.draw(bitmap, function() {
					console.log('截屏绘制图片成功');
					let fileName = '_doc/' + new Date().getTime() + '.png'
					bitmap.save(fileName, {}, function(i) {
						console.log('bitmap保存图片成功：' + JSON.stringify(i));
						// 将图片保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: i.target,
							success: function() {
								bitmap.clear(); //销毁Bitmap图片
								uni.$u.toast('保存图片成功')
							}
						});
					}, function(e) {
						console.log('保存图片失败：' + JSON.stringify(e));
					});
				}, function(e) {
					console.log('截屏绘制图片失败：' + JSON.stringify(e));
				});
				//currentWebview.append(amway_bit);
				// #endif
				// H5 保存图片
				
			}

		},
	}
</script>

<style lang="scss" scoped>
	.container {
		// width: 100%;
		position: relative;
		@extend %app-default-width;
	}

	.bg-img {
		position: fixed;
		top: 0;
		// width: 100%;
		@extend %app-default-width;
		// margin: 0 auto;
		height: 100%;
		z-index: -1;
	}

	.promote_ct {
		position: absolute;
		text-align: center;
		width: 100%;
		top: 22vh;
		// margin-top: 260rpx;
		// padding-top: 30rpx;

		.promote_ct_hander {
			display: flex;
			flex-direction: column;

			.promote_ct_hander_title {
				font-weight: 700;
			}

			.promote_ct_hander_code {
				font-size: 32rpx;
				color: $red-color;
				height: 80rpx;
				// position: relative;
				.copy-btn {
					// position: absolute;
					// right: 160rpx;
					@extend %flex-center;
					margin-left: 12rpx;
					height: 36rpx;
					line-height: 0;
					font-size: 24rpx;
					border: 1rpx solid $red-color;
					padding: 2rpx 16rpx;
					border-radius: 30rpx;
				}
			}

			.promote_ct_hander_ts {
				margin-top: 10rpx;
				font-size: 16rpx;
				color: #9b9b9a;
			}
		}

		.ermweima {
			width: 18vh;
			// height: 300rpx;
			margin: auto;
			// margin-top: 1vh;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.saveImg {
			margin: auto;
			width: 280rpx;
			height: 60rpx;
			color: #fff;
			background-color: #c82626;
			font-size: 28rpx;
			line-height: 60rpx;
			border-radius: 40rpx;
			margin-top: 20rpx;
		}
	}

	.qr_area {
		height: calc(100vh - 400rpx);
		display: flex;
		justify-content: center;
		align-items: center;

		.content {
			text-align: center;
			padding-bottom: 30rpx;

			.img {
				width: 500rpx;
				height: 500rpx;
			}
		}
	}

	.qrcode-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
