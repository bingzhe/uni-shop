<template>
  <view>
    <swiper
      class="swiper-area w-full"
      :duration="0"
      :current="tabCurrentIndex"
      @change="changeTab"
    >
      <swiper-item
        class="tab-content wh-full"
        v-for="(member, memberIndex) in memberList"
        :key="memberIndex"
      >
        <view class="member-card">
          <view class="card-icon">
            <image
              class="card-image"
              :src="`/static/imgs/level/level-${memberIndex + 1}.png`"
            ></image>
          </view>
          <view class="level">
            {{ member.level }}
          </view>
        </view>

        <view class="welfare-content">
          <view class="welfare-title">会员福利</view>
          <view>
            {{ member.welfareList }}
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabCurrentIndex: 0,

      memberList: [
        {
          id: 0,
          level: "白银会员",
          welfareList: ["白银会员白银会员1", "白银会员白银会员2"],
        },
        {
          id: 1,
          level: "黄金会员",
          welfareList: ["白银会员白银会员1", "白银会员白银会员2"],
        },
      ],
    };
  },
  methods: {
    // swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
    },
  },
};
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: $page-color-base;
}

.swiper-area {
  min-height: 90vh;
}
.member-card {
  height: 300rpx;
  background: #ff6a6c;
  border-radius: 20rpx;
  margin: 30rpx;
  padding: 30rpx;

  .card-icon {
    .card-image {
      height: 100rpx;
      width: 100rpx;
    }
  }
  .level {
    font-size: 36rpx;
    color: #fff;
  }
}
.welfare-content {
  min-height: 400rpx;
  margin: 40rpx 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  font-size: 34rpx;
  background-color: #fff;

  .welfare-title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    font-style: italic;
  }
}
</style>
