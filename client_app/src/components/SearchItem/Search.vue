<template>
  <div class="login-wrapper">
    <MainHeader />
    
    <div class="search-banner" style="background-color: #32bfc0; padding: 30px 0;">
      <div class="container">
        <div class="search-box">
          <h2 style="color: white; margin-bottom: 20px; margin-top: 30px;">Track Your Container</h2>
          <div class="search-controls">
            <input 
              v-model="containerNumber" 
              type="text" 
              placeholder="Enter container number..."
              class="search-input"
            >
            <button @click="searchContainer" class="search-btn">
              <i class="fa fa-search"></i> Track
            </button>
            <button @click="searchAllContainers" class="search-all-btn">
              <i class="fa fa-list"></i> View All My Containers
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="singleResult" class="container-result">
      <div class="container-card">
        <div class="container-header">
          <h3>{{ singleResult.containerNumber }}</h3>
          <span :class="`status-${singleResult.status}`">{{ singleResult.status }}</span>
        </div>
        
        <div class="timeline">
          <div 
            v-for="(event, index) in singleResult.timeline" 
            :key="index" 
            class="timeline-event"
            :class="{ 'active': event.completed }"
          >
            <div class="event-dot"></div>
            <div class="event-content">
              <h4>{{ event.eventName }}</h4>
              <p>{{ formatDate(event.time) }}</p>
              <div class="staff-info">
                <img :src="event.staff.avatar" class="staff-avatar">
                <div>
                  <p>{{ event.staff.name }}</p>
                  <p class="staff-role">{{ event.staff.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多柜查询结果 -->
    <div v-if="multipleResults" class="multi-container-results">
      <h3>Your Containers ({{ multipleResults.length }})</h3>
      <div class="container-grid">
        <div 
          v-for="(container, index) in multipleResults" 
          :key="index"
          class="container-item"
          @click="expandContainer(container.containerNumber)"
        >
          <div class="item-header">
            <h4>{{ container.containerNumber }}</h4>
            <span :class="`status-${container.status}`">{{ container.status }}</span>
          </div>
          <p>Last Update: {{ formatDate(container.lastUpdate) }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="showEmptyState" class="empty-state">
      <img src="@/assets/images/search/empty-container.png" alt="No containers">
      <h3>No container data found</h3>
      <p>Please enter a valid container number</p>
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
      containerNumber: '',
      singleResult: null,
      multipleResults: null,
      showEmptyState: false
    }
  },
  methods: {
    async searchContainer() {
      try {
        const response = await fetch('http://localhost:8000/login', {  //向后端发送用户名和密码的POST请求
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        })
        this.singleResult = {
          containerNumber: this.containerNumber || 'MSKU1234567',
          status: 'In Transit',
          timeline: [
            {
              eventName: 'Container Built',
              time: '2023-05-10T08:00:00',
              completed: true,
              staff: {
                name: 'Michael Wang',
                role: 'Logistics Coordinator',
                avatar: require('@/assets/images/staff-avatar1.jpg')
              }
            },
            {
              eventName: 'Departed Origin',
              time: '2023-05-15T14:30:00',
              completed: true,
              staff: {
                name: 'Sarah Johnson',
                role: 'Port Operator',
                avatar: require('@/assets/images/staff-avatar2.jpg')
              }
            },
            {
              eventName: 'Arrived at Destination',
              time: '2023-06-02T09:15:00',
              completed: false,
              staff: {
                name: 'David Chen',
                role: 'Customs Agent',
                avatar: require('@/assets/images/staff-avatar3.jpg')
              }
            },
            {
              eventName: 'Container Returned',
              time: null,
              completed: false,
              staff: {
                name: 'TBD',
                role: 'Yard Manager',
                avatar: require('@/assets/images/staff-default.jpg')
              }
            }
          ]
        }
        this.multipleResults = null
        this.showEmptyState = false
      } catch (error) {
        console.error(error)
        this.showEmptyState = true
      }
    },
    async searchAllContainers() {
      // 模拟API调用
      this.multipleResults = [
        {
          containerNumber: 'MSKU1234567',
          status: 'In Transit',
          lastUpdate: '2023-05-28T16:45:00'
        },
        {
          containerNumber: 'TGHU7890123',
          status: 'Delivered',
          lastUpdate: '2023-04-15T11:20:00'
        },
        {
          containerNumber: 'CAIU4567890',
          status: 'At Port',
          lastUpdate: '2023-06-01T09:30:00'
        }
      ]
      this.singleResult = null
      this.showEmptyState = false
    },
    formatDate(dateString) {
      if (!dateString) return 'Pending'
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    expandContainer(containerNumber) {
      this.containerNumber = containerNumber
      this.searchContainer()
    }
  }
}
</script>

<style scoped>
.login-wrapper, .login-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  width: 99.5vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -49.75vw;
  margin-right: -49.75vw;
  overflow-x: hidden;
}

.search-banner {
  background: linear-gradient(135deg, #32bfc0, #2a8a8b);
  color: white;
}

.search-box {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.search-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.search-input {
  padding: 12px 15px;
  border: none;
  border-radius: 4px;
  width: 300px;
  font-size: 16px;
}

.search-btn, .search-all-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.search-btn {
  background: #333;
  color: white;
}

.search-all-btn {
  background: white;
  color: #32bfc0;
}

.search-btn:hover {
  background: #555;
}

.search-all-btn:hover {
  background: #f0f0f0;
}

/* 时间轴样式 */
.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #32bfc0;
}

.timeline-event {
  position: relative;
  margin-bottom: 30px;
  padding-left: 80px;
}

.event-dot {
  position: absolute;
  left: 42px;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #32bfc0;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #32bfc0;
}

.timeline-event.active .event-dot {
  background: #4CAF50;
  box-shadow: 0 0 0 2px #4CAF50;
}

.event-content {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.staff-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.staff-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.staff-role {
  font-size: 12px;
  color: #666;
}

/* 状态标签 */
.status-Delivered {
  background: #4CAF50;
}
.status-In-Transit {
  background: #FFC107;
}
status-At-Port {
  background: #2196F3;
}
.status-Pending {
  background: #9E9E9E;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>