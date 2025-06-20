<template>
  <div class="shipping-card">
    <div class="shipping-header">
      <h3>
        <span class="header-icon">📋</span>
        柜号 {{ container.container_number }}
        <span class="status-tag" :class="statusClass">
          <i :class="statusIcon"></i> {{ getStatusText }}
        </span>
      </h3>
    </div>

    <div class="info-section basic-info">
      <h4 class="section-title">基本信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">订单类型</span>
          <span class="value">{{ order_type }}</span>
        </div>
        <div class="info-item">
          <span class="label">柜型</span>
          <span class="value">{{ container.container_type }}</span>
        </div>
      </div>
    </div>

    <div class="info-section vessel-info">
      <h4 class="section-title">船舶信息</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">船公司</span>
          <span class="value">{{ vessel.shipping_line }}</span>
        </div>
        <div class="info-item">
          <span class="label">航次</span>
          <span class="value">{{ vessel.voyage }}</span>
        </div>
        <div class="info-item">
          <span class="label">ETD</span>
          <span class="value">{{ vessel.vessel_etd }}</span>
        </div>
        <div class="info-item">
            <span class="label">ETA</span>
            <span class="value" :class="getEtaStatusClass">
                {{ vessel.vessel_eta }}
                <span v-if="etaStatusText" class="eta-tag">{{ etaStatusText }}</span>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightSummary',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    container() {
      return this.data.container || {}
    },
    vessel() {
      return this.data.vessel || {}
    },
    retrieval() {
      return this.data.retrieval || {}
    },
    order_type() {
      return this.data.order_type || {}
    },
    getStatusText() {
      return this.data.getStatusText || '状态未知';
    },
    etaStatus() {
      if (!this.vessel.vessel_eta) return null;
      
      const etaDate = new Date(this.vessel.vessel_eta);
      const now = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);
      
      if (etaDate < now) {
        return 'arrived'; // 已到港
      } else if (etaDate <= threeDaysLater) {
        return 'coming'; // 三天内到港
      }
      return null; // 三天外不显示
    },
    etaStatusText() {
      switch(this.etaStatus) {
        case 'arrived': return '已到港';
        case 'coming': return '即将到港';
        default: return '';
      }
    },
    getEtaStatusClass() {
      return this.etaStatus ? `eta-${this.etaStatus}` : '';
    },
    
    statusClass() {
      const text = this.getStatusText.toLowerCase();
      return {
        'status-created': text.includes('创建订单'),
        'status-arrived': text.includes('到港') || text.includes('到达港口'),
        'status-retrieved': text.includes('提柜'),
        'status-offloaded': text.includes('拆柜'),
        'status-delivered': text.includes('派送完成')
      };
    },
    statusIcon() {
      const text = this.getStatusText.toLowerCase();
      if (text.includes('创建订单')) return 'fas fa-file-alt';
      if (text.includes('到港')) return 'fas fa-ship';
      if (text.includes('提柜')) return 'fas fa-truck-loading';
      if (text.includes('拆柜')) return 'fas fa-box-open';
      if (text.includes('派送')) return 'fas fa-check-circle';
      return 'fas fa-info-circle';
    }
  },
  methods: {
    calculateDelay(retrieval) {
      if (!retrieval.target_retrieval_timestamp || !retrieval.actual_retrieval_timestamp) return 0
      const target = new Date(retrieval.target_retrieval_timestamp)
      const actual = new Date(retrieval.actual_retrieval_timestamp)
      return Math.round((actual - target) / (1000 * 60 * 60))
    }
  }
}
</script>

<style scoped>
.shipping-card {
  background: linear-gradient(135deg, #f5f9fc, #e6f0f7);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid #32bfc0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.shipping-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.shipping-header h3 {
  color: #1a3a5f;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 1.4em;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
  gap: 6px;
}

.status-created {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.status-arrived {
  background-color: #e8f5e9;
  color: #388e3c;
  border: 1px solid #c8e6c9;
}

.status-retrieved {
  background-color: #fff3e0;
  color: #ff6d00;
  border: 1px solid #ffe0b2;
}

.status-offloaded {
  background-color: #f3e5f5;
  color: #8e24aa;
  border: 1px solid #e1bee7;
}

.status-delivered {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-tag i {
  font-size: 12px;
}

.status-tag.preparing {
  background: #fff3e0;
  color: #ff6d00;
  border: 1px solid #ff6d0030;
}

.status-tag.shipping {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d230;
}

.status-tag.arrived {
  background: #e8f5e9;
  color: #388e3c;
  border: 1px solid #388e3c30;
}

.status-tag.completed {
  background: #f3e5f5;
  color: #8e24aa;
  border: 1px solid #8e24aa30;
}

.label {
  font-size: 0.9rem;
  color: #5a6268;
  margin-bottom: 4px;
  font-weight: 600;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
}


.shipping-status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85em;
  font-weight: 500;
}

.shipping-status.delivered {
  background: #28a74520;
  color: #28a745;
  border: 1px solid #28a74530;
}

.shipping-status.in-transit {
  background: #17a2b820;
  color: #138496;
  border: 1px solid #17a2b830;
}

.info-section {
  margin: 18px 0;
}

.section-title {
  color: #1a3a5f;
  font-size: 1rem;
  margin: 0 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1px dashed #c4d8eb;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  background: white;
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}


.basic-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.vessel-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
}

.alert-banner {
  background: #fff3cd;
  color: #856404;
  padding: 10px 15px;
  margin-top: 15px;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.9; }
  50% { opacity: 0.7; }
  100% { opacity: 0.9; }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .shipping-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .shipping-status {
    margin-top: 8px;
    align-self: flex-start;
  }
}

.eta-tag {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.eta-arrived .eta-tag {
  background-color: #e6ffed;
  color: #28a745;
  border: 1px solid #28a74530;
}

.eta-coming .eta-tag {
  background-color: #fff8e6;
  color: #d48806;
  border: 1px solid #ffd666;
}

</style>