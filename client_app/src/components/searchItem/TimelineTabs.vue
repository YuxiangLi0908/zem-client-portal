<template>
  <div class="horizontal-timeline">
    <div class="ocean-header">
      <h3>🚢 海运阶段</h3>
    </div>
    
    <div class="timeline-track ocean-track">
      <div v-for="(event, index) in filteredPreportHistory" 
           :class="['timeline-node', event.status]"
           :key="index">
        <div class="event-content">
          <div class="event-icon">{{ getStatusIcon(event.status) }}</div>
          <div class="timestamp">{{ formatTime(event.timestamp) }}</div>
          <div class="event-desc">{{ event.description }}</div>
        </div>
        <div class="connector" v-if="index < filteredPreportHistory.length-1"></div>
      </div>
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
      const mainEvents = ['ORDER_CREATED', 'ARRIVED_AT_PORT', 'PORT_UNLOADING', 'PORT_PICKUP_SCHEDULED', 'ARRIVE_AT_WAREHOUSE', 'OFFLOAD']
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
        'ARRIVED_AT_PORT': '⛴️',       
        'PORT_UNLOADING': '🏗️',       
        'PORT_PICKUP_SCHEDULED': '📅',
        'IN_TRANSIT': '⛴️',
        'ARRIVE_AT_WAREHOUSE': '🏭',
        'OFFLOAD': '🛠️'
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
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.ocean-header h3 {
  color: #1a3a5f;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
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

.timeline-track {
  display: flex;
  padding: 15px 0;
  position: relative;
}

.land-track {
  border-top: 2px dashed #52c41a;
}

.timeline-node {
  position: relative;
  margin: 0 15px; 
  flex: 1;
  min-width: 160px;
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

.event-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  height: 100%;
}

.event-icon {
  font-size: 1.8rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  background: #f8f8f8;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.event-desc {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.connector {
  position: absolute;
  right: -15px;
  top: 50%;
  width: 15px;
  height: 2px;
  background: #ddd;
  transform: translateY(-50%);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .event-icon {
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
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
        margin: 10px 0;
        width: 100%;
        max-width: 220px;
    }
  
    .connector {
      right: auto;
      bottom: -15px;
      left: 50%;
      top: auto;
      width: 2px;
      height: 15px;
      transform: translateX(-50%);
    }
  
    .ocean-track, .land-track {
        border-top: none;
        border-left: 2px dashed;
    }
}
</style>