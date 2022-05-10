<template>
	<view class="page-wrap">
		<!-- 订单状态 -->
		<view class="status-card">
			<view class="order-status-left">
				<image src="/static/imgs/order-icon-received.png"></image>
				<view class="status-name">
					<view>{{ formatStatus(detail.order_status) }}</view>
				</view>
			</view>
		</view>

		<!-- 核销码 -->
		<view v-if="detail.verify_info" class="verify-code-wrap">
			<view class="verify-code-header">
				<text>核销码：</text>
				<text>{{detail.verify_info.verify_code}}</text>
				<view class="copy-btn" @click="$util.copy(detail.verify_info.verify_code)">复制</view>
			</view>
			<view class="verify-code-body">
				<image class="verify-code-img" :src="$util.img(detail.verify_info.verify_qrcode)" mode="aspectFit">
				</image>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="shop-card ">
			<view class="padding-y has-active card-item">
				<view class="goods-card flex-title">
					<image class="goods-img" :src="$util.img(detail.image_url)" mode="aspectFit"></image>
					<view class="goods-detail-wrap">
						<view class="goods-detail-top">
							<view class="goods-detail-name">
								<text>{{detail.goods_name}}</text>
							</view>
						</view>
						<view class="goods-detail-bottom">
							<view class="goods-detail-price-line flex-title">
								<view class="goods-detail-price">
									<text>{{detail.price}}</text>
								</view>
								<view class="goods-detail-num">
									<text>x1</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- <view v-if="detail.goods_class == 1" class="padding-y has-active card-item">
				<view class="card-item-label">
					<text>配送方式</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input select-address">
						<text>物流配送</text>
					</view>
				</view>
			</view> -->

		</view>

		<view class="app-card detail-card">
			<view v-if="detail.order_no" class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>订单编号：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>{{detail.order_no}}</text>
						<view class="copy-btn" @click="$util.copy(detail.order_no)">复制</view>
					</view>
				</view>
			</view>
			<view v-if="detail.create_time" class="padding-y has-active card-item ">
				<view class="card-item-label">
					<text>创建时间：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>{{moment(detail.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</text>
					</view>
				</view>
			</view>
			<view v-if="detail.pay_type" class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>支付方式：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>{{formatPayType(detail.pay_type)}}</text>
					</view>
				</view>
			</view>
			<view v-if="detail.pay_time" class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>支付时间：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>{{moment(detail.pay_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</text>
					</view>
				</view>
			</view>
			<view v-if="detail.goods_class == 1" class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>配送方式</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>物流配送</text>
					</view>
				</view>
			</view>
		</view>

		<view class="app-card detail-card">
			<!-- <view class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>商品金额：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>{{detail.order_no}}</text>
					</view>
				</view>
			</view> -->
			<view v-if="detail.order_price" class="padding-y has-active card-item n-b-b">
				<view class="card-item-label">
					<text>实际付金额：</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input ">
						<text>￥</text>
						<text>{{detail.order_price}}</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import moment from 'moment';

	export default {
		data() {
			return {
				detail: {}
			}
		},
		onLoad(option) {
			if (option.detail) {
				this.detail = JSON.parse(option.detail);
				console.log(this.detail);
			}
			this.init();
		},
		methods: {
			moment,
			init() {

			},
			// 0余额支付，1支付宝h5，2微信公众号，3微信小程序
			formatPayType(type) {
				if (status == 0) {
					return '余额支付';
				}
				if (status == 1) {
					return '支付宝支付';
				}
				if (status == 2) {
					return '微信支付';
				}
				if (status == 3) {
					return '微信支付';
				}
			},
			formatStatus(status) {
				if (status == 0) {
					return '待支付';
				}
				if (status == 1) {
					return '待发货';
				}
				if (status == 2) {
					return '待收货';
				}
				if (status == 3) {
					return '已完成';
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.status-card {
		background-size: 100% 100%;
		padding: 40rpx;
		height: 260rpx;
		background-color: $app-primary-color;
		background-image: url('@/static/imgs/status-wrap-bg.png');

		image {
			width: 104rpx;
			height: 86rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}

		.order-status-left {
			display: flex;
			align-items: center;

			.status-name {
				color: $white-color;
			}
		}
	}

	.verify-code-wrap {
		background-color: $white-color;
		margin: 20rpx 20rpx 20rpx;
		border-radius: 8rpx;
		font-size: $font-28;


		.verify-code-header {
			@extend %flex-center-y;
			height: 80rpx;
			margin: 0 30rpx;
			border-bottom: 1rpx dotted $gray-color;
		}

		.verify-code-body {
			@extend %flex-center;
			width: 100%;
			padding: 30rpx 0 40rpx;

			.verify-code-img {
				width: 200rpx;
				height: 200rpx;
			}
		}
	}

	.shop-card {
		background-color: $white-color;
		margin: 20rpx 20rpx 20rpx;
		border-radius: 8rpx;
		font-size: $font-28;
	}

	.detail-card {
		background-color: $white-color;
		margin: 20rpx 20rpx 20rpx;
		border-radius: 8rpx;
		font-size: $font-28;
	}


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

			.goods-detail-bottom {
				.goods-detail-price-line {
					width: 100%;
				}

				.goods-detail-price {
					font-size: $font-32;
					color: $app-primary-color;
					font-weight: bold;
				}

				.goods-detail-num {
					font-size: $font-28;
				}
			}
		}

	}
</style>
