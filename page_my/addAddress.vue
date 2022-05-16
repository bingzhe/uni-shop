<template>
	<view>
		<view class="address_card">
			<view class="address_name">
				<view class="">联 系 人：</view>
				<input placeholder-style="font-size: 28rpx;" class="address_name_input" type="text"
					placeholder="请输入联系人姓名" v-model="dizhi.name">
			</view>
		</view>
		<view class="address_card">
			<view class="address_name">
				<view class="">手 机 号：</view>
				<input placeholder-style="font-size: 28rpx;" class="address_name_input" type="text" maxlength="11"
					placeholder="请填写手机号" v-model="dizhi.telephone">
			</view>
		</view>
		<view class="address_card">
			<view class="address_name" @click="btnClick">
				<view class="">收货地址：</view>
				<input placeholder-style="font-size: 28rpx;" class="address_name_input" type="text"
					placeholder="请选择收货地址" disabled :value="addressJoin">
				<view class="right_icon">
					<uni-icons type="forward" size="20"></uni-icons>
				</view>
			</view>
		</view>
		<view class="address_card">
			<view class="address_name">
				<view class="">详细地址：</view>
				<input placeholder-style="font-size: 28rpx;" class="address_name_input" type="text"
					placeholder="请填写详细地址" v-model="dizhi.address">
			</view>
		</view>
		<view class="address_card" style="border: none;">
			<view class="address_name">
				<view class="">设为默认地址：</view>
				<view class="switchBt">
					<switch :checked="switchChecked" color="#FF0000" @change="switch1Change"
						style="transform: scale(0.8);" />
				</view>
			</view>
		</view>
		<selectAddress ref='selectAddress' @selectAddress="successSelectAddress"></selectAddress>
		<button class="save_address" @click="saveAddress()">保存收货地址</button>
		<button v-if="editt" class="delete_address" @click="deleteAddress">删除收货地址</button>
	</view>
</template>

<script>
	import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue';

	import {
		saveAddressApi,
		delAddressApi,
	} from '@/api/tuanApi.js';

	export default {
		components: {
			selectAddress
		},
		data() {
			return {
				editt: false,
				addressJoin: '',
				dizhi: {
					address: '',
					telephone: null,
					name: '',
					province_name: '',
					city_name: '',
					area_name: '',
					is_default: 0
				},
				switchChecked: false
			};
		},
		onLoad(option) {
			// console.log(JSON.parse(option.editInformation));
			// let form = JSON.parse(JSON.stringify(option.editInformation))
			if (option.editInformation) {
				let form = JSON.parse(option.editInformation)
				this.editt = option.editt
				this.dizhi.address = form.address
				this.dizhi.telephone = form.telephone
				this.dizhi.name = form.name
				this.dizhi.province_name = form.province_name
				this.dizhi.city_name = form.city_name
				this.dizhi.area_name = form.area_name
				this.addressJoin = form.province_name + form.city_name + form.area_name
				if (form.is_default == 1) {
					this.switchChecked = true
				}
				if (this.editt) {
					this.dizhi.address_id = form.address_id
				}

			}
		},
		methods: {
			// 弹出选择省市区
			btnClick() {
				this.$refs.selectAddress.show()
			},
			// 选择默认地址
			switch1Change(e) {
				console.log(e.detail.value);
				if (e.detail.value) {
					this.dizhi.is_default = 1
				} else {
					this.dizhi.is_default = 0
				}
			},
			// 选择省市区回调
			successSelectAddress(address) { //选择成功回调
				this.addressJoin = address.join('')
				if (address.length == 2) {
					this.dizhi.province_name = address[0]
					this.dizhi.city_name = address[0]
					this.dizhi.area_name = address[1]
				} else {
					this.dizhi.province_name = address[0]
					this.dizhi.city_name = address[1]
					this.dizhi.area_name = address[2]
				}
				console.log(this.dizhi);
			},
			// 保存收货地址
			async saveAddress() {
				let addressData = {
					title: ''
				}
				// 手机格式校验
				const reg = RegExp(/^[1][0-9]{10}$/).test(this.dizhi.telephone)
				if (this.dizhi.name == '') {
					addressData.title = '联系人不能为空'
					this.$util.showToast(addressData)
				} else if (this.dizhi.telephone == '') {
					addressData.title = '手机号不能为空'
					this.$util.showToast(addressData)
				} else if (this.addressJoin == '') {
					addressData.title = '收货地址不能为空'
					this.$util.showToast(addressData)
				} else if (this.dizhi.address == '') {
					addressData.title = '详细地址不能为空'
					this.$util.showToast(addressData)
				} else if (!reg) {
					addressData.title = '请输入正确的手机号'
					this.$util.showToast(addressData)
				} else {
					let res = await saveAddressApi(this.dizhi)
					if (this.editt) {
						addressData.title = '地址修改成功'
					} else {
						addressData.title = '地址添加成功'
					}
					this.$util.showToast(addressData)
					let pages = getCurrentPages(); 
					let beforePage = pages[pages.length - 2]; //上个页面
					beforePage.$vm.getAddress && beforePage.$vm.getAddress()
					uni.navigateBack({
						delta: 1, //返回层数，2则上上页
					})
				}
			},
			// 删除地址
			async deleteAddress() {
				let res = await delAddressApi({
					address_id: this.dizhi.address_id
				})
				uni.showToast({
					title: '删除地址成功！',
					icon: 'none',
					duration: 2000
				})
				var pages = getCurrentPages(); //当前页
				var beforePage = pages[pages.length - 2]; //上个页面
				beforePage.$vm.getAddress()
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F6F6F6;
		padding-top: 20rpx;
	}

	uni-button:after {
		border: none;
	}

	.address_card {
		padding: 20rpx 0 20rpx 40rpx;
		border-bottom: 1rpx solid #cfd8dc;

		.address_name {
			display: flex;
			align-items: center;

			.address_name_input {
				height: 40rpx;
				margin-left: 20rpx;
				font-size: 28rpx;
			}

			.right_icon {
				position: absolute;
				right: 30rpx;
			}

			.switchBt {
				position: absolute;
				right: 20rpx;
			}

		}
	}

	.save_address {
		margin: auto;
		margin-top: 100rpx;
		width: 520rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: $red-color;
		color: #fff;
		border-radius: 40rpx;
		font-size: 28rpx;
	}

	.delete_address {
		margin: auto;
		margin-top: 50rpx;
		width: 520rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #bdbdbd;
		color: #fff;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
</style>
