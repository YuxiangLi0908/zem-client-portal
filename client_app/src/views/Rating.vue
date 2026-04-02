<template>
  <div class="login-wrapper">
    <MainHeader />
    
    <div class="quotation-page">
      <section class="section-quotation">
        <div class="container">
          <h1 class="section-title">仓点询价</h1>
          
          <div class="content-block">
            <div class="quotation-container">
              <div class="form-section">
                <div class="form-card">
                  <h2 class="form-title">输入查询条件</h2>
                  
                  <div class="form-group">
                    <label class="form-label">仓点</label>
                    <input 
                      type="text" 
                      v-model="formData.destination" 
                      class="form-input" 
                      placeholder="请输入仓点"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">CBM</label>
                    <input 
                      type="number" 
                      v-model="formData.cbm" 
                      class="form-input" 
                      placeholder="请输入CBM"
                      step="0.01"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">板数</label>
                    <input 
                      type="number" 
                      v-model="formData.pallets" 
                      class="form-input" 
                      placeholder="请输入板数"
                      min="1"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">柜型</label>
                    <select v-model="formData.container_type" class="form-select">
                      <option value="40HQ/GP">40HQ/GP</option>
                      <option value="45HQ/GP">45HQ/GP</option>
                    </select>
                  </div>
                  
                  <button 
                    @click="queryQuotation" 
                    class="query-button"
                    :disabled="loading"
                  >
                    <span v-if="loading">查询中...</span>
                    <span v-else>查询</span>
                  </button>
                </div>
              </div>
              
              <div class="result-section">
                <div class="result-card" v-if="quotations.length > 0">
                  <h2 class="result-title">查询结果</h2>
                  
                  <div class="effective-date" v-if="effectiveDate">
                    <i class="fa fa-calendar"></i>
                    参考报价表更新时间: {{ effectiveDate }}
                  </div>
                  
                  <div class="quotation-grid">
                    <div 
                      v-for="(item, index) in quotations" 
                      :key="index"
                      class="quotation-item"
                    >
                      <div class="item-header">
                        <span class="warehouse-tag">{{ item.warehouse }}</span>
                        <span class="type-tag">{{ item.type }}</span>
                      </div>
                      <div class="item-body">
                        <div class="price-display">
                          <span class="price-label">价格</span>
                          <span class="price-value">${{ item.price.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="result-card empty-card" v-else-if="!loading && !error">
                  <div class="empty-content">
                    <i class="fa fa-search empty-icon"></i>
                    <p class="empty-text">请输入查询条件并点击查询</p>
                  </div>
                </div>
                
                <div class="result-card error-card" v-else-if="error">
                  <div class="error-content">
                    <i class="fa fa-exclamation-circle error-icon"></i>
                    <p class="error-text">{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'

export default {
  name: 'Rating',
  components: {
    MainHeader
  },
  data() {
    return {
      formData: {
        destination: '',
        cbm: null,
        pallets: null,
        container_type: '40HQ/GP'
      },
      quotations: [],
      effectiveDate: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async queryQuotation() {
      console.log('========== 按钮点击了 ==========')
      console.log('表单数据:', this.formData)
      
      if (!this.formData.destination) {
        this.error = '请填写仓点'
        console.log('验证失败: 缺少仓点')
        return
      }
      
      if (this.formData.cbm === null && this.formData.pallets === null) {
        this.error = 'CBM和板数必须至少填写一个'
        console.log('验证失败: CBM和板数都为空')
        return
      }
      
      this.loading = true
      this.error = null
      this.quotations = []
      this.effectiveDate = null
      
      const token = localStorage.getItem('token')
      console.log('Token:', token)
      
      const requestData = {
        destination: this.formData.destination,
        container_type: this.formData.container_type
      }
      
      if (this.formData.cbm !== null && this.formData.cbm !== '') {
        requestData.cbm = parseFloat(this.formData.cbm)
      }
      
      if (this.formData.pallets !== null && this.formData.pallets !== '') {
        requestData.pallets = parseInt(this.formData.pallets)
      }
      
      try {
        
        const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/query_quotation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
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
          this.error = `查询失败: ${errorMsg}`
          console.error('Backend error:', errorMsg)
          return
        }
        
        this.quotations = data.quotations || []
        this.effectiveDate = data.effective_date || null
        
      } catch (e) {
        console.error('Network error:', e)
        this.error = `查询失败: ${e.message || String(e)}`
      } finally {
        this.loading = false
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
  min-height: 100vh;
  background: #f5f5f5;
}

.quotation-page {
  padding: 30px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #32bfc0;
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 15px;
  border-bottom: 3px solid #32bfc0;
}

.section-quotation {
  background: white;
  padding: 40px 0;
  margin-bottom: 20px;
}

.content-block {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
}

.quotation-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
}

.form-section, .result-section {
  display: flex;
  flex-direction: column;
}

.form-card, .result-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.form-title, .result-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.effective-date {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0f766e;
  font-weight: 500;
}

.effective-date i {
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #32bfc0;
  box-shadow: 0 0 0 3px rgba(50, 191, 192, 0.1);
}

.query-button {
  width: 100%;
  padding: 14px;
  background: #32bfc0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.query-button:hover:not(:disabled) {
  background: #28a0a1;
}

.query-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.quotation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.quotation-item {
  background: #f8f9f9;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.quotation-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.quotation-item.no-price {
  background: #fef2f2;
  border-color: #fecaca;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.warehouse-tag {
  background: #32bfc0;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.type-tag {
  background: #64748b;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-body {
  text-align: center;
}

.price-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: #64748b;
}

.price-value {
  font-size: 28px;
  font-weight: 700;
  color: #32bfc0;
}

.no-price-display {
  padding: 20px 0;
}

.no-price-text {
  font-size: 14px;
  color: #dc2626;
  font-weight: 500;
}

.empty-content, .error-content {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon, .error-icon {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.error-icon {
  color: #ef4444;
}

.empty-text, .error-text {
  font-size: 16px;
  color: #64748b;
}

.error-text {
  color: #dc2626;
}

@media (max-width: 1024px) {
  .quotation-container {
    grid-template-columns: 1fr;
  }
  
  .quotation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
