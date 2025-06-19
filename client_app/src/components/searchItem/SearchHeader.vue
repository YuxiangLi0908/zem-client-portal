<template>
  <div class="search-banner" style="background-color: #32bfc0; padding: 30px 0;">
    <div class="container">
        <div class="search-box">
          <h1 style="color: white; margin-bottom: 20px;"><b>Track Your Container</b></h1>
          <div class="search-controls">
            <input 
              v-model="containerNumber" 
              type="text" 
              placeholder="Enter container number..."
              class="search-input"
            >
            <button @click="trackOrder" class="search-btn">
              <i class="fa fa-search"></i> Track
            </button>
            <button @click="searchAllContainers" class="search-all-btn">
              <i class="fa fa-list"></i> View All My Containers
            </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHeader',
  data() {
    return {
      containerNumber: '' // 存储用户输入的集装箱号
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