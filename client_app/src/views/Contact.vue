<template>
  <div class="login-wrapper">
    <MainHeader />
    
    <div class="contact-page">
      <section class="section-forecast-rules">
        <div class="container">
          <h1 class="section-title">货柜预报规范</h1>
          
          <div class="content-block">
            <h2 class="content-title">一、预报格式及接收渠道</h2>
            
            <h3 class="subtitle">1. 邮件主题及正文须包含：</h3>
            <ul class="requirement-list">
              <li>柜号</li>
              <li>MBL</li>
              <li>目的港</li>
              <li>柜型</li>
              <li>ETA</li>
              <li>船名航次</li>
              <li>服务类型标注【直送（+目的仓）/拆送/组合价（+指定区域）】</li>
            </ul>
            
            <h3 class="subtitle">2. 分区预报邮箱：</h3>
            
            <div class="email-region">
              <h4 class="region-title">洛杉矶(LA)</h4>
              <p>直送/组合：PORT-LA@ZEMLOGISTICS.COM、OP-LA@ZEMLOGISTICS.COM</p>
              <p>抄送：BILLING@ZEMLOGISTICS.COM</p>
            </div>
            
            <div class="email-region">
              <h4 class="region-title">萨凡纳(SAV)</h4>
              <p>直送/组合：PORT-SAV@ZEMLOGISTICS.COM、OP-SAV@ZEMLOGISTICS.COM</p>
              <p>抄送：BILLING@ZEMLOGISTICS.COM</p>
            </div>
            
            <div class="email-region">
              <h4 class="region-title">纽约(NJ)</h4>
              <p>直送/组合：PORT-NJ@ZEMLOGISTICS.COM、OP-NJ@ZEMLOGISTICS.COM</p>
              <p>抄送：BILLING@ZEMLOGISTICS.COM</p>
            </div>
            
            <div class="email-region">
              <h4 class="region-title">指令更改对应邮箱：</h4>
              <p>公仓对应指令：OP-NJ@ZEMLOGISTICS.COM、OP-SAV@ZEMLOGISTICS.COM、OP-LA@ZEMLOGISTICS.COM</p>
              <p>私仓对应指令：delivery@ZEMLOGISTICS.COM</p>
            </div>
          </div>
          
          <div class="content-block warning-block">
            <h2 class="content-title">二、私人地址货柜特别提示</h2>
            <div class="warning-header">
              <span class="warning-icon">⚠️</span>
              <span class="warning-text">含私人地址货柜需特别注明：</span>
            </div>
            
            <div class="warning-item">
              <h4>1. 需我司派送服务</h4>
              <p>必须提前完成运费询价，并在预报中标注有效询盘号（未标注货柜到港后默认暂扣）</p>
            </div>
            
            <div class="warning-item">
              <h4>2. 客户自提</h4>
              <p class="highlight-text">醒目注明"自提"标识</p>
            </div>
          </div>
          
          <div class="content-block">
            <h2 class="content-title">三、货柜清单制作标准</h2>
            <p class="guide-text">请确保以下字段独立成行，严禁单元格合并：</p>
            <div class="field-grid">
              <div class="field-item">
                <span class="check-icon">✅</span> 唛头信息
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> 件数
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> 毛重
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> 体积(CBM)
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> 仓点代码
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> FBA编号
              </div>
              <div class="field-item">
                <span class="check-icon">✅</span> PO号
              </div>
            </div>
          </div>
          
          <div class="content-block">
            <h2 class="content-title">四、时效保障</h2>
            <p>我司接收预报后，将优先处理完整规范的申报，并于2个工作日内完成订单分类。</p>
          </div>
          
          <div class="content-block">
            <h2 class="content-title">五、责任条款</h2>
            
            <div class="clause-item">
              <h4>1. 预报时效要求</h4>
              <p>常规预报：请于ETA到港前一周完成货柜预报</p>
              <p>加急处理：ETA前3天内收到的预报将收取加急操作费</p>
            </div>
            
            <div class="clause-item">
              <h4>2. 错误修正机制</h4>
              <p>如发现原始预报错误（包括但不限于信息缺失/格式不符/标注不清）</p>
              <p>必须于"到港前5个工作日"提交邮件或者业务群更正通知</p>
              <p class="clause-warning">超时未更正的货柜清单，因错误导致的：尾程派送延误、额外费用产生或其他问题，均由客户承担全部责任及费用</p>
              <p>如有疑问，请联系我司港前客服。</p>
            </div>
          </div>
          
          <div class="signature-block">
            <p class="signature-text">祝商祺！</p>
            <p class="company-signature">ZEM ELITELINK LOGISTICS INC</p>
          </div>
          <!--
          <div class="qrcode-block">
            <img src="@/assets/images/wechat-qrcode.png" alt="微信二维码" class="qrcode-img">
          </div>
          -->
        </div>
      </section>
      
      <section class="section-contact-us">
        <div class="container">
          <h1 class="section-title">联系我们</h1>
          
          <div class="contact-cards">
            <div class="contact-card">
              <h3 class="card-title">New Jersey (NJ)</h3>
              <div class="card-info">
                <div class="info-item">
                  <i class="fa fa-map-marker info-icon"></i>
                  <span>27 Engelhard Ave, Avenel, NJ 07001</span>
                </div>
                <div class="info-item">
                  <i class="fa fa-phone info-icon"></i>
                  <span>meilin, 646-339-0570</span>
                </div>
              </div>
              <div class="wechat-cards">
                <div class="wechat-card" @click="showLargeWechat('NJ')">
                  <img src="@/assets/images/cs_team_leader.png" alt="NJ客服微信" class="wechat-img">
                  <p>NJ区域客服</p>
                </div>
              </div>
            </div>
            
            <div class="contact-card">
              <h3 class="card-title">Savannah (SAV)</h3>
              <div class="card-info">
                <div class="info-item">
                  <i class="fa fa-map-marker info-icon"></i>
                  <span>1001 Trade Center Pkwy, Rincon, GA 31326</span>
                </div>
                <div class="info-item">
                  <i class="fa fa-phone info-icon"></i>
                  <span>LEON, 934-226-7717</span>
                </div>
              </div>
              <div class="wechat-cards">
                <div class="wechat-card" @click="showLargeWechat('SAV')">
                  <img src="@/assets/images/cs_team_leader.png" alt="SAV客服微信" class="wechat-img">
                  <p>SAV区域客服</p>
                </div>
              </div>
            </div>
            
            <div class="contact-card">
              <h3 class="card-title">Los Angeles (LA)</h3>
              <div class="card-info">
                <div class="info-item">
                  <i class="fa fa-map-marker info-icon"></i>
                  <span>5450 E Francis St, Ontario, CA 91761</span>
                </div>
                <div class="info-item">
                  <i class="fa fa-phone info-icon"></i>
                  <span>Gina, 626-435-4246</span>
                </div>
              </div>
              <div class="wechat-cards">
                <div class="wechat-card" @click="showLargeWechat('LA')">
                  <img src="@/assets/images/cs_team_leader.png" alt="LA客服微信" class="wechat-img">
                  <p>LA区域客服</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <div v-if="showWechatPreview" class="wechat-preview-modal" @click.self="hideLargeWechat">
      <div class="preview-content">
        <img src="@/assets/images/cs_team_leader.png" alt="客服微信" class="preview-img">
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'

