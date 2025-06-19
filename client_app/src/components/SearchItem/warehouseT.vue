<template>
  <div class="land-phase">
    <div class="land-header">
      <h3>🚛 陆运派送阶段</h3>
      <div class="status-summary">
        <template v-for="(group, key) in groupedShipments" :key="key">
          <div :class="['status-badge', key]">
            <span class="badge-count">{{ group.length }}</span>
            {{ groupNames[key] }}
          </div>
        </template>
      </div>
    </div>

    <!-- 分组展示 -->
    <div class="distribution-groups">
      <div v-for="(group, status) in groupedShipments" :key="status" 
           class="delivery-group" :class="status">
        <div class="group-header">
          <h4>
            <span class="status-icon-wrapper">
              <span class="status-icon" v-html="statusIcons[status]"></span>
            </span>
            {{ groupNames[status] }}
            <span class="group-count">{{ group.length }}个目的地</span>
          </h4>
        </div>
        
        <div class="parcel-grid">
          <div v-for="(item, i) in group" :key="i" class="parcel-card">
            <div class="card-header">
              <span class="destination">{{ item.destination }}</span>
              <span class="priority-tag" :class="getPriorityClass(item)">
                {{ getPriorityText(item) }}
              </span>
            </div>
            
            <div class="card-body">
              <div class="parcel-meta">
                <div class="meta-item">
                  <i class="fa fa-pallet"></i>
                  <span>{{ item.n_pallet }}托</span>
                </div>
                <div class="meta-item">
                  <i class="fa fa-weight-hanging"></i>
                  <span>{{ item.weight_kg }}kg</span>
                </div>
                <div class="meta-item">
                  <i class="fa fa-box"></i>
                  <span>{{ item.cbm }}CBM</span>
                </div>
              </div>
              
              <div class="horizontal-timeline">
                <!-- 运输中状态 -->
                <template v-if="status === 'shipped'">
                  <div class="time-item">
                    <div class="time-label">预约</div>
                    <div class="time-value">{{ formatTime(item.shipment_appointment) }}</div>
                  </div>
                  <div class="time-separator">→</div>
                  <div class="time-item highlight">
                    <div class="time-label">发车</div>
                    <div class="time-value">{{ formatTime(item.shipped_at) }}</div>
                  </div>
                </template>
                
                <!-- 已送达状态 -->
                <template v-else-if="status === 'arrived'">
                  <div class="time-item">
                    <div class="time-label">预约</div>
                    <div class="time-value">{{ formatTime(item.shipment_appointment) }}</div>
                  </div>
                  <div class="time-separator">→</div>
                  <div class="time-item">
                    <div class="time-label">发车</div>
                    <div class="time-value">{{ formatTime(item.shipped_at) }}</div>
                  </div>
                  <div class="time-separator">→</div>
                  <div class="time-item highlight">
                    <div class="time-label">送达</div>
                    <div class="time-value">{{ formatTime(item.arrived_at) }}</div>
                  </div>
                </template>
                
                <!-- 已完成状态 -->
                <template v-else-if="status === 'pod_uploaded'">
                    <div class="time-item">
                        <div class="time-label">预约</div>
                        <div class="time-value">{{ formatTime(item.shipment_appointment) }}</div>
                    </div>
                    <div class="time-separator">→</div>
                    <div class="time-item">
                        <div class="time-label">发车</div>
                        <div class="time-value">{{ formatTime(item.shipped_at) }}</div>
                    </div>
                    <div class="time-separator">→</div>
                    <div class="time-item">
                        <div class="time-label">送达</div>
                        <div class="time-value">{{ formatTime(item.arrived_at) }}</div>
                    </div>
                    <div class="step" v-if="status === 'pod_uploaded'">
                        <div class="step-icon">
                            <i class="fas fa-paperclip" style="font-size: 1.8em; margin-left:22px;">📎</i>
                        </div>
                        <div class="step-info">
                            <a :href="item.pod_link" target="_blank" v-if="item.pod_link">查看POD</a>
                            <span v-else>无链接</span>
                        </div>
                    </div>
                </template>
                
                <!-- 已预约状态 -->
                <template v-else-if="status === 'scheduled'">
                  <div class="time-item highlight">
                    <div class="time-label">预约</div>
                    <div class="time-value">{{ formatTime(item.shipment_appointment) }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DistributionGrid',
  props: {
    shipments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      groupNames: {
        'unscheduled': '待预约',
        'scheduled': '已预约',
        'shipped': '运输中',
        'arrived': '已送达',
        'pod_uploaded': '已完成'
      },
      statusIcons: {
        'unscheduled': '📋',
        'scheduled': '📅',
        'shipped': '🚚',
        'arrived': '📌', 
        'pod_uploaded': '📦'
      }
    }
  },
  computed: {
    totalWeight() {
      return this.shipments.reduce((sum, item) => sum + (item.weight_kg || 0), 0).toFixed(2)
    },
    totalVolume() {
      return this.shipments.reduce((sum, item) => sum + (item.cbm || 0), 0).toFixed(2)
    },
    groupedShipments() {
      const groups = {
        'unscheduled': [],
        'scheduled': [],
        'shipped': [],
        'arrived': [],
        'pod_uploaded': []
      }
      
      this.shipments.forEach(item => {
        if (item.pod_link) {
          groups.pod_uploaded.push(item)
        } else if (item.is_arrived) {
          groups.arrived.push(item)
        } else if (item.is_shipped) {
          groups.shipped.push(item)
        } else if (item.shipment_batch_number) {
          groups.scheduled.push(item)
        } else {
          groups.unscheduled.push(item)
        }
      })
      
      return groups
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '--'
      const date = new Date(timestamp)
      return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    },
    getPriorityClass(item) {
      if (!item.shipment_schduled_at) return 'normal'
      if (!item.arrived_at) {
        const scheduled = new Date(item.shipment_schduled_at)
        const now = new Date()
        return now > new Date(scheduled.getTime() + 24*3600*1000) ? 'urgent' : 'normal'
      }
      return 'completed'
    },
    getPriorityText(item) {
      const cls = this.getPriorityClass(item)
      return {
        'normal': '正常',
        'urgent': '紧急',
        'completed': '已完成'
      }[cls]
    }
  }
}
</script>

