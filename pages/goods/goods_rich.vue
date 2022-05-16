<template>
	<view class="page-wrap">
		<view class="goods-html">
			<rich-text :nodes="html"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				html: ''
			}
		},
		onLoad(option) {
			if (option.html) {
				this.html = option.html;
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		padding-top: 10rpx;
	}
	.goods-html {
		padding: 30rpx;
	}
</style>