export default {
  name: 'ContactPage',
  components: {
    MainHeader
  },
  data() {
    return {
      showWechatPreview: false,
      currentPreviewType: ''
    }
  },
  methods: {
    showLargeWechat(type) {
      this.currentPreviewType = type
      this.showWechatPreview = true
    },
    hideLargeWechat() {
      this.showWechatPreview = false
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

.contact-page {
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

.section-forecast-rules {
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

.warning-block {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.content-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #555;
  margin: 15px 0 10px;
}

.requirement-list {
  list-style: none;
  padding: 0;
}

.requirement-list li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: #444;
}

.requirement-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: #32bfc0;
  font-weight: bold;
}

.email-region {
  background: white;
  border-radius: 6px;
  padding: 18px;
  margin: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.region-title {
  font-size: 16px;
  font-weight: 600;
  color: #32bfc0;
  margin-bottom: 10px;
}

.email-region p {
  color: #555;
  margin: 5px 0;
  font-size: 15px;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 24px;
}

.warning-text {
  font-size: 16px;
  font-weight: 600;
  color: #856404;
}

.warning-item {
  background: white;
  border-radius: 6px;
  padding: 15px;
  margin: 12px 0;
}

.warning-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.warning-item p {
  color: #555;
  margin: 0;
  line-height: 1.6;
}

.highlight-text {
  color: #dc3545;
  font-weight: 700;
}

.guide-text {
  color: #555;
  margin-bottom: 15px;
  font-size: 15px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  background: white;
  border-radius: 6px;
  padding: 20px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #444;
  font-size: 15px;
}

.check-icon {
  font-size: 16px;
}

.clause-item {
  background: white;
  border-radius: 6px;
  padding: 18px;
  margin: 15px 0;
}

.clause-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.clause-item p {
  color: #555;
  margin: 6px 0;
  line-height: 1.6;
}

.clause-warning {
  color: #dc3545;
  font-weight: 500;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0 !important;
}

.signature-block {
  text-align: right;
  margin-top: 40px;
  padding-right: 20px;
}

.signature-text {
  font-size: 16px;
  color: #555;
  margin: 0 0 8px;
}

.company-signature {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.qrcode-block {
  text-align: center;
  margin-top: 30px;
}

.qrcode-img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.section-contact-us {
  background: white;
  padding: 40px 0;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.contact-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #32bfc0;
  margin-bottom: 20px;
  text-align: center;
}

.card-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.info-icon {
  color: #32bfc0;
  font-size: 16px;
  margin-top: 3px;
  min-width: 20px;
}

.info-item span {
  color: #555;
  line-height: 1.5;
}

.wechat-cards {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.wechat-card {
  text-align: center;
  cursor: pointer;
}

.wechat-img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.wechat-card p {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}

.wechat-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.preview-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.preview-img {
  width: 350px;
  height: 350px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 24px;
  }
  
  .content-title {
    font-size: 18px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .contact-cards {
    grid-template-columns: 1fr;
  }
  
  .wechat-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
