<template>
	<view class="page-wrap">
		<view class="goods-html">
			<rich-text :nodes="html" preview="true"></rich-text>
			 <!-- <u-parse :content="html" style=""></u-parse> -->

		</view>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse.vue'
	import {
		getShopInfoApi,
	} from '@/api/tuanApi.js';
	export default {
		data() {
			return {
				shop_id: '',
				html: ''
			}
		},
		onLoad(option) {
			if (option.shop_id) {
				this.shop_id = option.shop_id;
			}
			this.getShopInfo()
		},
		methods: {
			removeParse(str){
				str =str.replace('"="','')
				return str;
			},
			async getShopInfo(){
				// console.log(this)
				var res = await getShopInfoApi({shop_id:this.shop_id})
				// console.log(res.data.data.goods_content);
				var htmlNode =res.data.data.goods_content;
				// console.log(htmlNode);
				// this.html = res.data.data.goods_content?res.data.data.goods_content:''
				
				// var node =this.removeParse(htmlNode);
				// console.log(node);
				// var detailHtml = htmlNode.replace(/width\:653px/g, "width: 100%")
				this.html=res.data.data.goods_content?res.data.data.goods_content:'';
				// this.html=detailHtml;
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	 @import url("../../components/u-parse/u-parse.css");
	 .page-wrap /deep/ img {
		 width: 100% !important;
	 }
	.page-wrap {
		padding-top: 10rpx;
		
		.goods-html {
			padding: 8rpx;
			
			 .goods-html /deep/ img {
				width: 100%;
				// margin-right: 10rpx;
			}
		}
	}
	
</style>
