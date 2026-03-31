<template>
  <div class="login-wrapper">
    <MainHeader />
    <div class="page-title-bar">
      <h1 class="page-title">All My Containers</h1>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="container-list">
      <div class="container-table">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>正在查询中，请稍候…</p>
          </div>
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Container Type</th>
              <th>Status</th>
              <th>Pending</th>
              <th>Scheduled</th>
              <th>In Transit</th>
              <th>Delivered</th>
              <th>Completed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="container in containers" :key="container.preport_timenode.container.container_number">
              <td>{{ container.preport_timenode.container.container_number }}</td>
              <td>{{ container.preport_timenode.container.container_type }}</td>
              <td>
                <span class="status-tag" :class="getStatusClass(container)">
                  {{ getStatusText(container) }}
                </span>
              </td>
              <td>
                <template v-if="isEmpty(getWarehouseItems(container, 'unscheduled'))">
                  0
                </template>
                <div v-else class="warehouse-list">
                  <div v-for="item in getDisplayItems(container, 'unscheduled')" :key="item.dest" class="warehouse-item">
                    {{ item.text }}
                  </div>
                  <button v-if="hasMany(container, 'unscheduled')" @click="toggle(container, 'unscheduled')" class="toggle-btn">
                    {{ isExpanded(container, 'unscheduled') ? '收起' : '展开' }}
                  </button>
                </div>
              </td>
              <td>
                <template v-if="isEmpty(getWarehouseItems(container, 'scheduled'))">
                  0
                </template>
                <div v-else class="warehouse-list">
                  <div v-for="item in getDisplayItems(container, 'scheduled')" :key="item.dest" class="warehouse-item">
                    {{ item.text }}
                  </div>
                  <button v-if="hasMany(container, 'scheduled')" @click="toggle(container, 'scheduled')" class="toggle-btn">
                    {{ isExpanded(container, 'scheduled') ? '收起' : '展开' }}
                  </button>
                </div>
              </td>
              <td>
                <template v-if="isEmpty(getWarehouseItems(container, 'shipped'))">
                  0
                </template>
                <div v-else class="warehouse-list">
                  <div v-for="item in getDisplayItems(container, 'shipped')" :key="item.dest" class="warehouse-item">
                    {{ item.text }}
                  </div>
                  <button v-if="hasMany(container, 'shipped')" @click="toggle(container, 'shipped')" class="toggle-btn">
                    {{ isExpanded(container, 'shipped') ? '收起' : '展开' }}
                  </button>
                </div>
              </td>
              <td>
                <template v-if="isEmpty(getWarehouseItems(container, 'arrived'))">
                  0
                </template>
                <div v-else class="warehouse-list">
                  <div v-for="item in getDisplayItems(container, 'arrived')" :key="item.dest" class="warehouse-item">
                    {{ item.text }}
                  </div>
                  <button v-if="hasMany(container, 'arrived')" @click="toggle(container, 'arrived')" class="toggle-btn">
                    {{ isExpanded(container, 'arrived') ? '收起' : '展开' }}
                  </button>
                </div>
              </td>
              <td>
                <template v-if="isEmpty(getWarehouseItems(container, 'pod_uploaded'))">
                  0
                </template>
                <div v-else class="warehouse-list">
                  <div v-for="item in getDisplayItems(container, 'pod_uploaded')" :key="item.dest" class="warehouse-item">
                    {{ item.text }}
                  </div>
                  <button v-if="hasMany(container, 'pod_uploaded')" @click="toggle(container, 'pod_uploaded')" class="toggle-btn">
                    {{ isExpanded(container, 'pod_uploaded') ? '收起' : '展开' }}
                  </button>
                </div>
              </td>
              <td>
                <button @click="viewDetails(container)" class="view-btn">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!loading && containers.length === 0" class="empty-state">
        <h3>No containers found</h3>
        <p>You don't have any containers yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'

