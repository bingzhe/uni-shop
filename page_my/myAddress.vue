<template>
	<view class="page-wrap">
		<!-- 地址卡片 -->
		<radio-group @change="changeAddress">
			<view class="address_card" v-for="(item,index) in addressList" :key='index'>
				<view class="address_card_ct">
					<view class="mt_20" style="display: flex;">
						{{item.province_name}}{{item.city_name}}{{item.area_name}}
						<view class="default" v-if="item.is_default == 1">默认</view>
					</view>
					<view class="mt_20">{{item.address}}</view>
					<view>{{item.name}}{{' '}}{{item.telephone}}</view>
				</view>
				<view v-if="type == 'default'" class="address_card_et" @click="editAddress(item)">
					<uni-icons type="compose" size="20"></uni-icons>
					<text style="font-size: 28rpx;">编辑</text>
				</view>
				<view v-if="type == 'select'" class="address_card_et">
					<radio color="#DC201F" :value="String(index)" :checked="item.is_default == 1"
						style="transform: scale(0.7);" />
					<text style="font-size: 28rpx;">选择</text>
				</view>

			</view>

		</radio-group>
		<!-- 新增地址 -->
		<button v-if="addressList.length == 0 || type == 'default'" class="addBtn" @click="addAddress">新增地址</button>

		<view v-if="type == 'select' && addressList.length > 0" class="btn-wrap">
			<button class="btn-item" @click="addAddress">新增地址</button>
			<button class="btn-item" @click="selectAddress">确认</button>
		</view>
	</view>
</template>

<script>
	import {
		getAddressApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				selected_item: null,
				type: 'default',
				addressList: []
			};
		},
		onLoad(option) {
			this.getAddress();
			if (option.type) {
				this.type = option.type;
			}
			if (this.type == 'select') {
				uni.setNavigationBarTitle({
					title: '选择地址'
				})
			}
		},
		methods: {
			// 获取地址列表
			async getAddress() {
				let res = await getAddressApi()
				let data = res.data.data
				data.forEach((item, index) => {
					if (item.is_default == 1) {
						this.selected_item = item;
						data.unshift(data.splice(index, 1)[0]);
					}
				})
				this.addressList = data;

				// console.log(this.addressList);
			},
			// 新增地址
			addAddress() {
				this.$util.redirectTo('/page_my/addAddress');
			},
			// 编辑地址
			editAddress(item) {
				let editt = true
				this.$util.redirectTo('/page_my/addAddress?editt=' + editt + '&editInformation=' + JSON.stringify(item));
			},

			// 选择地址
			changeAddress(e) {
				this.selected_item = this.addressList[e.detail.value];
			},
			// 确认
			selectAddress() {
				if (!this.selected_item) {
					this.$util.showToast({
						title: '请选择一个地址'
					})
					return;
				}
				let pages = getCurrentPages();
				let backPage = pages[pages.length - 2]
				backPage.$vm.changeAddress && backPage.$vm.changeAddress(this.selected_item)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F6F6F6;
		padding-bottom: 190rpx;
	}

	.page-wrap {
		padding: 10rpx 20rpx;
	}

	.mt_20 {
		margin-bottom: 20rpx;
	}

	.address_card {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// height: 222rpx;
		margin-top: 30rpx;
		padding: 30rpx 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.03);

		.address_card_ct {
			display: flex;
			flex-direction: column;
			color: #333333;
			font-size: 28rpx;
		}

		.address_card_et {
			display: flex;
			align-items: center;
			color: #353535;
		}
	}

	.addBtn {
		position: fixed;
		bottom: 70rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 560rpx;
		height: 86rpx;
		background: $red-color;
		border-radius: 43rpx;
		color: #fff;
		font-size: 32rpx;
		line-height: 86rpx;
	}

	.default {
		box-sizing: border-box;
		width: 60rpx;
		height: 40rpx;
		padding: 5rpx;
		margin-left: 20rpx;
		text-align: center;
		line-height: 27rpx;
		font-weight: 100;
		border: 1rpx solid $red-color;
		font-size: 24rpx;
		border-radius: 10rpx;
		color: $red-color;
	}

	.btn-wrap {
		@extend %flex-center;
		flex-direction: column;
		position: fixed;
		left: 0;
		bottom: 70rpx;
		width: 100%;
		// background-color: yellow;
		.btn-item {
			margin-top: 30rpx;
			width: 560rpx;
			height: 86rpx;
			background: $red-color;
			border-radius: 43rpx;
			color: #fff;
			font-size: 32rpx;
			line-height: 86rpx;
		}
	}
</style>
