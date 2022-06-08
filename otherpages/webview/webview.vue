<template>
	<view class="content">
		<web-view :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: ''
			};
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: uni.getStorageSync('webviewTitle') || '一亩莲'
			})
			uni.removeStorageSync('webviewTitle')
			if (option.link) {
				this.link = decodeURI(option.link);
				this.link = option.link
				console.log(this.link)
			} else {
				this.init();
			}
		},
		methods: {
			init() {
				this.link = uni.getStorageSync('webviewUrl')
				// uni.removeStorageSync('webviewUrl')
			}
		}
	};
</script>
