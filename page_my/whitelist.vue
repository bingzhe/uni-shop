<template>
	<view class='page-wrap'>
		<view class="myform">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="手机号" name="username">
					<uni-easyinput type="text" v-model="formData.username" placeholder="请输入登录名称" />
				</uni-forms-item>
				<uni-forms-item label="编号" name="code">
					<uni-easyinput type="text" v-model="formData.code" placeholder="请输入编号" />
				</uni-forms-item>
			</uni-forms>
			<button @click="submitForm">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		setWhiteListApi
	} from '@/api/tuanApi.js'
	export default {
		data() {
			return {
				formData: {
					username: '',
					code: '',
					userId: '',
				}
			}
		},
		methods: {
			async submitForm(){
				this.formData.userId = uni.getStorageSync('userInfo').users_id
				if(this.formData.username && this.formData.code){
					let res = await setWhiteListApi(this.formData)
					this.$util.showToast({
						title: '提交成功'
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/my/my'
						});
					}, 2000)
					
				}else{
					this.$util.showToast({
						title: '请输入登录名称和编号'
					})
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.page-wrap {
		padding: 40rpx;
	}
	.myform {
		width: 90%;
	}
</style>
