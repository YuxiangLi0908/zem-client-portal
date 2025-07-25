<template>
   <div class="date-search-results">
    <div v-if="loading" class="loading">
      <i class="el-icon-loading"></i> 数据加载中...
    </div>
    <div v-else>
      <div class="date-range" v-if="dateRange">
        <i class="el-icon-date"></i> 查询日期范围：{{ dateRange.startDate }} 至 {{ dateRange.endDate }}
      </div>
      <table class="results-table">
        <thead>
          <tr>
            <th>基本信息</th>
            <th class="history-header">历史记录</th>
            <th>待预约</th>
            <th>已预约</th>
            <th>已发货</th>
            <th>已送达</th>
            <th>已完成</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(container, index) in containers" :key="index">
            <!-- 基本信息单元格 -->
            <td class="basic-info-cell">
              <div class="info-card">
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-box"></i> 柜号：</span>
                  <span class="info-value highlight">
                    {{ container.preport?.container?.container_number || '--' }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-time"></i> 预计到港：</span>
                  <span class="info-value">
                    {{ formatDate(container.preport?.vessel?.vessel_eta) }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-ship"></i> 起运港：</span>
                  <span class="info-value">
                    {{ container.preport?.vessel?.origin_port || '--' }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-location-outline"></i> 目的港：</span>
                  <span class="info-value">
                    {{ container.preport?.vessel?.destination_port || '--' }}
                  </span>
                </div>
              </div>
            </td>

            <!-- 历史记录单元格 - 新位置 -->
            <td class="history-cell">
              <div class="history-container">
                <div class="history-timeline">
                  <div v-for="(item, idx) in container.preport?.history || []" 
                       :key="idx" class="history-item">
                    <div class="history-time">{{ formatDateTime(item.timestamp) }}</div>
                    <div class="history-dot"></div>
                    <div class="history-content">{{ item.description }}</div>
                  </div>
                </div>
                <div v-if="!container.preport?.history?.length" class="no-history">
                  <i class="el-icon-info"></i> 暂无历史记录
                </div>
              </div>
            </td>

            <!-- 待预约单元格 -->
            <td class="status-cell unscheduled-cell">
              <div v-if="hasStatus(container.postport?.shipment, 'unscheduled')" class="status-container">
                <div class="status-header">
                  <i class="el-icon-warning-outline"></i>
                  <span>待预约</span>
                </div>
                <div class="destination-list">
                  <div v-for="shipment in filterShipments(container.postport?.shipment, 'unscheduled')" 
                       :key="shipment.PO_ID" class="destination-item">
                    <i class="el-icon-location-information"></i>
                    {{ shipment.destination || '--' }}
                  </div>
                </div>
                <div class="status-count">
                  共 {{ countStatus(container.postport?.shipment, 'unscheduled') }} 条
                </div>
              </div>
              <div v-else class="no-data">
                <i class="el-icon-minus"></i> 无数据
              </div>
            </td>

            <!-- 已预约单元格 -->
            <td class="status-cell scheduled-cell">
              <div v-if="hasStatus(container.postport?.shipment, 'reserved')" class="status-container">
                <div class="status-header">
                  <i class="el-icon-success"></i>
                  <span>已预约</span>
                </div>
                <div class="destination-list">
                  <div v-for="shipment in filterShipments(container.postport?.shipment, 'reserved')" 
                       :key="shipment.PO_ID" class="destination-item">
                    <i class="el-icon-location-information"></i>
                    {{ shipment.destination || '--' }}
                  </div>
                </div>
                <div class="status-count">
                  共 {{ countStatus(container.postport?.shipment, 'reserved') }} 条
                </div>
              </div>
              <div v-else class="no-data">
                <i class="el-icon-minus"></i> 无数据
              </div>
            </td>

            <!-- 已发货单元格 -->
            <td class="status-cell shipped-cell">
              <div v-if="hasStatus(container.postport?.shipment, 'shipped')" class="status-container">
                <div class="status-header">
                  <i class="el-icon-truck"></i>
                  <span>已发货</span>
                </div>
                <div class="destination-list multi-column">
                  <div v-for="shipment in filterShipments(container.postport?.shipment, 'shipped')" 
                      :key="shipment.PO_ID" class="destination-item">
                    <i class="el-icon-location-information"></i>
                    {{ shipment.destination || '--' }}
                  </div>
                </div>
                <div class="status-count">
                  共 {{ countStatus(container.postport?.shipment, 'shipped') }} 条
                </div>
              </div>
              <div v-else class="no-data">
                <i class="el-icon-minus"></i> 无数据
              </div>   
            </td>

            <!-- 已送达单元格 -->
            <td class="status-cell with-pod-cell">
              <div v-if="hasStatus(container.postport?.shipment, 'with_pod')" class="status-container">
                <div class="status-header">
                  <i class="el-icon-finished"></i>
                  <span>已送达</span>
                </div>
                <div class="destination-list">
                  <div v-for="shipment in filterShipments(container.postport?.shipment, 'with_pod')" 
                       :key="shipment.PO_ID" class="destination-item">
                    <i class="el-icon-location-information"></i>
                    {{ shipment.destination || '--' }}
                    <a v-if="shipment.pod_link" :href="shipment.pod_link" 
                       target="_blank" class="pod-link">
                      <i class="el-icon-picture"></i> POD
                    </a>
                  </div>
                </div>
                <div class="status-count">
                  共 {{ countStatus(container.postport?.shipment, 'with_pod') }} 条
                </div>
              </div>
              <div v-else class="no-data">
                <i class="el-icon-minus"></i> 无数据
              </div>
            </td>

            <!-- 已到达单元格 -->   
            <td class="status-cell arrived-cell">
              <div v-if="hasStatus(container.postport?.shipment, 'arrived')" class="status-container">
                <div class="status-header">
                  <i class="el-icon-map-location"></i>
                  <span>已到达</span>
                </div>
                <div class="destination-list multi-column">
                  <div v-for="shipment in filterShipments(container.postport?.shipment, 'arrived')" 
                      :key="shipment.PO_ID" class="destination-item">
                    <i class="el-icon-location-information"></i>
                    {{ shipment.destination || '--' }}
                  </div>
                </div>
                <div class="status-count">
                  共 {{ countStatus(container.postport?.shipment, 'arrived') }} 条
                </div>
              </div>
              <div v-else class="no-data">
                <i class="el-icon-minus"></i> 无数据
              </div>   
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   </div>   
</template>
   
<script>   
export default {
   name: 'DateSearchResults',
   props: {
    containers: {
      type: Array,
      default: () => []
    },
    dateRange: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
   },
   methods: {
    formatDate(date) {
      if (!date) return '--';
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    formatDateTime(date) {
      if (!date) return '--';
      return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    hasStatus(shipments, status) {
      if (!shipments) return false;
      return shipments.some(shipment => {
        if (status === 'unscheduled') return !shipment.is_shipment_reserved;
        if (status === 'reserved') return shipment.is_shipment_reserved && !shipment.shipped_at;
        if (status === 'shipped') return shipment.shipped_at && !shipment.arrived_at;
        if (status === 'arrived') return shipment.arrived_at && !shipment.pod_link;
        if (status === 'with_pod') return shipment.pod_link;
        return false;
      });
    },
    filterShipments(shipments, status) {
      if (!shipments) return [];
      return shipments.filter(shipment => {
        if (status === 'unscheduled') return !shipment.is_shipment_reserved;
        if (status === 'reserved') return shipment.is_shipment_reserved && !shipment.shipped_at;
        if (status === 'shipped') return shipment.shipped_at && !shipment.arrived_at;
        if (status === 'arrived') return shipment.arrived_at && !shipment.pod_link;
        if (status === 'with_pod') return shipment.pod_link;
        return false;
      });
    },
    countStatus(shipments, status) {
      if (!shipments) return 0;
      return this.filterShipments(shipments, status).length;
    }
   }   
};   
</script>
   
<style scoped>   
.date-search-results {
   margin: 20px;
   font-family: 'Helvetica Neue', Arial, sans-serif;   
}
   
.date-range {
   padding: 10px 15px;
   margin-bottom: 15px;
   background-color: #f8f8f8;
   border-radius: 4px;
   color: #606266;
   font-size: 14px;
   border-left: 4px solid #409eff;   
}
   
.results-table {
   width: 100%;
   border-collapse: separate;
   border-spacing: 0;
   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);   
}
   
.results-table th {
   background-color: #f5f7fa;
   color: #303133;
   font-weight: 600;
   padding: 12px 15px;
   text-align: left;
   border-bottom: 1px solid #ebeef5;   
}
   
.results-table td {
   padding: 12px 15px;
   border-bottom: 1px solid #ebeef5;
   vertical-align: top;
   transition: background-color 0.3s;   
}
   
.results-table tr:hover td {
   background-color: #f5f7fa;   
}
   
.basic-info-cell {
   width: 20%;   
}
   
.history-header {
   width: 25%;   
}
   
.status-cell {
   width: 11%;   
}
   
.info-card {
   background: #f9f9f9;
   padding: 12px;
   border-radius: 4px;
   border-left: 3px solid #67c23a;   
}
   
.info-item {
   margin-bottom: 8px;
   display: flex;
   align-items: center;   
}
   
.info-label {
   font-weight: bold;
   color: #909399;
   margin-right: 5px;
   flex-shrink: 0;   
}
   
.info-value {
   color: #606266;   
}
   
.highlight {
   color: #409eff;
   font-weight: bold;   
}
   
.history-container {
   position: relative;
   height: 100%;   
}
   
.history-timeline {
   position: relative;
   padding-left: 20px;   
}
   
.history-timeline::before {
   content: '';
   position: absolute;
   left: 7px;
   top: 0;
   height: 100%;
   width: 2px;
   background: #e4e7ed;   
}
   
.history-item {
   position: relative;
   padding-bottom: 15px;
   display: flex;
   flex-direction: column;   
}
   
.history-time {
   font-size: 12px;
   color: #909399;
   margin-bottom: 4px;   
}
   
.history-dot {
   position: absolute;
   left: -20px;
   top: 5px;
   width: 10px;
   height: 10px;
   border-radius: 50%;
   background-color: #409eff;
   border: 2px solid #fff;
   box-shadow: 0 0 0 1px #409eff;   
}
   
.history-content {
   font-size: 13px;
   color: #606266;
   line-height: 1.5;
   background: #f5f7fa;
   padding: 8px 10px;
   border-radius: 4px;   
}
   
.no-history {
   color: #c0c4cc;
   text-align: center;
   padding: 15px 0;
   font-size: 13px;   
}
   
/* 状态单元格通用样式 */   
.status-container {
   display: flex;
   flex-direction: column;
   height: 100%;   
}
   
.status-header {
   display: flex;
   align-items: center;
   margin-bottom: 8px;
   font-weight: 500;
   color: #303133;   
}
   
.status-header i {
   margin-right: 5px;   
}
   
.destination-list {
   flex-grow: 1;
   max-height: 150px;
   overflow-y: auto;
   margin-bottom: 8px;   
}
   
.destination-item {
   padding: 6px;
   border-bottom: none;
   margin: 0;
   background: rgba(255,255,255,0.7);
   border-radius: 3px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;   
}   
   
.destination-item i {
   margin-right: 5px;
   color: #909399;   
}
   
.status-count {
   font-size: 12px;
   color: #909399;
   text-align: right;
   margin-top: auto;   
}
   
.no-data {
   color: #c0c4cc;
   text-align: center;
   padding: 15px 0;
   font-size: 13px;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;   
}
   
/* 各状态单元格特定样式 */   
.unscheduled-cell {
   background-color: rgba(255, 242, 240, 0.5);
   border-left: 3px solid #f56c6c;   
}
   
.scheduled-cell {
   background-color: rgba(240, 247, 255, 0.5);
   border-left: 3px solid #409eff;   
}

.shipped-cell {
   background-color: rgba(255, 244, 230, 0.5);
   border-left: 3px solid #e6a23c;   
}   

.arrived-cell {
   background-color: rgba(237, 242, 255, 0.5);
   border-left: 3px solid #a0cfff;   
}

.with-pod-cell {
   background-color: rgba(246, 247, 255, 0.5);
   border-left: 3px solid #67c23a;   
}
   
.pod-link {
   margin-left: 8px;
   color: #409eff;
   text-decoration: none;
   font-size: 12px;
   display: flex;
   align-items: center;   
}
   
.pod-link:hover {
   text-decoration: underline;   
}
   
.pod-link i {
   margin-right: 3px;   
}
   
.loading {
   text-align: center;
   padding: 40px;
   color: #909399;
   font-size: 14px;   
}
   
.loading i {
   margin-right: 8px;
   animation: rotating 2s linear infinite;   
}
   
@keyframes rotating {
   from {
    transform: rotate(0deg);
   }
   to {
    transform: rotate(360deg);
   }   
}
   
/* 滚动条样式 */   
.destination-list::-webkit-scrollbar,   
.history-timeline::-webkit-scrollbar {
   width: 6px;   
}
   
.destination-list::-webkit-scrollbar-track,   
.history-timeline::-webkit-scrollbar-track {
   background: #f1f1f1;
   border-radius: 3px;   
}
   
.destination-list::-webkit-scrollbar-thumb,   
.history-timeline::-webkit-scrollbar-thumb {
   background: #c1c1c1;
   border-radius: 3px;   
}
   
.destination-list::-webkit-scrollbar-thumb:hover,   
.history-timeline::-webkit-scrollbar-thumb:hover {
   background: #a8a8a8;   
}  

.@media (max-width: 1600px) {
   .multi-column {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
   }   
}
   
@media (max-width: 1400px) {
  .multi-column {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }    
}    
</style>