<style scoped>

:root {
  --zem-blue: #32bfc0;
  --zem-dark: #1a3a5f;
  --zem-green: #4caf50;
  --zem-orange: #ff9800;
  --zem-red: #f44336;
  --zem-purple: #9c27b0;
}

.land-phase {
  background: linear-gradient(135deg, #f5f9fc, #e6f0f7);
  border-radius: 8px;
  padding: 25px;
  margin-top: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 4px solid var(--zem-blue);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.land-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.land-header h3 {
  color: var(--zem-dark);
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-summary {
  display: flex;
  gap: 12px;
}

.status-badge {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.status-badge .badge-count {
  background: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.status-badge.unscheduled {
  background: #fff3e0;
  color: #ff6d00;
}
.status-badge.unscheduled .badge-count {
  color: #ff6d00;
}

.status-badge.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}
.status-badge.scheduled .badge-count {
  color: #1976d2;
}

.status-badge.shipped {
  background: #e8f5e9;
  color: #388e3c;
}
.status-badge.shipped .badge-count {
  color: #388e3c;
}

.status-badge.arrived {
  background: #f3e5f5;
  color: #8e24aa;
}
.status-badge.arrived .badge-count {
  color: #8e24aa;
}

.status-badge.pod_uploaded {
  background: #e8eaf6;
  color: #3949ab;
}
.status-badge.pod_uploaded .badge-count {
  color: #3949ab;
}

.distribution-groups {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.delivery-group {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.group-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.group-header h4 {
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-header i {
  color: var(--zem-blue);
}

.group-count {
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* 包裹网格 */
.parcel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 15px;
  padding: 15px;
}

.parcel-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.3s;
  border-left: 4px solid #ddd;
}

.parcel-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card-header {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.step-icon {
  width: 28px; 
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;  
  color: #666; 
}

.destination {
  font-weight: 600;
  color: var(--zem-dark);
  font-size: 1.05rem;
}

.priority-tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.priority-tag.normal {
  background: #e3f2fd;
  color: #1976d2;
}

.priority-tag.urgent {
  background: #ffebee;
  color: #f44336;
  animation: pulse 1.5s infinite;
}

.priority-tag.completed {
  background: #e8f5e9;
  color: #388e3c;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.card-body {
  padding: 15px;
}

.parcel-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #555;
}

.meta-item i {
  color: var(--zem-blue);
}

.horizontal-timeline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.time-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.time-label {
  font-size: 0.75rem;
  color: #777;
  margin-bottom: 2px;
}

.time-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
}

.time-separator {
  color: #aaa;
  font-size: 0.9rem;
  padding: 0 5px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .land-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .status-summary {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
  }
}

.status-icon-wrapper {
  display: inline-block;
  margin-right: 8px;
}

.status-icon {
  font-size: 1.2em;
  vertical-align: middle;
}

/* 高亮时间项 */
.time-item.highlight .time-value {
  font-weight: 600;
  color: var(--zem-dark);
  position: relative;
}

.time-item.highlight .time-value::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--zem-blue);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .parcel-grid {
    grid-template-columns: 1fr;
  }
  
  .horizontal-timeline {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .time-item {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  
  .time-separator {
    display: none;
  }
  
  .pod-action {
    margin-top: 8px;
  }
}
</style>