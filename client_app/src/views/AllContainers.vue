<template>
  <div class="login-wrapper">
    <MainHeader />
    <div class="search-banner" style="background: linear-gradient(135deg, #32bfc0, #2a8a8b); padding: 30px 0;">
      <div class="container">
        <h1 style="color: white; margin-bottom: 20px;"><b>All My Containers</b></h1>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="loading" class="loading-message">
      Loading containers...
    </div>

    <div v-else class="container-list">
      <div class="container-table">
        <table>
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
              <td>{{ getWarehouseCount(container, 'unscheduled') }}</td>
              <td>{{ getWarehouseCount(container, 'scheduled') }}</td>
              <td>{{ getWarehouseCount(container, 'shipped') }}</td>
              <td>{{ getWarehouseCount(container, 'arrived') }}</td>
              <td>{{ getWarehouseCount(container, 'pod_uploaded') }}</td>
              <td>
                <button @click="viewDetails(container)" class="view-btn">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="containers.length === 0" class="empty-state">
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
      error: null
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
        const data = await res.json()
        if (!res.ok) {
          this.error = data.detail || 'Failed to fetch containers'
          return
        }
        this.containers = data
      } catch (e) {
        console.error("Network error:", e)
        this.error = 'Failed to fetch containers'
      } finally {
        this.loading = false
      }
    },
    viewDetails(container) {
      // 将容器数据编码并传递给搜索页面
      const data = encodeURIComponent(JSON.stringify(container))
      this.$router.push({
        path: '/search',
        query: { data }
      })
    },
    getStatusClass(container) {
      // 根据容器状态返回对应的CSS类
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
      // 计算容器的整体状态
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
    getWarehouseCount(container, status) {
      // 计算指定状态下的仓点数量
      if (!container.postport_timenode || !container.postport_timenode.shipment) {
        return 0
      }
      
      const shipments = container.postport_timenode.shipment
      switch (status) {
        case 'unscheduled':
          return shipments.filter(item => !item.master_shipment_batch_number).length
        case 'scheduled':
          return shipments.filter(item => item.master_shipment_batch_number && !item.is_shipped && !item.is_arrived && !item.pod_link).length
        case 'shipped':
          return shipments.filter(item => item.is_shipped && !item.is_arrived && !item.pod_link).length
        case 'arrived':
          return shipments.filter(item => item.is_arrived && !item.pod_link).length
        case 'pod_uploaded':
          return shipments.filter(item => item.pod_link).length
        default:
          return 0
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

.container-list {
  padding: 30px;
}

.container-table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tr:hover {
  background-color: #f9f9f9;
}

.status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-completed {
  background-color: #4CAF50;
  color: white;
}

.status-in-progress {
  background-color: #FFC107;
  color: #333;
}

.status-pending {
  background-color: #9E9E9E;
  color: white;
}

.status-updating {
  background-color: #2196F3;
  color: white;
}

.view-btn {
  background-color: #32bfc0;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background-color: #2a8a8b;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  margin: 20px;
  border-radius: 4px;
  text-align: center;
}

.loading-message {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
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