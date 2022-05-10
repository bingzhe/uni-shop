<template>
	<view class="page-wrap padding-all">
		<prompt :show="showPay" @onConfirm="payConfirm" @onCancel="showPay=false" title="请选择支付类型">
			<view class="select-paytype-wrap">
				<radio-group name="paytypeBox" @change="changePayType">
					<template v-if="$util.isWeiXin()">
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/blancepay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="0" />
								<text>余额支付</text>
							</label>
						</view>
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/alipay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="1" checked />
								<text>支付宝支付</text>
							</label>
						</view>
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/wxpay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="2" checked />
								<text>微信支付</text>
							</label>
						</view>
						<!-- <view class="paytype-line flex-center-y">
								<image class="paytype-icon" src="/static/imgs/wxpay.png" mode="aspectFit"></image>
								<label>
									<radio color="#fe543a" style="transform:scale(0.7)" value="2" checked />
									<text>微信支付</text>
								</label>
							</view>
							<view class="paytype-line flex-center-y">
								<image class="paytype-icon" src="/static/imgs/alipay.png" mode="aspectFit"></image>
								<label>
									<radio color="#fe543a" style="transform:scale(0.7)" value="1" />
									<text>支付宝支付</text>
								</label>
							</view> -->
					</template>
					<template v-else>
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/blancepay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="0" />
								<text>余额支付</text>
							</label>
						</view>
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/alipay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="1" checked />
								<text>支付宝支付</text>
							</label>
						</view>
					</template>
				</radio-group>
			</view>
		</prompt>

		<!-- 设置收货地址或者填写手机号 -->
		<view class="app-card">
			<view @click="selectAddress" v-if="goods_class == 1" class="padding-y has-active card-item">
				<view class="card-item-label require">
					<text>收货地址</text>
				</view>
				<view class="card-item-value">
					<view class="card-item-input select-address">
						<view v-if="Object.keys(defaultAddress).length > 0" class="address-detail-wrap">
							<view class="address-detail-line">
								<text>{{defaultAddress.province_name}}</text>
								<text>{{defaultAddress.city_name}}</text>
								<text>{{defaultAddress.area_name}}</text>
							</view>
							<view class="address-user-line"></view>
						</view>
						<view v-else class="address-detail-empty">
							<text>请选择收货地址</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="goods_class == 2" class="padding-y has-active card-item">
				<view class="card-item-label require">
					<text>手机号码</text>
				</view>
				<view class="card-item-value">
					<input v-model="pay_param.phone" placeholder="请输入手机号码" class="card-item-input" type="number"
						maxlength="11" />
				</view>
			</view>
		</view>

		<!-- 订单详情 -->
		<view class="app-card">
			<view class="padding-y has-active card-item">
				<view class="goods-card flex-title">
					<image class="goods-img" :src="$util.img(detail.goods_img)" mode="aspectFit"></image>
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
			<view v-if="goods_class == 1" class="padding-y has-active card-item">
				<view class="card-item-label">
					<text>配送方式</text>
				</view>
				<view class="card-item-value ">
					<view class="card-item-input select-address">
						<text>物流配送</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 金额 -->
		<view class="app-card ">
			<view class="padding-y has-active card-item">
				<view class="card-item-label">
					<text>商品金额</text>
				</view>
				<view class="card-item-value order-price">
					<text>{{pay_param.order_price}}</text>
				</view>
			</view>
		</view>

		<view class="goods-pay-bottom-empty"></view>
		<view class="goods-pay-bottom">
			<!-- <view class="goods-pay-num">
				<text>共1件</text>
			</view> -->
			<view class="goods-pay-price">
				<text class="goods-pay-price-label">合计：</text>
				<text>{{pay_param.order_price}}</text>
			</view>
			<view @click="toPay" class="goods-pay-btn">
				<text>提交订单</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderCreateApi,
		payGroupOrderApi,
		getDefaultAddressApi
	} from '@/api/tuanApi.js';
	import prompt from '@/components/uni-prompt.vue';


	export default {
		components: {
			prompt
		},
		data() {
			return {
				showPay: false,
				detail: {},
				defaultAddress: {},
				payType: 1, //支付方式0余额支付，1支付宝h5，2微信公众号，3微信小程序
				goods_class: 1, //1代表实体2代表虚拟
				pay_param: {
					group_id: '',
					order_price: '0',
					phone: '',
					address_id: ''
				},
				orderInfo: {
					create_time: "",
					goods_name: "",
					goods_type: "",
					order_id: "",
					order_no: "",
					order_price: "",
					relation_id: "",
					users_id: '',
				},
				payInfo: {}
			}
		},
		onLoad(option) {
			if (Object.keys(option).length > 0) {
				this.detail = {
					...option
				};
			}
			if (option.group_id) {
				this.$set(this.pay_param, 'group_id', option.group_id);
			}
			if (option.price) {
				this.$set(this.pay_param, 'order_price', option.price);
			}
			if (option.goods_class) {
				this.goods_class = option.goods_class;
				if (option.goods_class == 1) {
					this.getDefaultAddress();
				} else {
					this.pay_param.phone = uni.getStorageSync('userInfo').phone;
				}
			}
			this.init();
		},
		methods: {
			init() {

			},
			async getDefaultAddress() {
				let res = await getDefaultAddressApi();
				this.defaultAddress = res.data.data || {};
			},
			selectAddress() {
				this.$util.redirectTo('/page_my/myAddress', {
					type: 'select'
				})
			},
			changeAddress(e) {
				this.defaultAddress = e;
			},

			async orderCreate() {
				let res = await orderCreateApi(this.pay_param);
				Object.assign(this.orderInfo, res.data.data);
				// this.orderInfo = res.data.data;
			},
			async orderPay() {
				let res = await payGroupOrderApi({
					order_no: this.orderInfo.order_no,
					pay_type: this.payType
				});
				uni.hideLoading();
				this.payInfo = res.data.data;

				if (this.payType == 0) {
					this.$util.redirectTo('/page_my/myInvolved', {
						orderType: res.data.data
					}, 'reLaunch');
					return;
				}
				if (this.payType == 1) {
					uni.setStorageSync('webviewUrl', this.payInfo.payData);
					this.$util.redirectTo('/otherpages/webview/webview');
					return;
				}
				if (this.payType == 2) {
					WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(this.payInfo.payData),
						(res) => {
							console.log(res);
						});
					uni.navigateBack({})
					return;
				}
			},
			// 去支付
			toPay() {
				if (this.goods_class == 1) {
					this.pay_param.address_id = this.defaultAddress.address_id;
					if (!this.pay_param.address_id) {
						this.$util.showToast({
							title: '请选择收货地址'
						})
						return
					}
				}
				if (this.goods_class == 2) {
					if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.pay_param.phone)) {
						this.$util.showToast({
							title: '请输入正确的手机号码'
						})
						return
					}
				}
				this.showPay = true;
			},
			async payConfirm(e) {
				uni.showLoading({
					title: '支付中...',
					mask: true
				});
				await this.orderCreate();
				this.orderPay();
				this.showPay = false;
			},
			changePayType(e) {
				this.payType = e.detail.value;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goods-pay-bottom-empty {
		height: 120rpx;
	}

	.goods-pay-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background-color: $white-color;
		padding: 0 30rpx;
		font-size: $font-28;

		.goods-pay-num {
			color: $gray-color;
			margin-left: 20rpx;
		}

		.goods-pay-price {
			margin-left: 20rpx;
			color: $app-primary-color;
			font-size: 36rpx;
			font-weight: bold;

			.goods-pay-price-label {
				font-size: $font-28;
				color: $font-color;
				font-weight: normal
			}
		}

		.goods-pay-btn {
			@extend %flex-center;
			margin-left: 20rpx;
			background-color: $app-primary-color;
			color: $white-color;
			height: 70rpx;
			padding: 0 30rpx;
			border-radius: 60rpx;
		}
	}

	.select-paytype-wrap {
		padding: 20rpx 0;

		.paytype-line {
			height: 80rpx;

			.paytype-icon {
				width: 50rpx;
				height: 50rpx;
				margin-right: 20rpx;
			}
		}
	}

	.order-price {
		flex: 1;
		text-align: right;
		font-size: 34rpx;
		font-weight: bold;
	}

	.select-address {
		flex: 1;
		align-items: center;
		text-align: right;
		padding-right: 30rpx;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			top: 12rpx;
			right: 0;
			width: 16rpx;
			height: 16rpx;
			border-right: 1rpx solid $black-color;
			border-top: 1rpx solid $black-color;
			transform: rotate(45deg);
		}
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
