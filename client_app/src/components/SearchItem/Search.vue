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
        <WarehouseT :shipments="postport_timenode.shipment" />
      </div>     
    </div>
  </div>  
  
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'
import SearchHeader from '@/components/searchItem/SearchHeader.vue'

import FlightSummary from './FlightSummary.vue'
import TimelineTabs from './TimelineTabs.vue'
import WarehouseT from './WarehouseT.vue'

export default {
  components: {
    MainHeader,
    SearchHeader,

    TimelineTabs,
    FlightSummary,
    WarehouseT
  },
  data() {
    return {
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
    // 格式化数据
    formattedData() {
      if (!this.responseData) return '暂无数据';
      
      try {
        const parsed = JSON.parse(this.responseData);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return this.responseData;
      }
    },

    getStatusText() {
      if (this.postport_timenode?.shipment?.length > 0) {
        const allArrived = this.postport_timenode.shipment.every(item => item.is_arrived === true);
        return allArrived ? '全部派送完成' : '派送中';
      }
      
      if (this.postport_timenode?.shipment?.length > 0) {
        const arrivedCount = this.postport_timenode.shipment.filter(item => item.is_arrived === true).length;
        const totalCount = this.postport_timenode.shipment.length;
        
        if (arrivedCount === totalCount) return '全部派送完成';
        if (arrivedCount > 0) return `部分派送中 (${arrivedCount}/${totalCount})`;
        return '待派送';
      }
      return '状态更新中';
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
          retrieval: {},
        };
        this.preport_timenode.getStatusText = this.getStatusText;
        this.postport_timenode = parsedData.postport_timenode || {
          shipment: []
        };
           
      } catch (error) {
        console.error('数据解析失败:', error);
      }
    }
  },

  methods: {
    formatStatusText(text) {
      const statusMap = {
        '创建订单': '订单创建',
        '到达港口': '已到港', 
        '预约港口提柜': '预约提柜',
        '港口提柜完成': '已提柜',
        '拆柜完成': '已拆柜'
      };
      return statusMap[text] || text;
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