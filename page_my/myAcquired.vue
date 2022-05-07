<template>
	<view class="page-wrap">

		<prompt :show="promptType === 'uni-prompt'" @onConfirm="onConfirm" @onCancel="prompt('')" title="请选择支付类型">

			<view class="prompt-title">
				<text>收货地址</text>
			</view>
			<view @click="selectAddress" class="select-address-wrap has-arrow has-active">
				<view class="address-info-city">
					<text>{{defaultAddress.province_name}}</text>
					<text>{{defaultAddress.city_name}}</text>
					<text>{{defaultAddress.area_name}}</text>
					<text>{{defaultAddress.address}}</text>
				</view>
				<view class="address-info-address">
				</view>
				<view class="address-info-user flex-title">
					<view class="main">
						<text>姓名：</text>
						<text>{{defaultAddress.name}}</text>
					</view>
					<view class="other">
						<text>电话：</text>
						<text>{{defaultAddress.telephone}}</text>
					</view>
				</view>
			</view>

			<view class="prompt-title">
				<text>支付方式</text>
			</view>
			<view class="select-paytype-wrap">
				<radio-group name="paytypeBox" @change="changePayType">
					<template v-if="$util.isWeiXin()">
						<view class="paytype-line flex-center-y">
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
						</view>
					</template>
					<template v-else>
						<view class="paytype-line flex-center-y">
							<image class="paytype-icon" src="/static/imgs/alipay.png" mode="aspectFit"></image>
							<label>
								<radio color="#fe543a" style="transform:scale(0.7)" value="1" checked />
								<text>支付宝支付</text>
							</label>
						</view>
					</template>
					<!-- <view class="paytype-line flex-center-y">
						<image class="paytype-icon" src="/static/imgs/wxpay.png" mode="aspectFit"></image>
						<label>
							<radio color="#fe543a" style="transform:scale(0.7)" value="2" /><text>微信支付</text>
						</label>
					</view> -->
				</radio-group>
			</view>
		</prompt>

		<!-- 选项卡切换 -->
		<v-tabs fixed lineHeight="4rpx" lineColor="#DC201F" activeColor="#DC201F" activeFontSize="32rpx"
			fontSize="32rpx" color="#999999" bgColor="#FFFFFF" height="100rpx" v-model="activeTab" :scroll="false"
			:tabs="tabs" @change="changeTab"></v-tabs>

		<view class="order-list-wrap">
			<view v-if="list.length > 0" class="order-list">

				<view class="order-card" v-for="(item, index) in list" :key="index">
					<view class="order-card-title flex-title">
						<view class="main">
							<text v-if="activeTab == 0">待支付</text>
							<text v-if="activeTab == 1">待发货</text>
							<text v-if="activeTab == 2">已发货</text>
							<text v-if="activeTab == 3">已完成</text>
						</view>
						<view v-if="activeTab == 0" class="other">
							<uni-countdown @timeOver="searchFn" :font-size="12" :day="item.showDay"
								:hour="item.showHour" :minute="item.showMinute" :second="item.showSecond"
								:showDay="item.showDay > 0" color="#FFFFFF" splitorColor="#FFFFFF"
								background-color="transplate" />
						</view>
					</view>
					<view class="order-card-body">
						<image class="order-detail-img" :src="$util.img(item.goods_img)" mode="aspectFit"></image>
						<!-- <view class="order-img">
						</view> -->
						<view class="order-detail">
							<view class="order-detail-top">
								<view class="order-detail-name">
									<text>{{item.goods_name}}</text>
								</view>
								<view class="order-detail-price">
									<text>成交价：</text>
									<text>￥{{item.get_price || 0}}</text>
								</view>
								<view class="order-detail-time">
									<text>成交价时间：</text>
									<text>{{moment(item.return_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</text>
								</view>
							</view>
							<view class="order-detail-bottom flex-title">
								<view class="main" style="flex: none;">
									<view @click="logisticsClick(item, index)" v-if="activeTab == 2 || activeTab == 3"
										class="order-logistics-btn order-buy-btn">
										<text>查看物流</text>
									</view>
								</view>
								<view class="other">
									<view @click="toBuy(item, index)" v-if="activeTab == 0" class="order-buy-btn">
										<text>去支付</text>
									</view>
									<view @click="receiptClick(item, index)" v-if="activeTab == 2"
										class="order-buy-btn">
										<text>确认收货</text>
									</view>
									<view @click="delClick(item, index)" v-if="activeTab == 3" class="order-buy-btn">
										<text>删除订单</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

			</view>

			<view v-else class="order-list-empty">
				<text>暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import prompt from '@/components/uni-prompt.vue';
	import {
		orderCreateApi,
		orderPayApi,
		myHarvestApi,
		getDefaultAddressApi,
		receiptApi,
		orderDelApi
	} from '@/api/seckillApi.js';

	export default {
		components: {
			prompt
		},
		data() {
			return {
				activeTab: 0, // 0待支付1待发货2已发货3已完成
				tabs: ['待支付', '待发货', '已发货', '已完成'],
				list: [],
				payType: 1, // 支付类型1代表支付宝，2代表微信
				payPrice: 0,
				promptType: '',
				clickItem: null,
				defaultAddress: {},
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
				payInfo: {},
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			moment,
			init() {
				if (this.$util.isWeiXin()) {
					this.payType = 2;
				}
				this.myHarvest(this.activeTab);
				this.getDefaultAddress();
			},
			formatCountdown(list, key) {
				let nowTime = moment();
				if (!Array.isArray(list)) {
					return [];
				}
				list = list.map(item => {
					let time = moment(item[key] * 1000).add(3, 'd').valueOf() - nowTime;

					console.log(time);
					return Object.assign(item, {
						showDay: moment.duration(time).days(),
						showHour: moment.duration(time).hours(),
						showMinute: moment.duration(time).minutes(),
						showSecond: moment.duration(time).seconds(),
						// showDay: moment.duration(time).asDays(),
						// showHour: time.hours() - nowTime.hours(),
						// showMinute: time.minute() - nowTime.minute(),
						// showSecond: time.second() - nowTime.second(),
						showTime: item[key] * 1000 - new Date()
					})
				});
				console.log(list);
				return list;
			},
			async getDefaultAddress() {
				let res = await getDefaultAddressApi();
				// console.log(res)

				// if (res.data.data == null) {
				// 	uni.showToast({
				// 		title: '请添加收货地址',
				// 		icon: 'none',
				// 		duration: 2000,
				// 		success: () => {
				// 			this.$util.redirectTo('/page_my/myAddress');
				// 		}
				// 	})

				// 	return
				// }

				this.defaultAddress = res.data.data || {};
			},
			prompt(type) {
				this.promptType = type;
			},
			// 切换状态
			changeTab(e) {
				this.list = [];
				this.myHarvest(e);
			},
			// 查询列表并赋值
			async myHarvest(status) {
				let res = await myHarvestApi({
					status
				});
				// this.list = res.data.data;
				this.list = this.formatCountdown(res.data.data, 'return_time')

			},
			// 生成订单
			async orderCreate() {
				let res = await orderCreateApi({
					goods_type: 4,
					relation_id: this.clickItem.seckill_id,
					order_price: this.payPrice,
					address_id: this.defaultAddress.address_id
				});
				Object.assign(this.orderInfo, res.data.data);
				// this.orderInfo = res.data.data;
			},

			async orderPay() {
				let res = await orderPayApi({
					order_no: this.orderInfo.order_no,
					pay_type: this.payType
				});
				uni.hideLoading();
				this.payInfo = res.data.data;
				if (this.payType == 2) {
					WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(this.payInfo.payData),
						(res) => {
							console.log(res);
						})
					return;
				}
				uni.setStorageSync('webviewUrl', this.payInfo.payData);
				this.$util.redirectTo('/otherpages/webview/webview')
				// console.log(res.data)
			},

			toBuy(item, index) {
				if (Object.keys(this.defaultAddress).length == 0) {
					this.selectAddress();
					return;
				}

				this.clickItem = item;
				// 成交价减去报名价
				this.payPrice = Number(this.clickItem.get_price) - Number(this.clickItem.signup_price);

				if (this.payPrice < 0) {
					this.payPrice = 0;
				}
				// this.$util.redirectTo('/page_my/myAddress', {
				// 	type: 'select'
				// })
				this.prompt('uni-prompt');
			},

			changePayType(e) {
				this.payType = e.detail.value;
			},

			async onConfirm() {
				uni.showLoading({
					title: '支付中...',
					mask: true
				});
				await this.orderCreate();
				if (this.payPrice == 0) {
					this.$util.showToast({
						title: '支付成功'
					})
				} else {
					this.orderPay();
				}
				// await this.orderPay();
				this.myHarvest(this.activeTab);
				this.prompt('');
			},

			selectAddress() {
				this.$util.redirectTo('/page_my/myAddress', {
					type: 'select'
				})
			},
			changeAddress(e) {
				this.defaultAddress = e;
			},
			// 查看物流
			logisticsClick(item, index) {
				this.$util.redirectTo('/pages/goods/logistics', {
					detail: JSON.stringify(item)
				})
			},
			// 确认收货
			async receiptClick(item, index) {
				let res = await receiptApi({
					seckill_id: item.seckill_id
				})
				this.myHarvest(this.activeTab);
				this.$util.showToast({
					title: '确认收货成功'
				})
			},

			delClick(item, index) {
				uni.showModal({
					title: '确定删除该订单？',
					success: async (res) => {
						if (res.confirm) {
							await orderDelApi({
								seckill_id: item.seckill_id
							})
							this.myHarvest(this.activeTab);
							this.$util.showToast({
								title: '删除成功'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.prompt-title {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 30rpx;
		font-size: $font-28;
	}

	.select-address-wrap {
		padding: 0 60rpx 0 30rpx;
		width: 100%;
		position: relative;

		&::after {
			position: absolute;
			top: 50rpx;
			right: 30rpx;
			content: '';
			width: 16rpx;
			height: 16rpx;
			border-right: 1rpx solid $black-color;
			border-top: 1rpx solid $black-color;
			transform: rotate(45deg);
		}

		.address-info-city {
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			line-height: 40rpx;
			font-size: $font-24;
		}

		.address-info-user {
			color: $app-primary-color;
			font-size: $font-26;
		}
	}

	.order-list-wrap {
		padding: 0 30rpx;
	}

	.order-list {}

	.order-card {
		margin-top: 20rpx;

		.order-card-title {
			width: 100%;
			padding: 0 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 20rpx 20rpx 0 0;
			background-color: $app-primary-color;
			color: $white-color;
		}

		.order-card-body {
			background-color: $white-color;
			border-radius: 0 0 20rpx 20rpx;
			padding: 20rpx;
			@extend %flex-center-y;

			.order-buy-btn {
				background-color: $app-primary-color;
				color: $white-color;
				padding: 6rpx 30rpx;
				border-radius: 30rpx;
				font-size: $font-26;

				&.disabled,
				&:active {
					background-color: $gray-color;
				}
			}

			.order-detail-img {
				width: 200rpx;
				height: 200rpx;
				background-color: aliceblue;
				border-radius: 16rpx;
			}

			.order-detail {
				margin-left: 20rpx;
				height: 200rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.order-detail-name {
					font-size: $font-30;
					line-height: 50rpx;
				}

				.order-detail-price {
					color: $app-primary-color;
					font-size: $font-24;
					line-height: 40rpx;
				}

				.order-detail-time {
					color: $gray-color;
					font-size: $font-24;
					line-height: 40rpx;
				}

			}
		}
	}

	.order-list-empty {
		@extend %flex-center;
		height: 500rpx;
		color: $gray-color;
	}


	.goods-price-wrap {
		padding: 0 30rpx;
		@extend %flex-center-y;
		background-color: $app-primary-color;
		// background-color: #DC201F;
		color: $white-color;
		height: 100rpx;
		font-size: 40rpx;

		.goods-price-img {
			margin-left: 20rpx;
			width: 120rpx;
		}
	}

	.goods-title {
		.goods-tags-wrap {
			.goods-tags {
				color: $app-primary-color;
				font-size: $font-24;
				border: 1rpx solid $app-primary-color;
				padding: 2rpx 20rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
			}
		}
	}

	.activity-card {
		margin-top: 40rpx;
		position: relative;
		width: 100%;

		.activity-card-title-wrap {
			position: absolute;
			width: 100%;
			top: 0;
			@extend %flex-center;

			.activity-card-title-text {
				position: relative;
				z-index: 20;
				color: $white-color;
			}

			.activity-card-title-img {
				position: absolute;
				top: -10rpx;
				width: 400rpx;
				height: 100rpx;
			}
		}

		.activity-card-body {
			padding-top: 90rpx;
			// background-color: yellow;
			margin: 0 auto 0;
			background-image: url(/static/imgs/card-bg.png);
			background-size: 100% 100%;
			width: 690rpx;
			height: 360rpx;
			overflow: hidden;

			.countdown-wrap {
				position: relative;

				&::before,
				&::after {
					position: absolute;
					content: "";
					width: 120rpx;
					height: 3rpx;
					background-color: #232323;
				}

				&::before {
					left: 30rpx;
				}

				&::after {
					right: 30rpx;
				}
			}

			.detail-info {
				padding: 60rpx 30rpx 0;
				font-size: $font-28;
				line-height: 50rpx;
			}
		}
	}

	.select-paytype-wrap {
		margin-bottom: 40rpx;

		.paytype-line {
			height: 50rpx;
			line-height: 50rpx;

			.paytype-icon {
				width: 50rpx;
				height: 50rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
