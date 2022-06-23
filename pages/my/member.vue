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
            {{ member.levelName }}
          </view>
        </view>

        <view class="welfare-content">
          <view class="welfare-title">达标条件</view>
          <view>
            <view v-for="condition in member.conditionsList">
              {{ condition }}
            </view>
          </view>
        </view>

        <view class="welfare-content">
          <view class="welfare-title">会员福利</view>
          <view>
            <view v-for="welfare in member.welfareList">
              {{ welfare }}
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { memberConfigListApi } from "@/api/tuanApi.js";

export default {
  data() {
    return {
      tabCurrentIndex: 0,

      memberList: [
        // {
        //   id: 0,
        //   level: "白银会员",
        //   conditionsList: [],
        //   welfareList: ["白银会员白银会员1", "白银会员白银会员2"],
        // },
      ],
    };
  },
  onLoad() {
    this.getMemberConfigList();
  },
  methods: {
    // swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
    },
    transformLevelName(level) {
      let levelName = "";
      switch (level) {
        case 1:
          levelName = "黄金会员";
          break;
        case 2:
          levelName = "白金会员";
          break;
        case 3:
          levelName = "县级代理";
          break;
        case 4:
          levelName = "市级代理";
          break;
        case 5:
          levelName = "省级代理";
          break;
        case 6:
          levelName = "股东";
          break;

        default:
          break;
      }

      return levelName;
    },
    async getMemberConfigList() {
      const { data: result } = await memberConfigListApi();
      if (result.code !== 200) return;

      const list = result.data.map((item) => {
        item.levelName = this.transformLevelName(item.level);

        const tuanLevelName = this.transformLevelName(item.tuan_level);

        if (item.level == 1) {
          item.conditionsList = ["未购买产品"];
          item.welfareList = ["无权复购", "无权分润"];
        } else if (item.level == 2) {
          item.conditionsList = ["购买产品"];
          item.welfareList = [
            "有权复购",
            `一级销售分润：可获得${item.rate}%（税前）`,
            `二级销售分润：可获得${item.indirect_rate}%（税前）`,
          ];
        } else if (item.level == 3) {
          item.conditionsList = [
            `接销售产品${item.main_num}套`,
            `团队业绩${item.tuan_performance}元`,
          ];
          item.welfareList = [
            `一级销售分润：可获得${item.rate}%（税前）`,
            `二级销售分润：可获得${item.indirect_rate}%（税前）`,
            `给予补贴${item.fixed}元/套(新售)`,
          ];
        } else if (item.level == 4 || item.level == 5) {
          item.conditionsList = [
            `接销售产品${item.main_num}套`,
            `直推${item.zhi_num}个${tuanLevelName}`,
            `团队业绩${item.tuan_performance}元`,
          ];
          item.welfareList = [
            `一级销售分润：可获得${item.rate}%（税前）`,
            `二级销售分润：可获得${item.indirect_rate}%（税前）`,
            `给予补贴${item.fixed}元/套(新售)`,
          ];
        } else if (item.level == 6) {
          item.conditionsList = [
            `接销售产品${item.main_num}套`,
            `直推${item.zhi_num}个${tuanLevelName}`,
            `团队业绩${item.tuan_performance}元`,
          ];
          item.welfareList = [
            "股东享受公司商城系全球业绩营业额2%加权分红，签约生效",
          ];
        }
        return item;
      });

      this.memberList = list;
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
  min-height: 350rpx;
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
