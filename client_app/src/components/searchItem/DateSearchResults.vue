<template>
  <div class="date-search-results">
    <div class="summary-info">
      <h3>日期范围: {{ formattedDateRange }}</h3>
      <p class="result-count">共找到 {{ containers.length }} 个柜号</p>
    </div>
    
    <div class="container-table-container">
      <div class="container-table">
        <table>
          <thead>
            <tr>
              <th class="basic-info-header">基础信息</th>
              <th class="history-header">运输轨迹</th>
              <th class="status-header">货物状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(container, index) in containers" :key="container.basic_info?.container_number || index">
              <!-- 基础信息列 -->
              <td class="basic-info-cell">
                <div class="info-card">
                  <div class="info-item">
                    <span class="info-label">柜号：</span>
                    <span class="info-value highlight">{{ container.basic_info.container_number }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">ETA：</span>
                    <span class="info-value">{{ formatDate(container.basic_info.vessel_eta) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">起运港：</span>
                    <span class="info-value">{{ container.basic_info.origin_port || '--' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">目的港：</span>
                    <span class="info-value">{{ container.basic_info.destination_port }}</span>
                  </div>
                </div>
              </td>
              
              <!-- 运输轨迹列 -->
              <td class="history-cell">
                <div class="timeline">
                  <div v-for="(event, i) in container.basic_info.history" :key="i" class="timeline-item">
                    <div class="timeline-badge"></div>
                    <div class="timeline-content">
                      <div class="event-time">{{ formatDateTime(event.date) }}</div>
                      <div class="event-desc">{{ event.description }}</div>
                    </div>
                  </div>
                  <div v-if="container.basic_info.history.length === 0" class="empty-tip">
                    <i class="el-icon-info"></i> 暂无轨迹信息
                  </div>
                </div>
              </td>
              
              <!-- 货物状态列 -->
              <td class="status-cell">
                <div class="status-container">
                  <div v-for="(status, statusKey) in statusTextMap" :key="statusKey" class="status-section">
                    <div v-if="container.shipment_status[statusKey].length > 0" class="status-header">
                      <span class="status-indicator" :class="statusKey"></span>
                      <span class="status-title">{{ status }}</span>
                      <span class="status-count">({{ getStatusCount(container, statusKey) }}件)</span>
                    </div>
                    <div class="shipment-groups">
                      <div v-for="(group, j) in container.shipment_status[statusKey]" :key="j" class="shipment-card">
                        <div class="shipment-destination">{{ group.destination }}</div>
                        <div class="shipment-detail">
                          <span class="detail-label">PO：</span>
                          <span>{{ group.PO_IDs.join(', ') }}</span>
                        </div>
                        <div class="shipment-detail">
                          <span class="detail-label">托盘：</span>
                          <span class="pallet-count">{{ group.pallet_count }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="hasNoShipment(container)" class="empty-tip">
                    <i class="el-icon-box"></i> 暂无货物信息
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateSearchResults',
  props: {
    containers: {
      type: Array,
      required: true
    },
    dateRange: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      statusTextMap: {
        'unscheduled': '未预约',
        'scheduled': '已预约',
        'shipped': '已出库',
        'arrived': '已送达',
        'with_pod': '已签收'
      }
    }
  },
  computed: {
    formattedDateRange() {
      return `${this.dateRange.startDate} 至 ${this.dateRange.endDate}`
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '--'
      return new Date(dateStr).toLocaleDateString('zh-CN')
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '--'
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    },
    getStatusCount(container, statusKey) {
      return container.shipment_status[statusKey].reduce((sum, g) => sum + g.pallet_count, 0)
    },
    hasNoShipment(container) {
      return Object.values(container.shipment_status).every(
        statusArray => statusArray.length === 0
      )
    },
    viewContainerDetails(container) {
      this.$emit('view-details', container)
    }
  }
}
</script>

<style scoped>
.date-search-results {
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.summary-info {
  background: #f5f7fa;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #32bfc0;
}

.summary-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.result-count {
  margin: 0;
  color: #666;
  font-size: 15px;
}

.container-table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.container-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th {
  background: #32bfc0;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 16px;
  text-align: left;
  position: sticky;
  top: 0;
}

.basic-info-header {
  width: 220px;
  min-width: 220px;
}

.history-header {
  width: 320px;
  min-width: 320px;
}

.status-header {
  min-width: 400px;
}

tr {
  border-bottom: 1px solid #ebeef5;
}

tr:hover {
  background-color: #f5f7fa;
}

td {
  padding: 16px;
  vertical-align: top;
}

/* 基础信息列样式 */
.basic-info-cell {
  background: #f9fafc;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 60px;
}

.info-value {
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.highlight {
  color: #32bfc0;
  font-weight: 600;
}

/* 运输轨迹列样式 */
.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline-item {
  position: relative;
  padding-bottom: 16px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-badge {
  position: absolute;
  left: -20px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #32bfc0;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #32bfc0;
}

.timeline-content {
  padding-left: 8px;
}

.event-time {
  color: #909399;
  font-size: 13px;
  margin-bottom: 4px;
}

.event-desc {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

/* 货物状态列样式 */
.status-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-section {
  background: #f9fafc;
  border-radius: 6px;
  padding: 12px;
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background: transparent !important;
  padding: 0 !important;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-title {
  color: #333;
  font-size: 15px;
  font-weight: 500;
  margin-right: 6px;
}

.status-count {
  color: #909399;
  font-size: 13px;
}

.shipment-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.shipment-card {
  background: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.shipment-destination {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.shipment-detail {
  color: #666;
  font-size: 13px;
  display: flex;
  margin-bottom: 4px;
}

.detail-label {
  color: #909399;
  margin-right: 4px;
}

.pallet-count {
  color: #32bfc0;
  font-weight: 500;
}

/* 状态指示器颜色 */
.status-indicator.unscheduled { background: #FFC107; }
.status-indicator.scheduled { background: #2196F3; }
.status-indicator.shipped { background: #9C27B0; }
.status-indicator.arrived { background: #4CAF50; }
.status-indicator.with_pod { background: #607D8B; }

/* 空状态提示 */
.empty-tip {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-tip i {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .container-table {
    display: block;
  }
  
  thead {
    display: none;
  }
  
  tr {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
  }
  
  td {
    display: block;
    width: 100% !important;
    padding: 16px;
  }
  
  .basic-info-cell {
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }
  
  .shipment-groups {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .shipment-groups {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-wrap: wrap;
  }
  
  .info-label {
    min-width: 100%;
    margin-bottom: 4px;
  }
}
</style>