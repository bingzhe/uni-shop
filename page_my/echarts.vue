<template>
	<view class='page-wrap'>
		<view class="rate-wrap-content">
			<canvas ref="myEcharts" canvas-id="myEcharts" id="myEcharts"></canvas>
		</view>
	</view>
</template>

<script>
	import {
		getRateListApi
	} from '@/api/tuanApi.js'
	import * as echarts from '@/static/js/echarts.min.js'
	export default {
		onLoad() {
			let that = this;
			console.log(echarts);
			this.$nextTick(()=>{
				that.drawLines()
			})
		},
		data() {
			return {
				myChart: null
			}
		},
		methods: {
			async drawLines(){
				this.myChart = echarts.init(document.getElementById('myEcharts'))
				let reportLine = [], tian = []
				let res = await getRateListApi()
				console.log(res.data.data);
				res.data.data.forEach((item, index)=>{
					tian.push(index+1)
					reportLine.push(item.rate)
				})
				
				let option = {
					// width: uni.upx2px(750),
					// height: uni.upx2px(500),
				  xAxis: {
				    type: 'category',
				    data: tian,
						axisTick: {
							inside: true
						}
				  },
				  yAxis: {
				    type: 'value',
				  },
					tooltip: {
						trigger: 'axis'
					},
				  series: [
				    {
				      data: reportLine,
				      type: 'line'
				    }
				  ]
				}
				// 把option设置给echarts实例
				this.myChart.setOption(option)
			}
		}
	}
</script>

<style lang='scss' scoped>
	#myEcharts {
		width: 100%;
		height: 600rpx;
		display: block;
	}
</style>
