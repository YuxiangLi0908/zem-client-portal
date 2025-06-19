<template>
  <div class="login-wrapper">
    <MainHeader />
    <div class="search-banner" style="background: linear-gradient(135deg, #32bfc0, #2a8a8b); padding: 30px 0;">
      <SearchHeader />
    </div>
    <div class="container-tracking">
      <div class="visualization-section" style="background: #ffffff">
        <FlightSummary :data="preport_timenode" />
        <TimelineTabs :preport="preport_timenode" :postport="postport_timenode" />
        <DistributionGrid :shipments="postport_timenode.shipment" />
        <WarehouseMatrix :shipments="postport_timenode.shipment" />
      </div>     
    </div>
  </div>  
  
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'
import SearchHeader from '@/components/searchItem/SearchHeader.vue'

import FlightSummary from './FlightSummary.vue'
import TimelineTabs from './TimelineTabs.vue'
import DistributionGrid from './DistributionGrid.vue'


export default {
  components: {
    MainHeader,
    SearchHeader,

    TimelineTabs,
    FlightSummary,
    DistributionGrid
  },
  data() {
    return {
      // 初始化数据结构
      postport_timenode: {
        shipment: []
      },
      preport_timenode: {
        history: [],
        container: {},
        vessel: {},
        retrieval: {}
      }
    }
  },
  computed: {
    // 格式化数据以便显示
    formattedData() {
      if (!this.responseData) return '暂无数据';
      
      try {
        // 如果是JSON字符串，则格式化输出
        const parsed = JSON.parse(this.responseData);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // 如果不是JSON，直接显示
        return this.responseData;
      }
    }
  },
  created() {
    if (this.$route.query.data) {
      this.responseData = decodeURIComponent(this.$route.query.data);
      try {
        const parsedData = JSON.parse(this.responseData);
        
        this.preport_timenode = parsedData.preport_timenode || {
          history: [],
          container: {},
          vessel: {},
          retrieval: {}
        };
        
        this.postport_timenode = parsedData.postport_timenode || {
          shipment: []
        };
           
      } catch (error) {
        console.error('数据解析失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  width: 99.5vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -49.75vw;
  margin-right: -49.75vw;
  overflow-x: hidden;
}

.visualization-section {
  padding: 30px;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.search-banner {
  background: linear-gradient(135deg, #32bfc0, #2a8a8b); 
  padding: 30px 0;
  margin-bottom: 20px;
}
</style>