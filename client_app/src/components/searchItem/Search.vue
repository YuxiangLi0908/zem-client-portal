<template>
  <div class="login-wrapper">
    <MainHeader />
    <div class="search-banner" style="background: linear-gradient(135deg, #32bfc0, #2a8a8b); padding: 30px 0;">
      <SearchHeader />
    </div>

    <div v-if="shouldShowEmptyContainer" class="empty-container">
      <div class="empty-content">
        <h3>未找到柜号信息</h3>
        <p>请检查柜号是否正确，或联系客服人员核实</p>       
        <div class="contact-row">
          <div class="contact-item">           
            <img 
              src="@/assets/images/idCard/nj_sav_create_order.jpg" 
              alt="NJ/SAV地区客服微信"
              class="wechat-qrcode"
            >
            <div class="region-badge">NJ/SAV地区</div>
          </div>
          
          <div class="contact-item">           
            <img 
              src="@/assets/images/idCard/la_create_order.jpg" 
              alt="LA地区客服微信"
              class="wechat-qrcode"
            >
            <div class="region-badge">LA地区</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container-tracking">
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
    shouldShowEmptyContainer() {
      return (
        !this.responseData || 
        this.responseData.preport_timenode === null ||
        (typeof this.responseData === 'string' && 
         this.responseData.includes('"preport_timenode":null'))
      )
    },
    formattedData() {
      if (!this.responseData) return '暂无数据';
      try {
        const parsed = JSON.parse(this.responseData);
        console.log(parsed);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return this.responseData;
      }
    },
    getStatusText() {    
      if (!this.postport_timenode?.shipment || this.postport_timenode.shipment.length === 0) {
        //表示还没有到港后
        if (this.preport_timenode?.history?.length > 0){
          const lastHistory = this.preport_timenode.history[this.preport_timenode.history.length - 1];
          const statusText = lastHistory.description.split(/[,:]/)[0].trim();
          return `已${statusText}`;
        }
        return '状态更新中';
      };
      
      const shipment = this.postport_timenode.shipment;
      const arrivedCount = shipment.filter(item => item.is_arrived).length;
      const totalCount = shipment.length;
      if (arrivedCount === totalCount) return '全部派送完成';
      if (arrivedCount > 0) return `部分派送中 (${arrivedCount}/${totalCount})`;
      return totalCount > 0 ? '待派送' : '状态更新中';
    }
  },
  created() {
    this.parseRouteData(this.$route.query.data);
  },
  watch: {
    '$route.query.data': {
      immediate: true,
      handler(newVal) {
        this.parseRouteData(newVal);
      }
    }
  },
  methods: {
    parseRouteData(encodedData) {
      if (!encodedData) return;
      
      try {
        this.responseData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(this.responseData);
        
        this.preport_timenode = {
          ...(parsedData.preport_timenode || {
            history: [],
            container: {},
            vessel: {},
            retrieval: {}
          })
        };
        this.preport_timenode.getStatusText = this.getStatusText;
        this.postport_timenode = {
          ...(parsedData.postport_timenode || {
            shipment: []
          }),
        };
        
      } catch (error) {
        console.error('数据解析失败:', error);
      }
    },
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

.empty-container {
  display: flex;
  justify-content: center;
  height:520px;
  background: #fff;
  margin: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.contact-row {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
  width: 100%;
}

.contact-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  min-width: 280px; /* 最小宽度保证内容不挤压 */
}

.region-badge {
  background: #32bfc0;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: bold;
}

.wechat-qrcode {
  width: 240px;
  height: 240px;
  object-fit: contain;
  border: 1px solid #f0f0f0;
  margin: 15px 0;
}

.empty-content {
  text-align: center;
  padding: 20px;
  max-width: 500px;
}

.empty-icon {
  font-size: 60px;
  color: #32bfc0;
  margin-bottom: 20px;
}

.empty-content h3 {
  color: #333;
  margin-bottom: 10px;
}

.empty-content p {
  color: #666;
  margin-bottom: 20px;
}

.retry-btn {
  background: #32bfc0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #2a8a8b;
}

@media (max-width: 768px) {
  .contact-row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .contact-item {
    width: 100%;
    max-width: 260px;
  }
}
</style>