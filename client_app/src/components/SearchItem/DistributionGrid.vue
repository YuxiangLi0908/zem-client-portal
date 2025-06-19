<template>
  <div class="land-phase">
    <div class="land-header">
      <h3>陆运阶段</h3>
      <div class="status-summary">
        <span v-for="(group, key) in groupedShipments" :key="key" 
              :class="['status-badge', key]">
          {{ groupNames[key] }}: {{ group.length }}
        </span>
      </div>
    </div>
    
    <!-- 陆运汇总节点 -->
    <div class="timeline-track land-track">
      <div class="aggregate-node">
        已拆柜 → {{ shipments.length }} 个仓点待派送
      </div>
    </div>

    <div class="distribution-center">
      <div class="dc-header">
        <h4>📦 分拨中心 (共 {{ shipments.length }} 个目的地)</h4>
      </div>

      <div class="status-groups">
        <div v-for="(group, status) in groupedShipments" :key="status" class="status-group">
          <div class="group-header" :class="status">
            <h5>{{ groupNames[status] }} ({{ group.length }})</h5>
            <div class="group-indicator"></div>
          </div>
          
          <div class="parcel-grid">
            <div v-for="(item, i) in group" 
                 :key="i"
                 :class="['parcel-card', status]">
              <div class="parcel-id">{{ item.destination }}</div>
              <div class="parcel-meta">
                <span>{{ item.n_pallet }}托</span>
                <span>{{ item.weight_kg }}kg</span>
                <span>{{ item.cbm }}CBM</span>
              </div>
              
              <div class="delivery-progress">
                <div class="step" v-if="status === 'scheduled'">
                  <div class="step-icon">📅</div>
                  <div class="step-info">
                    <div>预约时间</div>
                    <div>{{ formatTime(item.shipment_appointment) }}</div>
                  </div>
                </div>
                
                <div class="step" v-if="status === 'shipped'">
                  <div class="step-icon">🚚</div>
                  <div class="step-info">
                    <div>出库时间</div>
                    <div>{{ formatTime(item.shipped_at) }}</div>
                  </div>
                </div>
                
                <div class="step" v-if="status === 'arrived'">
                  <div class="step-icon">✅</div>
                  <div class="step-info">
                    <div>送达时间</div>
                    <div>{{ formatTime(item.arrived_at) }}</div>
                  </div>
                </div>
                
                <div class="step" v-if="status === 'pod_uploaded'">
                  <div class="step-icon">📎</div>
                  <div class="step-info">
                    <div>POD文件</div>
                    <a :href="item.pod_link" target="_blank" v-if="item.pod_link">查看POD</a>
                    <span v-else>无链接</span>
                  </div>
                </div>
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
        'unscheduled': '未预约',
        'scheduled': '已预约',
        'shipped': '已出库',
        'arrived': '已送达',
        'pod_uploaded': 'POD已上传'
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
    }
  }
}
</script>

<style scoped>
.land-phase {
  background: linear-gradient(135deg, #f5f9fc, #e6f0f7);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid #32bfc0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.land-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d1e0f0;
}

.status-summary {
  display: flex;
  gap: 10px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.unscheduled {
  background: #ffecb3;
  color: #ff8f00;
}

.status-badge.scheduled {
  background: #bbdefb;
  color: #1976d2;
}

.status-badge.shipped {
  background: #c8e6c9;
  color: #388e3c;
}

.status-badge.arrived {
  background: #d1c4e9;
  color: #512da8;
}

.status-badge.pod_uploaded {
  background: #ffccbc;
  color: #e64a19;
}

.distribution-center {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
  margin-top: 25px;
}

.dc-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.status-groups {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid;
}

.group-header h5 {
  margin: 0;
  font-size: 1.1rem;
}

.group-header.unscheduled {
  border-color: #ff8f00;
  color: #ff8f00;
}

.group-header.scheduled {
  border-color: #1976d2;
  color: #1976d2;
}

.group-header.shipped {
  border-color: #388e3c;
  color: #388e3c;
}

.group-header.arrived {
  border-color: #512da8;
  color: #512da8;
}

.group-header.pod_uploaded {
  border-color: #e64a19;
  color: #e64a19;
}

.group-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.group-header.unscheduled .group-indicator {
  background: #ff8f00;
}

.group-header.scheduled .group-indicator {
  background: #1976d2;
}

.group-header.shipped .group-indicator {
  background: #388e3c;
}

.group-header.arrived .group-indicator {
  background: #512da8;
}

.group-header.pod_uploaded .group-indicator {
  background: #e64a19;
}

.parcel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.parcel-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #6c757d;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.parcel-card.unscheduled {
  border-left-color: #ff8f00;
  background: #fff8e1;
}

.parcel-card.scheduled {
  border-left-color: #1976d2;
  background: #e3f2fd;
}

.parcel-card.shipped {
  border-left-color: #388e3c;
  background: #e8f5e9;
}

.parcel-card.arrived {
  border-left-color: #512da8;
  background: #ede7f6;
}

.parcel-card.pod_uploaded {
  border-left-color: #e64a19;
  background: #fbe9e7;
}

.parcel-id {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  font-size: 1.1rem;
}

.parcel-meta {
  display: flex;
  gap: 10px;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 12px;
}

.delivery-progress {
  background: white;
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.step-icon {
  width: 28px;
  height: 28px;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 1em;
}

.step-info {
  font-size: 0.9rem;
}

.step-info div:first-child {
  font-weight: 500;
  color: #555;
}

.step-info div:last-child {
  font-size: 0.85rem;
  color: #777;
}

/* 陆运汇总节点 */
.aggregate-node {
  background: #f6ffed;
  color: #52c41a;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px dashed #52c41a;
  margin: 0 auto;
  text-align: center;
  font-weight: 500;
  max-width: 300px;
}
</style>