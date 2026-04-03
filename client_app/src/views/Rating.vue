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
                
                <div class="result-card empty-card" v-else-if="!loading && !error && !showMaersk">
                  <div class="empty-content">
                    <i class="fa fa-search empty-icon"></i>
                    <p class="empty-text">请输入查询条件并点击查询</p>
                  </div>
                </div>
                
                <div class="result-card maersk-card" v-else-if="!loading && !error && showMaersk">
                  <div class="maersk-content">
                    <i class="fa fa-shipping-fast maersk-icon"></i>
                    <h3 class="maersk-title">暂无标准报价</h3>
                    <p class="maersk-text">我们需要更多详细信息来为您进行 详细 询价</p>
                    <button class="maersk-button" @click="openMaerskModal">
                      <i class="fa fa-calculator"></i> 开始 详细 询价
                    </button>
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
      
      <div class="modal-overlay" v-if="showMaerskModal" @click.self="closeMaerskModal">
        <div class="maersk-modal">
          <div class="modal-header">
            <h3 class="modal-title">详细询价</h3>
            <button class="modal-close" @click="closeMaerskModal">
              &times;
            </button>
            
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">起始仓库 <span class="required">*</span></label>
                <select v-model="maerskForm.warehouse" class="form-select" @change="handleWarehouseChange">
                  <option value="NJ">NJ</option>
                  <option value="SAV">SAV</option>
                  <option value="LA">LA</option>
                </select>
              </div>
              <div class="form-group half">
                <label class="form-label">目的邮编 <span class="required">*</span></label>
                <input type="text" v-model="maerskForm.destZip" class="form-input" placeholder="请输入目的邮编">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">发货日期 <span class="required">*</span></label>
                <input type="date" v-model="maerskForm.shipDate" class="form-input">
              </div>
              <div class="form-group half">
                <label class="form-label">是否需要 Liftgate</label>
                <select v-model="maerskForm.needLiftgate" class="form-select">
                  <option value="否">否</option>
                  <option value="是">是</option>
                </select>
              </div>
            </div>
            
            <div class="form-group items-group">
              <div class="items-label-row">
                <div class="items-label-left">
                  <label class="form-label">货物明细</label>
                  <span class="required">*</span>
                  <span class="items-count">（{{ maerskForm.items.length }}板）</span>
                </div>
                <span class="items-hint">每行记录为一个板子</span>
              </div>
              <div class="items-table-container">
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>长 (in)</th>
                      <th>宽 (in)</th>
                      <th>高 (in)</th>
                      <th>件数</th>
                      <th>重量 (lbs)</th>
                      <th>商品描述</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in maerskForm.items" :key="index">
                      <td>
                        <input type="number" v-model.number="item.length" class="form-input small-input" @blur="roundInt(item, 'length')">
                      </td>
                      <td>
                        <input type="number" v-model.number="item.width" class="form-input small-input" @blur="roundInt(item, 'width')">
                      </td>
                      <td>
                        <input type="number" v-model.number="item.height" class="form-input small-input" @blur="roundInt(item, 'height')">
                      </td>
                      <td>
                        <input type="number" v-model.number="item.pieces" class="form-input small-input" min="1" placeholder="请输入件数">
                      </td>
                      <td>
                        <input type="number" v-model.number="item.weight" class="form-input small-input" @blur="roundInt(item, 'weight')">
                      </td>
                      <td>
                        <input type="text" v-model="item.description" class="form-input small-input" placeholder="商品描述">
                      </td>
                      <td>
                        <button type="button" class="remove-item-btn" @click="removeItem(index)" v-if="maerskForm.items.length > 1">
                          <i class="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button type="button" class="add-item-btn" @click="addItem">
                <i class="fa fa-plus"></i> 添加一行
              </button>
            </div>
            
            <div v-if="maerskError" class="maersk-error">
              <i class="fa fa-exclamation-circle"></i> {{ maerskError }}
            </div>
            
            <div v-if="maerskResult" class="maersk-result">
              <h4 class="result-title">询价结果</h4>
              <div v-if="maerskResult.rating" class="result-summary">
                <div class="summary-row">
                  <span class="summary-label">运输路线：</span>
                  <span class="summary-value">{{ maerskResult.shipper?.Zipcode || '-' }} → {{ maerskResult.consignee?.Zipcode || '-' }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">发货日期：</span>
                  <span class="summary-value">{{ maerskResult.rating?.ShipDate || '-' }}</span>
                </div>
              </div>
              <div v-for="(quote, index) in sortedQuotes" :key="index" class="quote-card" :class="{ 'best-value': index === 0 }">
                <div class="quote-header">
                  <div class="quote-service">
                    <span class="service-name">{{ quote.DisplayService }}</span>
                    <span v-if="index === 0" class="best-badge">推荐方案</span>
                  </div>
                  <div class="quote-price">${{ (quote.TotalQuote || 0).toFixed(2) }}</div>
                </div>
                <div class="quote-details">
                  <div class="detail-item">
                    <span class="detail-label">预计送达</span>
                    <span class="detail-value">{{ quote.DeliveryDate || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">计费重量</span>
                    <span class="detail-value">{{ quote.ChargeWeight || '-' }} lbs</span>
                  </div>
                </div>
                <div class="quote-breakdown" v-if="quote.Breakdowns && quote.Breakdowns.length > 0">
                  <div class="breakdown-title">费用明细</div>
                  <div v-for="(bd, bdIndex) in quote.Breakdowns" :key="bdIndex" class="breakdown-item">
                    <span class="breakdown-name">{{ getChargeName(bd.BillCodeName) }}</span>
                    <span class="breakdown-price">${{ (bd.Charge || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeMaerskModal">关闭</button>
            <button type="button" class="btn-primary" @click="submitMaerskQuote" :disabled="maerskLoading">
              <span v-if="maerskLoading">
                <i class="fa fa-spinner fa-spin"></i> 询价中...
              </span>
              <span v-else>
                <i class="fa fa-paper-plane"></i> 开始询价
              </span>
            </button>
          </div>
        </div>
      </div>
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
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    
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
      error: null,
      showMaersk: false,
      showMaerskModal: false,
      maerskForm: {
        warehouse: 'NJ',
        originZip: '07001',
        destZip: '',
        shipDate: tomorrowStr,
        needLiftgate: '否',
        items: [{ length: '', width: '', height: '', pieces: '', weight: '', description: '' }]
      },
      maerskLoading: false,
      maerskError: null,
      maerskResult: null
    }
  },
  computed: {
    sortedQuotes() {
      if (!this.maerskResult || !this.maerskResult.quotes) return []
      return [...this.maerskResult.quotes].sort((a, b) => (a.TotalQuote || 0) - (b.TotalQuote || 0))
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
        
        const res = await fetch('http://localhost:8000/query_quotation', {
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
        this.showMaersk = data.show_maersk || false
        
      } catch (e) {
        console.error('Network error:', e)
        this.error = `查询失败: ${e.message || String(e)}`
      } finally {
        this.loading = false
      }
    },
    openMaerskModal() {
      this.showMaerskModal = true
      this.maerskError = null
      this.maerskResult = null
      this.resetMaerskForm()
    },
    closeMaerskModal() {
      this.showMaerskModal = false
    },
    resetMaerskForm() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      
      this.maerskForm = {
        warehouse: 'NJ',
        originZip: '07001',
        destZip: '',
        shipDate: tomorrowStr,
        needLiftgate: '否',
        items: [{ length: '', width: '', height: '', pieces: '', weight: '', description: '' }]
      }
    },
    handleWarehouseChange() {
      const zipMap = { 'NJ': '07001', 'SAV': '31326', 'LA': '91761' }
      this.maerskForm.originZip = zipMap[this.maerskForm.warehouse]
    },
    addItem() {
      this.maerskForm.items.push({ length: '', width: '', height: '', pieces: '', weight: '', description: '' })
    },
    removeItem(index) {
      if (this.maerskForm.items.length > 1) {
        this.maerskForm.items.splice(index, 1)
      }
    },
    roundInt(item, field) {
      if (item[field] !== '' && item[field] !== null && item[field] !== undefined) {
        item[field] = Math.ceil(Number(item[field]))
      }
    },
    getChargeName(billCodeName) {
      const chargeNameMap = {
        'FREIGHT CHARGES': '基础运费',
        'FUEL SURCHARGE': '燃油附加费',
        'ADDTL LABOR': '额外人工费',
        'LIFTGATE PICKUP': '提货升降机费',
        'LIFTGATE DELIVERY': '送货升降机费',
        'LIMITED ACCESS PICKUP': '受限区域提货费',
        'LIMITED ACCESS DELIVERY': '受限区域送货费',
        'RESIDENTIAL PICKUP': '住宅提货费',
        'RESIDENTIAL DELIVERY': '住宅送货费'
      }
      return chargeNameMap[billCodeName] || billCodeName
    },
    async submitMaerskQuote() {
      this.maerskError = null
      this.maerskResult = null
      
      if (!this.maerskForm.destZip) {
        this.maerskError = '请填写目的邮编'
        return
      }
      
      if (!this.maerskForm.shipDate) {
        this.maerskError = '请选择发货日期'
        return
      }
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const shipDateObj = new Date(this.maerskForm.shipDate)
      shipDateObj.setHours(0, 0, 0, 0)
      
      if (shipDateObj < tomorrow) {
        this.maerskError = '发货日期不能早于明天'
        return
      }
      
      const validItems = this.maerskForm.items.filter(item => {
        return item.length && item.width && item.height && item.pieces && item.weight
      })
      
      if (validItems.length === 0) {
        this.maerskError = '请至少填写一行完整的货物明细'
        return
      }
      
      const items = validItems.map(item => ({
        description: item.description || 'Pallet',
        pieces: Math.max(1, Number(item.pieces)),
        length: Math.ceil(Number(item.length) || 0),
        width: Math.ceil(Number(item.width) || 0),
        height: Math.ceil(Number(item.height) || 0),
        weight: Math.ceil(Number(item.weight) || 0)
      }))
      
      this.maerskLoading = true
      
      try {
        const token = localStorage.getItem('token')
        const requestData = {
          warehouse: this.maerskForm.warehouse,
          dest_zip: this.maerskForm.destZip,
          ship_date: this.maerskForm.shipDate,
          need_liftgate: this.maerskForm.needLiftgate,
          items: items
        }
        
        const res = await fetch('http://localhost:8000/maersk_quotation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        })
        
        const data = await res.json()
        
        if (!res.ok || !data.success) {
          this.maerskError = data.message || '询价失败'
          return
        }
        
        this.maerskResult = data.data
        
      } catch (e) {
        console.error('Maersk quote error:', e)
        this.maerskError = `询价失败: ${e.message || String(e)}`
      } finally {
        this.maerskLoading = false
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

.maersk-card {
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
  border: 2px solid #32bfc0;
}

.maersk-content {
  text-align: center;
  padding: 40px 20px;
}

.maersk-icon {
  font-size: 64px;
  color: #32bfc0;
  margin-bottom: 20px;
}

.maersk-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.maersk-text {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
}

.maersk-button {
  background: linear-gradient(135deg, #32bfc0 0%, #28a0a1 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.maersk-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 191, 192, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.maersk-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #32bfc0 0%, #28a0a1 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group.half {
  margin-bottom: 0;
}

.required {
  color: #ef4444;
}

.items-group {
  margin-top: 16px;
}

.items-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.items-label-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.items-count {
  font-size: 14px;
  color: #32bfc0;
  font-weight: 600;
}

.items-hint {
  font-size: 12px;
  color: #94a3b8;
}

.items-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table thead {
  position: sticky;
  top: 0;
  background: #f9fafb;
  z-index: 1;
}

.items-table th,
.items-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.items-table th {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.small-input {
  padding: 8px 10px;
  font-size: 14px;
}

.remove-item-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.remove-item-btn:hover {
  background: #fef2f2;
}

.add-item-btn {
  background: #f0fdfa;
  border: 2px dashed #32bfc0;
  color: #32bfc0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.add-item-btn:hover {
  background: #ccfbf1;
}

.maersk-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.maersk-result {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.result-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.result-summary {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  margin-bottom: 8px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-weight: 600;
  color: #64748b;
  min-width: 100px;
}

.summary-value {
  color: #1f2937;
}

.quote-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.quote-card.best-value {
  border-color: #32bfc0;
  background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.quote-service {
  display: flex;
  align-items: center;
  gap: 12px;
}

.service-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.best-badge {
  background: #32bfc0;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.quote-price {
  font-size: 28px;
  font-weight: 700;
  color: #ef4444;
}

.quote-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.quote-breakdown {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
}

.breakdown-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-name {
  color: #64748b;
}

.breakdown-price {
  font-weight: 600;
  color: #1f2937;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 2px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.btn-secondary,
.btn-primary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-primary {
  background: linear-gradient(135deg, #32bfc0 0%, #28a0a1 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 191, 192, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .quote-details {
    grid-template-columns: 1fr;
  }
  
  .maersk-modal {
    border-radius: 8px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
}
</style>
