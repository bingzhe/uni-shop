<template>
	<view class='page-wrap'>
		<view class="verify-code-wrap">
			<view class="verify-code-header">
				<text>核销码：</text>
				<text>{{detail.verify_code}}</text>
				<view class="copy-btn" @click="$util.copy(detail.verify_code)">复制</view>
			</view>
			<view class="verify-code-body">
				<image class="verify-code-img" :src="$util.img(detail.verify_qrcode)" mode="aspectFit">
				</image>
				<text class="watermark" v-if="detail.status!=1">{{title}}</text>
			</view>
		</view>
		<view class="shop-card ">
			<view class="padding-y has-active card-item">
				<view class="goods-card flex-title">
					<image v-if="detail.image_url" class="goods-img" :src="$util.img(detail.image_url)"
						mode="aspectFit"></image>
					<image v-if="detail.goods_img" class="goods-img" :src="$util.img(detail.goods_img)"
						mode="aspectFit"></image>
					<view class="goods-detail-wrap">
						<view class="goods-detail-top">
							<view class="goods-detail-name">
								<text>{{detail.goods_name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			this.detail = JSON.parse(decodeURIComponent(option.detail))
			switch (this.detail.status){
				case 1:
						this.title = '可用'
					break;
				case 2:
						this.title= '已核销'
					break;
				case 3:
						this.title= '转让中'
					break;
				case 4:
						this.title= '已过期'
					break;
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		data() {
			return {
				detail: {
					title: ''
				}
			}
		},
		methods: {

		}
	}
</script>

<style lang='scss' scoped>
.page-wrap {
	background-color: #f0f0f0;
	box-sizing: border-box;
	padding: 20rpx;
}	
	
.verify-code-wrap {
	background-color: $white-color;
	margin: 0rpx 20rpx 20rpx;
	border-radius: 8rpx;
	font-size: $font-28;


	.verify-code-header {
		@extend %flex-center-y;
		height: 80rpx;
		/* margin: 0 30rpx; */
		border-bottom: 1rpx dotted $gray-color;
		
		.copy-btn {
			font-size: $font-28;
			display: inline-block;
			color: #666;
			background: #f7f7f7;
			line-height: 1;
			padding: 6rpx 14rpx;
			margin-left: 10rpx;
			border-radius: 18rpx;
			border: 0.5px solid #666;
		}
	}

	.verify-code-body {
		@extend %flex-center;
		width: 100%;
		padding: 30rpx 0 40rpx;

		.verify-code-img {
			width: 200rpx;
			height: 200rpx;
		}
		
		.watermark {
			color: red;
			font-size: 40rpx;
			z-index: 999;
			transform: rotate(-45deg) translate(-120rpx,-120rpx);
		}
	}
}
.shop-card {
	background-color: $white-color;
	margin: 20rpx 20rpx 20rpx;
	border-radius: 8rpx;
	font-size: $font-28;
}
.goods-card {
	padding: 20rpx 0;
	width: 100%;

	.goods-img {
		width: 200rpx;
		height: 200rpx;
		background-color: $app-background-color;
		border-radius: 16rpx;
	}

	.goods-detail-wrap {
		flex: 1;
		margin-left: 20rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: $font-28;

		.goods-detail-top {
			.goods-detail-name {}
		}
	}
}
</style>
