<template>
	 <view>
	    <!-- 页面A跳转过来携带的url参数 -->
	    <web-view :src="url"></web-view>
	  </view>
</template>
<script>

	export default {
		data() {
			return {
				 url: '',
			}
		},
		onLoad(option) {
			  // e.url 就是页面 A 跳转过来携带的url参数
		 this.url = option.url;
		},
		created() {

		}

	}
</script>
