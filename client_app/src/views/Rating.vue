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
                        <div v-if="item.type === '转运'" class="transfer-price-display">
                          <div class="price-row">
                            <span class="price-label">单板价格</span>
                            <span class="price-value">${{ item.unit_price?.toFixed(2) }}</span>
                          </div>
                          <div class="price-row">
                            <span class="price-label">计算板数</span>
                            <span class="price-value">{{ item.pallets }}</span>
                          </div>
                          <div class="price-row">
                            <span class="price-label">总价</span>
                            <span class="price-value total">${{ item.price.toFixed(2) }}</span>
                          </div>
                        </div>
                        <div v-else class="combina-price-display">
                          <div class="price-display">
                            <span class="price-label">价格</span>
                            <span class="price-value">${{ item.price.toFixed(2) }}</span>
                          </div>
                          <div class="combina-hint">最终根据实际cbm占比计算</div>
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
        <div class="maersk-modal multi-carrier-modal">
          <div class="modal-header">
            <h3 class="modal-title">三方询价</h3>
            <button class="modal-close" @click="closeMaerskModal">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">取件日期 <span class="required">*</span></label>
                <input type="date" v-model="maerskForm.pickupDate" class="form-input">
              </div>
              <div class="form-group half compact-fields">
                <div>
                  <label class="form-label">运输类型</label>
                  <select v-model.number="maerskForm.quoteType" class="form-select">
                    <option :value="1">LTL</option><option :value="2">FTL</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">FTL 车型</label>
                  <select v-model.number="maerskForm.carType" class="form-select" :disabled="maerskForm.quoteType !== 2">
                    <option :value="1">53尺厢式货车</option><option :value="2">冷链车</option>
                    <option :value="3">48尺平板车</option><option :value="10">26尺小车</option>
                    <option :value="12">26尺小车带尾板</option><option :value="13">快速拖车</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-row address-row">
              <div class="address-card">
                <h4>发货地址</h4>
                <select v-model="maerskForm.originWarehouse" class="form-select" @change="handleWarehouseChange">
                  <option value="">请选择 ZEM 仓库</option>
                  <option v-for="item in quoteOptions.origins" :key="item.warehouse" :value="item.warehouse">{{ item.warehouse }}</option>
                </select>
                <select v-model.number="maerskForm.originType" class="form-select" disabled>
                  <option :value="1">商业地址</option><option :value="2">住宅地址</option><option :value="3">装卸平台</option>
                </select>
                <input v-model="maerskForm.originDetailAddress" class="form-input" placeholder="详细地址" readonly>
                <div class="address-parts">
                  <input v-model="maerskForm.originCity" class="form-input" placeholder="城市" readonly>
                  <input v-model="maerskForm.originState" class="form-input state-input" placeholder="州" maxlength="2" readonly>
                  <input v-model="maerskForm.originPostCode" class="form-input" placeholder="邮编" readonly>
                </div>
              </div>
              <div class="address-card">
                <h4>收货地址</h4>
                <input v-model.trim="maerskForm.destinationWarehouse" class="form-input" placeholder="收货仓点，如 ONT8" @change="handleDestinationChange">
                <select v-model.number="maerskForm.destinationType" class="form-select">
                  <option :value="1">商业地址</option><option :value="2">住宅地址</option><option :value="3">装卸平台</option>
                </select>
                <input v-model="maerskForm.destinationDetailAddress" class="form-input" placeholder="详细地址（可选）">
                <div class="address-parts">
                  <input v-model="maerskForm.destinationCity" class="form-input" placeholder="城市 *">
                  <input v-model="maerskForm.destinationState" class="form-input state-input" placeholder="州 *" maxlength="2">
                  <input v-model="maerskForm.destinationPostCode" class="form-input" placeholder="邮编 *">
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">Freight Class</label>
                <input v-model="maerskForm.freightClass" class="form-input" placeholder="留空则自动计算">
              </div>
              <div class="form-group half">
                <label class="form-label">申报价值 ($) <span class="required">*</span></label>
                <input type="number" min="1" step="0.01" v-model.number="maerskForm.declaredValue" class="form-input">
              </div>
            </div>

            <div class="option-row">
              <label><span>货物单位</span><select v-model.number="maerskForm.commodityUnit" class="form-select"><option :value="11">PALLETS</option><option :value="2">BOXES</option><option :value="3">CARTONS</option><option :value="14">CRATE</option></select></label>
              <label><span>托盘类型</span><select v-model.number="maerskForm.palletType" class="form-select"><option :value="1">PALLETS</option><option :value="2">CRATES</option></select></label>
              <label class="checkbox-label"><input type="checkbox" v-model="maerskForm.needLiftgate"> 需要 Liftgate</label>
            </div>

            <div class="form-group items-group">
              <div class="items-label-row">
                <div class="items-label-left">
                  <label class="form-label">货物明细</label>
                  <span class="required">*</span>
                  <span class="items-count">（{{ maerskForm.items.length }}条）</span>
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
              <h4 class="result-title">询价结果 <small v-if="maerskResult.freightClass">Freight Class：{{ maerskResult.freightClass }}</small></h4>
              <div class="carrier-results">
                <section v-for="carrier in visibleCarrierResults" :key="carrier.key" class="carrier-card">
                  <h4>{{ carrier.name }}</h4>
                  <div v-if="carrier.rows.length">
                    <div v-for="(quote, index) in carrier.rows" :key="index" class="carrier-rate">
                      <strong>{{ quote.name }}</strong><span class="quote-price">{{ formatMoney(quote.price) }}</span>
                      <div v-if="quote.serviceCode" class="rate-note">服务代码：{{ quote.serviceCode }}</div>
                      <div v-if="quote.days" class="rate-note">预计 {{ quote.days }} 天</div>
                    </div>
                  </div>
                  <div v-else class="carrier-empty">{{ carrier.error || '暂未返回可用报价' }}</div>
                </section>
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
      quoteOptions: { origins: [], destinations: {} },
      maerskForm: {
        originWarehouse: '', originType: 3, originDetailAddress: '',
        originCity: '', originState: '', originPostCode: '',
        destinationWarehouse: '', destinationType: 1, destinationDetailAddress: '',
        destinationCity: '', destinationState: '', destinationPostCode: '',
        pickupDate: tomorrowStr, quoteType: 1, carType: 1,
        freightClass: '', declaredValue: null, commodityUnit: 11, palletType: 1,
        needLiftgate: false,
        items: [{ length: '', width: '', height: '', pieces: '', weight: '', description: '' }]
      },
      maerskLoading: false,
      maerskError: null,
      maerskResult: null
    }
  },
  computed: {
    visibleCarrierResults() {
      const results = this.maerskResult?.results || {}
      const maersk = this.findNestedArray(results.maersk?.data, 'quotes')
      const kakas = this.findNestedArray(results.kakas?.data, 'rates')
      return [
        {
          key: 'maersk', name: 'Maersk', error: results.maersk?.error,
          rows: maersk.map(q => ({
            name: q.DisplayService || q.carrierName || 'Maersk',
            serviceCode: q.Service || '', price: q.TotalQuote ?? q.totalPrice ?? q.price
          }))
        },
        {
          key: 'kakas', name: '卡卡省', error: results.kakas?.error,
          rows: kakas.map(q => ({
            name: q.carrierName || q.carrierCode || '卡卡省承运商',
            price: q.totalPrice, days: q.carrierTransitDays
          }))
        }
      ]
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
        this.showMaersk = data.show_maersk || false
        
      } catch (e) {
        console.error('Network error:', e)
        this.error = `查询失败: ${e.message || String(e)}`
      } finally {
        this.loading = false
      }
    },
    async openMaerskModal() {
      this.showMaerskModal = true
      this.maerskError = null
      this.maerskResult = null
      this.resetMaerskForm()
      try {
        await this.loadQuoteOptions()
        const destination = String(this.formData.destination || '').trim().toUpperCase()
        this.maerskForm.destinationWarehouse = destination
        this.handleDestinationChange()
        if (this.quoteOptions.origins.length) {
          this.maerskForm.originWarehouse = this.quoteOptions.origins[0].warehouse
          this.handleWarehouseChange()
        }
      } catch (e) {
        this.maerskError = `地址配置加载失败: ${e.message || String(e)}`
      }
    },
    closeMaerskModal() {
      this.showMaerskModal = false
    },
    resetMaerskForm() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      
      this.maerskForm = {
        originWarehouse: '', originType: 3, originDetailAddress: '',
        originCity: '', originState: '', originPostCode: '',
        destinationWarehouse: '', destinationType: 1, destinationDetailAddress: '',
        destinationCity: '', destinationState: '', destinationPostCode: '',
        pickupDate: tomorrowStr, quoteType: 1, carType: 1,
        freightClass: '', declaredValue: null, commodityUnit: 11, palletType: 1,
        needLiftgate: false,
        items: [{ length: '', width: '', height: '', pieces: '', weight: '', description: '' }]
      }
    },
    async loadQuoteOptions() {
      if (this.quoteOptions.origins.length) return
      const token = localStorage.getItem('token')
      const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/multi_carrier_quote_options', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || '无法读取询价地址配置')
      this.quoteOptions = data
    },
    handleWarehouseChange() {
      const address = this.quoteOptions.origins.find(item => item.warehouse === this.maerskForm.originWarehouse) || {}
      this.maerskForm.originDetailAddress = address.detailAddress || ''
      this.maerskForm.originCity = address.city || ''
      this.maerskForm.originState = address.state || ''
      this.maerskForm.originPostCode = address.postCode || ''
      this.maerskForm.originType = Number(address.type || 3)
    },
    handleDestinationChange() {
      const code = String(this.maerskForm.destinationWarehouse || '').trim().toUpperCase()
      this.maerskForm.destinationWarehouse = code
      const matchedKey = Object.keys(this.quoteOptions.destinations).find(key => key.trim().toUpperCase() === code)
      const address = matchedKey ? this.quoteOptions.destinations[matchedKey] : {}
      this.maerskForm.destinationDetailAddress = address.location || ''
      this.maerskForm.destinationCity = address.city || ''
      this.maerskForm.destinationState = address.state || ''
      this.maerskForm.destinationPostCode = address.zipcode || ''
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
    findNestedArray(value, key) {
      if (!value || typeof value !== 'object') return []
      if (Array.isArray(value[key])) return value[key]
      for (const child of Object.values(value)) {
        const found = this.findNestedArray(child, key)
        if (found.length) return found
      }
      return []
    },
    formatMoney(value) {
      return Number.isFinite(Number(value)) ? `$${Number(value).toFixed(2)}` : '价格待返回'
    },
    async submitMaerskQuote() {
      this.maerskError = null
      this.maerskResult = null
      
      const required = ['originWarehouse', 'originCity', 'originState', 'originPostCode',
        'destinationWarehouse', 'destinationCity', 'destinationState', 'destinationPostCode']
      if (required.some(field => !String(this.maerskForm[field] || '').trim())) {
        this.maerskError = '请填写完整的发货和收货地址'
        return
      }
      if (!this.maerskForm.pickupDate) {
        this.maerskError = '请选择取件日期'
        return
      }
      if (!this.maerskForm.declaredValue || Number(this.maerskForm.declaredValue) <= 0) {
        this.maerskError = '请填写有效的申报价值'
        return
      }
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const shipDateObj = new Date(this.maerskForm.pickupDate)
      shipDateObj.setHours(0, 0, 0, 0)
      
      if (shipDateObj < tomorrow) {
        this.maerskError = '取件日期不能早于明天'
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
        const requestData = { ...this.maerskForm, items }
        
        const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/multi_carrier_quotation', {
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
        console.error('Multi-carrier quote error:', e)
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

.transfer-price-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.price-row .price-label {
  font-size: 13px;
}

.price-row .price-value {
  font-size: 18px;
}

.price-row .price-value.total {
  font-size: 24px;
  color: #0f766e;
}

.combina-price-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.combina-hint {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
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

.multi-carrier-modal {
  max-width: 1180px;
}

.compact-fields,
.address-parts,
.option-row,
.carrier-results {
  display: grid;
  gap: 12px;
}

.compact-fields {
  grid-template-columns: 1fr 1.4fr;
}

.address-row {
  margin: 18px 0;
}

.address-card {
  border: 1px solid #dbe4ee;
  border-radius: 10px;
  padding: 16px;
  background: #fbfdff;
}

.address-card h4 {
  margin: 0 0 12px;
  color: #334155;
}

.address-card > .form-input,
.address-card > .form-select {
  margin-bottom: 10px;
}

.address-parts {
  grid-template-columns: 1.5fr 0.65fr 1fr;
}

.option-row {
  grid-template-columns: 1fr 1fr 1fr;
  align-items: end;
  margin-bottom: 18px;
}

.option-row label > span {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.checkbox-label {
  padding: 12px 4px;
  color: #334155;
}

.carrier-results {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.carrier-card {
  border: 1px solid #dbe4ee;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}

.carrier-card h4 {
  margin: 0 0 12px;
  color: #334155;
}

.carrier-rate {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.carrier-rate .quote-price {
  float: right;
  font-size: 19px;
}

.rate-note,
.carrier-empty {
  margin-top: 5px;
  color: #64748b;
  font-size: 13px;
}

.result-title small {
  float: right;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
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

  .compact-fields,
  .address-parts,
  .option-row,
  .carrier-results {
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
