<template>
  <div class="search-banner" style="background-color: #32bfc0; padding: 30px 0;">
    <div class="container">
        <div class="search-box">
          <h1 style="color: white; margin-bottom: 20px;"><b>Track Your Container</b></h1>

          <!-- 搜索模式切换 -->
          <div class="search-mode-tabs">
            <button 
              @click="searchMode = 'container'"
              :class="{ 'active-tab': searchMode === 'container' }"
            >
              <i class="fas fa-box"></i> By Container
            </button>
            <button
              @click="searchMode = 'date'"
              :class="{ 'active-tab': searchMode === 'date' }"
            >
              <i class="fas fa-calendar-alt"></i> By Date
            </button>
          </div>


          <!--柜号搜索方式-->
          <div v-if="searchMode === 'container'" class="search-container">
            <input
              v-model="containerNumber"
              type="text"
              placeholder="Enter container number..."
              class="search-input"
            >
            <button @click="trackOrder" class="search-btn">
              <i class="fa fa-search"></i> Track
            </button>
          </div>

          <!-- 日期范围搜索 -->
          <div v-if="searchMode === 'date'" class="date-search-container">
            <div class="date-picker-group">
              <label>From:</label>
              <input 
                type="date" 
                v-model="startDate"
                class="date-input"
                :max="endDate || ''"
              >
            </div>
            <div class="date-picker-group">
              <label>To:</label>
              <input 
                type="date" 
                v-model="endDate"
                class="date-input"
                :min="startDate || ''"
              >
            </div>
            <button 
              @click="searchByDate" 
              class="search-btn"
              :disabled="!dateRangeValid"
            >
              <i class="fa fa-search"></i> Search
            </button>
          </div>

          <button 
            @click="searchAllContainers" 
            class="search-all-btn"
            style="margin-top: 15px;"
          >
            <i class="fa fa-list"></i> View All My Containers
          </button>
          
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHeader',
  data() {
    return {
      searchMode: 'container',
      containerNumber: '',
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    dateRangeValid() {
      return this.startDate && this.endDate && this.startDate <= this.endDate
    }
  },
  methods: {
    async trackOrder() {
      const token = localStorage.getItem('token').trim();
      const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/order_tracking', {
          method: 'POST',
          headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ container_number: this.containerNumber }) 
      });
      
      if (res.ok){
        const responseData = await res.text();
        this.$router.push({
          path: '/search',
          query: { 
            data: encodeURIComponent(responseData) 
          }
        });
      } else {
        console.error("请求失败:", res.status);
      }
    },
    async searchByDate() {
      if (!this.dateRangeValid) return;
      
      const token = localStorage.getItem('token').trim();
      try {
        const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/orders_by_date', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            start_date: this.startDate,
            end_date: this.endDate 
          }) 
        });

        if (res.ok) {
          const responseData = await res.json();
          this.$router.push({
            path: '/search',
            query: { 
              data: encodeURIComponent(JSON.stringify(responseData)) 
            }
          });
        } else {
          console.error("Date search failed:", await res.text());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
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

.search-mode-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}

.search-mode-tabs button {
  padding: 10px 25px;
  margin: 0 5px;
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-mode-tabs button:hover {
  background: rgba(255,255,255,0.1);
}

.search-mode-tabs button.active-tab {
  background: rgba(255,255,255,0.2);
  color: white;
  font-weight: bold;
  border-bottom: 3px solid white;
}

.search-container,
.date-search-container {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.date-picker-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.date-picker-group label {
  color: white;
  min-width: 80px;
  font-weight: 500;
}

.date-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
}

.search-mode {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-mode button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.search-mode button.active {
  background: white;
  color: #32bfc0;
}

.search-mode button:hover {
  background: rgba(255,255,255,0.3);
}

.search-banner {
  background: linear-gradient(135deg, #32bfc0, #2a8a8b);
  color: white;
}

.date-search {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.date-picker-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker-group label {
  color: white;
  font-weight: 500;
}

.date-input {
  padding: 10px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  min-width: 160px;
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
  margin-bottom: 15px;
}

.search-input {
  padding: 12px 15px;
  border: none;
  border-radius: 4px;
  width: 300px;
  font-size: 16px;
}

.search-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background: #333;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #555;
}

.search-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.search-all-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background: white;
  color: #32bfc0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
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

@media (max-width: 768px) {
  .date-search {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-picker-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-controls {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>