export default {
  components: {
    MainHeader
  },
  data() {
    return {
      containers: [],
      loading: true,
      error: null,
      expandedMap: {}
    }
  },
  mounted() {
    this.fetchAllContainers()
  },
  methods: {
    async fetchAllContainers() {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/user_containers', {
          headers: { Authorization: `Bearer ${token}` }
        })
        let data
        try {
          data = await res.json()
        } catch (e) {
          data = null
        }
        if (!res.ok) {
          const errorMsg = data 
            ? (data.detail || JSON.stringify(data)) 
            : `HTTP error! status: ${res.status}`
          this.error = `Failed to fetch containers: ${errorMsg}`
          console.error('Backend error:', errorMsg, 'Status:', res.status)
          return
        }
        this.containers = data
      } catch (e) {
        console.error("Network error:", e)
        this.error = `Failed to fetch containers: ${e.message || String(e)}`
      } finally {
        this.loading = false
      }
    },
    viewDetails(container) {
      const data = encodeURIComponent(JSON.stringify(container))
      this.$router.push({
        path: '/search',
        query: { data }
      })
    },
    getStatusClass(container) {
      const status = this.getStatusText(container)
      switch (status) {
        case '全部派送完成':
          return 'status-completed'
        case '部分派送中':
          return 'status-in-progress'
        case '待派送':
          return 'status-pending'
        default:
          return 'status-updating'
      }
    },
    getStatusText(container) {
      if (!container.postport_timenode || !container.postport_timenode.shipment) {
        return '状态更新中'
      }
      
      const shipments = container.postport_timenode.shipment
      const totalCount = shipments.length
      const arrivedCount = shipments.filter(item => item.is_arrived || item.pod_link).length
      
      if (arrivedCount === totalCount && totalCount > 0) {
        return '全部派送完成'
      } else if (arrivedCount > 0) {
        return `部分派送中 (${arrivedCount}/${totalCount})`
      } else if (totalCount > 0) {
        return '待派送'
      } else {
        return '状态更新中'
      }
    },
    getKey(container, status) {
      return container.preport_timenode.container.container_number + '_' + status
    },
    getWarehouseItems(container, status) {
      if (!container.postport_timenode || !container.postport_timenode.shipment) {
        return []
      }
      
      const shipments = container.postport_timenode.shipment
      let filtered = []
      
      switch (status) {
        case 'unscheduled':
          filtered = shipments.filter(item => !item.master_shipment_batch_number)
          break
        case 'scheduled':
          filtered = shipments.filter(item => item.master_shipment_batch_number && !item.is_shipped && !item.is_arrived && !item.pod_link)
          break
        case 'shipped':
          filtered = shipments.filter(item => item.is_shipped && !item.is_arrived && !item.pod_link)
          break
        case 'arrived':
          filtered = shipments.filter(item => item.is_arrived && !item.pod_link)
          break
        case 'pod_uploaded':
          filtered = shipments.filter(item => item.pod_link)
          break
        default:
          return []
      }
      
      const counts = {}
      filtered.forEach(item => {
        const dest = item.destination || 'Unknown'
        counts[dest] = (counts[dest] || 0) + 1
      })
      
      return Object.entries(counts).map(([dest, count]) => ({
        dest,
        count,
        text: count === 1 ? dest : `${dest}-${count}`
      }))
    },
    isEmpty(items) {
      return items.length === 0
    },
    hasMany(container, status) {
      const items = this.getWarehouseItems(container, status)
      return items.length > 5
    },
    isExpanded(container, status) {
      const key = this.getKey(container, status)
      return !!this.expandedMap[key]
    },
    toggle(container, status) {
      const key = this.getKey(container, status)
      console.log('toggle clicked', key, 'current value:', this.expandedMap[key])
      this.expandedMap = {
        ...this.expandedMap,
        [key]: !this.expandedMap[key]
      }
      console.log('new value:', this.expandedMap[key], 'expandedMap:', this.expandedMap)
    },
    getDisplayItems(container, status) {
      const items = this.getWarehouseItems(container, status)
      const expanded = this.isExpanded(container, status)
      const key = this.getKey(container, status)
      console.log('getDisplayItems', key, 'expanded:', expanded, 'items:', items.length)
      if (items.length <= 5 || expanded) {
        return items
      }
      return items.slice(0, 3)
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
  min-height: 100vh;
  background: #f5f5f5;
}

.page-title-bar {
  background: linear-gradient(135deg, #32bfc0, #2a8a8b);
  padding: 16px 24px;
  margin: 20px 0 0 0;
  border-bottom: 2px solid #FFFFFF;
}

.page-title {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 26px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
}

.container-list {
  padding: 30px;
  margin-top: 0;
}

.container-table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #32bfc0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
  font-size: 14px;
  line-height: 1.6;
}

th {
  background-color: #F9FAFB;
  font-weight: 700;
  color: #374151;
}

tr:hover {
  background-color: #F3F4F6;
}

.status-tag {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
}

.status-completed {
  background-color: #4CAF50;
  color: white;
}

.status-in-progress {
  background-color: #3B82F6;
  color: white;
}

.status-pending {
  background-color: #6B7280;
  color: white;
}

.status-updating {
  background-color: #93C5FD;
  color: white;
}

.warehouse-list {
  font-size: 12px;
  text-align: left;
}

.warehouse-item {
  margin-bottom: 4px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #32bfc0;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 0;
  font-weight: 500;
}

.toggle-btn:hover {
  text-decoration: underline;
}

.view-btn {
  background-color: #0D9488;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.view-btn:hover {
  background-color: #0F766E;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  margin: 20px;
  border-radius: 4px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}

.empty-state h3 {
  margin-bottom: 10px;
  color: #333;
}

@media (max-width: 768px) {
  .container-list {
    padding: 10px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  table {
    font-size: 14px;
  }
  
  th, td {
    padding: 8px 10px;
  }
  
  .view-btn {
    padding: 4px 8px;
    font-size: 10px;
  }
}
</style>
