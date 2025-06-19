<template>
  <div class="horizontal-timeline">
    <!-- 海运阶段标题 -->
    <div class="ocean-header">
      <h3>海运阶段</h3>
    </div>
    
    <!-- 海运时间轴 -->
    <div class="timeline-track ocean-track">
      <div v-for="(event, index) in filteredPreportHistory" 
           :class="['timeline-node', event.status]"
           :key="index">
        <div class="event-icon">{{ getStatusIcon(event.status) }}</div>
        <div class="timestamp">{{ formatTime(event.timestamp) }}</div>
        <div class="event-desc">{{ event.description }}</div>
        <div class="connector" v-if="index < filteredPreportHistory.length-1"></div>
      </div>
    </div>
    
    <!-- 拆柜分割线 -->
    <div class="split-section">
      <div class="split-line"></div>
      <div class="split-icon">📦 → ✂️</div>
    </div>
    
  </div>
</template>


<script>
export default {
  name: 'TimelineTabs',
  props: {
    preport: {
      type: Object,
      required: true
    },
    postport: {
      type: Object,
      required: true
    }
  },
  computed: {
    filteredPreportHistory() {
      const mainEvents = ['ORDER_CREATED', 'IN_TRANSIT', 'ARRIVE_AT_WAREHOUSE', 'OFFLOAD']
      return (this.preport.history || []).filter(event => 
        mainEvents.includes(event.status)
      )
    },
    shipments() {
      return this.postport.shipment || []
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusIcon(status) {
      const icons = {
        'ORDER_CREATED': '📝',
        'IN_TRANSIT': '🚢',
        'ARRIVE_AT_WAREHOUSE': '🏭',
        'OFFLOAD': '✂️'
      }
      return icons[status] || '●'
    }
  }
}
</script>

<style scoped>
.horizontal-timeline {
  background: linear-gradient(135deg, #e6f0f7, #f5f9fc);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-right: 4px solid #32bfc0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ocean-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d1e0f0;
}

.ocean-header h3 {
  color:rgb(1, 11, 19);
  margin: 0;
  font-size: 1.2rem;
}

.ocean-phase {
  background-color: #e6f7ff;
  color: #1890ff;
  border-left: 3px solid #1890ff;
}

.land-phase {
  background-color: #f6ffed;
  color: #52c41a;
  border-left: 3px solid #52c41a;
}

/* 时间轴轨道 */
.timeline-track {
  display: flex;
  padding: 15px 0;
  position: relative;
}

.ocean-track {
  border-top: 2px dashed #1890ff;
}

.land-track {
  border-top: 2px dashed #52c41a;
}

/* 时间节点 */
.timeline-node {
  position: relative;
  padding: 10px 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  margin: 0 20px;
  min-width: 160px;
  text-align: center;
  border-top: 3px solid transparent;
}

.timeline-node.ORDER_CREATED {
  border-top-color: #722ed1;
}
.timeline-node.IN_TRANSIT {
  border-top-color: #1890ff;
}
.timeline-node.ARRIVE_AT_WAREHOUSE {
  border-top-color: #13c2c2;
}
.timeline-node.OFFLOAD {
  border-top-color: #fa8c16;
}

.event-icon {
  font-size: 1.8rem; /* 从1.2rem增大到1.8rem */
  margin-bottom: 12px; /* 增加下边距 */
  width: 50px; /* 固定宽度 */
  height: 50px; /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px; /* 居中并增加下边距 */
  background: #f8f8f8; /* 添加浅色背景 */
  border-radius: 50%; /* 圆形背景 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 轻微阴影 */
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.event-desc {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 连接线 */
.connector {
  position: absolute;
  right: -20px;
  top: 50%;
  width: 20px;
  height: 2px;
  background: #ddd;
}

/* 拆柜分割区域 */
.split-section {
  position: relative;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.split-line {
  position: absolute;
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  top: 50%;
}

.split-icon {
  background: white;
  font-size: 1.5rem;
  padding: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #722ed1;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .event-icon {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
    }
    .event-icon:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    .timeline-track {
        flex-direction: column;
        align-items: center;
    }
  
    .timeline-node {
        padding: 15px; /* 增加内边距 */
        min-width: 180px;
    }
  
    .connector {
        right: auto;
        bottom: -20px;
        left: 50%;
        top: 25%;
        width: 2px;
        height: 20px;
        transform: translateX(-50%);
    }
  
    .ocean-track, .land-track {
        border-top: none;
        border-left: 2px dashed;
    }
}
</style>