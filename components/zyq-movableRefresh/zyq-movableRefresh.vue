<template>
	<view>
		<movable-area style="width: 100%;" :style="{'height':scrollHeight+50+'px'}">
			<view class="display_flex_center" style="height: 40px;font-size: 15px;color:#6b6a6a;">
				<view v-if="refreshSuccess">
					{{refreshSuccessText}}
				</view>
				<block v-else>
					<view v-if="!refreshing" class="refresh-icon display_flex_center" :class="{'refresh-icon-active': refreshFlag}">↓</view>
					<view v-if="!refreshing">{{refreshFlag?refreshReady:refreshText}}</view>
					<view v-else class="display_flex_center">
						<image src="./loading.gif" class="loading_img"></image>
						<text>{{refreshingText}}</text>
					</view>
				</block>
			</view>
			<movable-view :x="x" :y="y" :direction="isRefresh?'vertical':'none'" :out-of-bounds='false' style="width:100%;" :style="{'height':scrollHeight+'px'}"
			 @change="onChange" @touchend="touchend">
				<view :style="{'height':scrollHeight+'px'}">
					<scroll-view :scroll-y="scrollStatus" :style="{'height':scrollHeight+'px','background':backgroundColor}" :scroll-into-view="top_viewId" :upper-threshold="10" @scroll="onScroll" @scrolltoupper="scrollToTop" @scrolltolower="loadMore">
						<view id="top_view" @touchstart="touchstart" @touchmove="touchMove">
							<slot></slot>
						</view>
						<view class="display_flex_center" style="height: 40px;font-size: 15px;color:#999">
							<block v-if="noMore">
								{{noMoreText}}
							</block>
							<block v-else-if="isLoading!=2">
								{{loadingMoreText}}
							</block>
							<block v-else>
								{{loadingText}}
							</block>
						</view>
						<view v-if="showGoTop && scrollTop>scrollHeight" class="go_top_icon_back" @click.stop="goTop">
							<image src="./go_top.png" class="top_icon"></image>
						</view>
					</scroll-view>
				</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
export default {
	name:"zyq-movableRefresh",
	props: {
		isRefresh: {
			type: Boolean,
			default: true
		},
		scrollHeight: {
			type: Number,
			default: 300
		},
		refreshText: {
			type: String,
			default:'下拉可以刷新'
		},
		refreshReady: {
			type: String,
			default:'释放立即刷新'
		},
		refreshingText: {
			type: String,
			default:'正在刷新...'
		},
		refreshSuccessText: {
			type: String,
			default:'刷新完成'
		},
		loadingMoreText: {
			type: String,
			default:'上拉加载更多'
		},
		loadingText: {
			type: String,
			default:'正在加载...'
		},
		noMoreText: {
			type: String,
			default:'已经到底了~'
		},
		pullHeight: {
			type: Number,
			default: 40
		},
		noMore: {
			type:Boolean,
			default:false
		},
		backgroundColor:{
			type: String,
			default:'#eee'
		},
		showGoTop: {
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
			x: 50,
			y: 0,
			old: {
			    x: 0,
			    y: 0
			},
			refreshFlag: false,
			refreshing: false,
			scrollStatus: true,
			isLoading: 0,	//加载状态，1：正在下拉刷新，2：正在触底加载
			refreshSuccess: false,
			scrollTop: 0,
			startX: 0,
			startY: 0,
			inTop: true,
			moveHeight: 0	,//下拉刷新移动距离
			showLoadingMore: false,
			top_viewId: ''
		};
	},
	methods:{
		onChange(e){
			 let y = e.detail.y
			 this.old.x = e.detail.x
			 this.old.y = y
			 this.moveHeight = y
			 if(y<this.pullHeight){
				 this.refreshFlag = false
			 }else{
				 this.refreshFlag = true
			 }
		},
		touchstart(e){
			let obj = e.changedTouches[0]
			this.startX = obj.pageX
			this.startY = obj.pageY
		},
		touchMove(e){
			if(!this.isRefresh){
				 return
			}
			this.refreshSuccess = false
			let obj = e.changedTouches[0]
			let endX = obj.pageX
			let endY = obj.pageY
			let distanceX = endX - this.startX
			let distanceY = endY - this.startY
			if((this.inTop || this.scrollTop==0) && Math.abs(distanceX)<Math.abs(distanceY) && distanceY>0){
				this.scrollStatus = false
			}
		},
		touchend(e){
			 let that = this
			 let moveHeight = this.moveHeight
			 if(moveHeight<this.pullHeight){
				 this.x = this.old.x
				 this.y = this.old.y
				 this.$nextTick(function() {
					 this.x = 0
					 this.y = 0
				 })
				 this.refreshFlag = false
				 this.refreshing = false
			 }else{
				 this.refreshing = true
				 this.refreshFlag = true
				 this.refresh()
			 }
			 this.scrollStatus = true
		},
		scrollToTop(e){
			if(this.scrollTop<5){
				this.inTop = true
			}
		},
		onScroll(e){
			let scrollTop = e.detail.scrollTop
			this.scrollTop = scrollTop
			this.$emit('onScroll',scrollTop);
			if(scrollTop>3){
				this.inTop = false
			}else{
				this.inTop = true
			}
		},
		goTop(){
			this.top_viewId = ""
			this.$nextTick(function() {
				this.top_viewId = "top_view"
			})
		},
		runRefresh(callback=false){
			let that = this
			this.x = this.old.x
			this.y = this.old.y
			this.$nextTick(function() {
				this.scrollTop = 0
				this.x = that.pullHeight
				this.y = that.pullHeight
				that.refreshing = true
				that.refreshFlag = true
				that.refresh()
			})
		},
		refresh(){
			if(this.isLoading){
				return
			}
			this.isLoading = 1
			this.$emit('refresh');
		},
		loadMore(){
			if(this.noMore || this.isLoading){
				return
			}
			this.isLoading = 2
			this.$emit('loadMore');
		},
		endLoad(){
			let that = this
			this.refreshSuccess = true
			setTimeout(function(){
				that.refreshSuccess = false
			},800)
			this.x = this.old.x
			this.y = this.old.y
			this.$nextTick(function() {
				 this.x = 0
				 this.y = 0
			})
			this.scrollStatus = true
			this.refreshing = false
			this.refreshFlag = false
			this.isLoading = 0
		}
	}
}
</script>

<style>
.display_flex_center{
	display: flex;
	justify-content: center;
	align-items: center;
}
.refresh-icon {
	width: 20px;
	height: 20px;
	font-weight: 700;
	transition-duration: .5s;
	transition-property: transform;
	transform: rotate(0deg);
}
.refresh-icon-active {
	transform: rotate(180deg);
}
.loading_img{
	width: 20px;
	height: 20px;
	margin-right: 5px;
}
.go_top_icon_back{
	position: fixed;
	right: 40px;
	bottom: 40px;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	background: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}
.top_icon{
	height: 30px;
	width: 30px;
}
</style>
