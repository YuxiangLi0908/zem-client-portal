<template>
  <div class="site-header header-v2">
    <div class="flat-top">
      <div class="container">        
        <div class="row">         
          <div class="flat-wrapper">                 
            <div class="contact-line">
              <span><i class="fa fa-envelope icon-contact"></i> DARREN@ZEMLOGISTICS.COM</span>
              <span><i class="fa fa-phone icon-contact"></i> +1 805-868-1682</span>
              <div class="social-links">
                <a href="javascript:;" @click="showWechatModal = true"><i class="fa fa-wechat"></i></a>
                <a href="#"><i class="fa fa-envelope"></i></a>
                <a href="#"><i class="fa fa-map-marker"></i></a>
              </div>
            </div>
            <div class="address-line">
              <span><i class="fa fa-map-marker icon-address"></i> NJ: 27 Engelhard Ave, Avenel NJ07001</span>
              <span><i class="fa fa-map-marker icon-address"></i> SAV: 1001 Trade Center Pkwy, Rincon, GA31326</span>
              <span><i class="fa fa-map-marker icon-address"></i> LA: 5450 E Francis St, Ontario, CA 91761</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <header class="header"> 
      <div class="header-wrap"> 
        <div id="logo" class="logo">
          <img src="@/assets/images/ZEM-watermark.png" alt="zem-Logo">
          <span class="company-name">ZEM LOGISTICS</span>
        </div>       
        <nav id="mainnav" class="mainnav">
          <ul class="menu">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/search">Search</router-link></li>
            <li><router-link to="/about">Company</router-link></li>
            <li><router-link to="/services">Services</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
          <div class="menu-extra">
            <ul>
              <li class="search-box">
                <a href="#search" class="flat-search"><i class="fa fa-search"></i></a>
              </li>
              <template v-if="isAuthenticated">
                <li class="user-container">
                  <div class="user-info">
                    <span class="username">{{ currentUser }}</span>
                    <a href="javascript:;" @click="handleLogout" class="logout-btn">Logout</a>
                  </div>
                </li>
              </template>
              <template v-else>
                <li class="login-container">
                  <a href="javascript:;" @click="showLoginModal = true" class="login-btn">Login</a>
                </li>
              </template>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  </div>

  <div v-if="showWechatModal" class="wechat-modal" @click.self="showWechatModal = false">
    <div class="modal-content">
      <span class="close" @click="showWechatModal = false">&times;</span>
      <h3>扫描关注微信公众号</h3>
      <img src="@/assets/images/wechat-qrcode.png" alt="微信二维码">
      <p>扫码添加客服微信</p>
    </div>
  </div>

  <div v-if="showLoginModal" class="login-modal" @click.self="showLoginModal = false">
    <div class="modal-content">
      <span class="close" @click="showLoginModal = false">&times;</span>
      <div class="login-box">
        <div class="zem-logo">
          <img src="@/assets/images/ZEM.png" alt="zem-Logo">
        </div>
        
        <form @submit.prevent="login">
          <div class="input-group">
            <label>用户名</label>
            <input 
              v-model="loginForm.username" 
              type="text" 
              placeholder="Enter your username"
            >
          </div>
          <div class="input-group">
            <label>密码</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="Enter your password"
            >
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  data() {
    return {
      showWechatModal: false,
      showLoginModal: false,
      currentUser: localStorage.getItem('username') || '',
      loginForm: {
        username: '',
        password: ''
      },
      authState: {
        isAuthenticated: !!localStorage.getItem('token'),
        currentUser: localStorage.getItem('username') || ''
      }
    }
  },
  computed: {
    isAuthenticated() {
      return this.authState.isAuthenticated
    },
    currentUser() {
      return this.authState.currentUser
    }
  },
  methods: {
    async login() {
      try {
        console.log('登录信息',this.loginForm);
        const response = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm)
        })
        
        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('username', this.loginForm.username)

          this.authState = {
            isAuthenticated: true,
            currentUser: this.loginForm.username
          }
          
          this.showLoginModal = false
          this.loginForm = { username: '', password: '' }
        } else {
          alert('Invalid login')
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed')
      }
    },
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('username')

      this.authState = {
        isAuthenticated: false,
        currentUser: ''
      }
      
      this.showLoginModal = false
    }
  }
}
</script>

<style scoped>
@import '@/assets/stylesheets/style.css';
.site-header, 
.flat-top, 
.header {
  width: 100%;

.row {
  display: flex;
  gap: 10px;
}
}
.logo img:hover {
  transform: scale(1.05); 
}
.site-header {
  width: 100%;
  position: relative;
  z-index: 1000;
}

.flat-top {
  background: #000;
  color: #fff;
  padding: 10px 0;
  font-size: 14px;
}
.container {
  width:100%;
}
.flat-wrapper {
  width:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.custom-info span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon-contact {
  background-color: #ffcc00;
  color: #333;
  padding: 4px;
  border-radius: 3px;
  margin-right: 6px;
  vertical-align: middle;
  transition: all 0.2s;
}

.icon-address {
  background-color: #ffcc00;
  color: #333;
  padding: 4px;
  border-radius: 3px;
  margin-right: 6px;
  vertical-align: middle;
  transition: all 0.2s;
}

.social-links {
  display: flex;
  gap: 15px;
}

.header {
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.header-wrap {
  display: flex;
  align-items: center;
  width: 80px;
}

#logo {
  display: flex;
  align-items: center;
  height:100%;
}

#logo img {
  height: 70px !important;
  width: auto;
  object-fit: contain;
  align-self: center;
  margin: 0 !important;
  transition: all 0.3s;
}

.company-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  padding-left: 15px;
  border-left: 2px solid #32bfc0; /* 添加分隔线 */
  line-height: 1; /* 防止文字影响垂直居中 */
  margin-left: 15px;

  background: linear-gradient(to right, #1a2980, #26d0ce);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mainnav {
  display: flex;
  height: 100%;
  align-items: center;
}

.menu {
  display: flex;
  margin-right: 20px; /* 与右侧元素保持距离 */
}

.menu a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.menu a:hover {
  color: #32bfc0;
}

.menu-extra {
  margin-left: 20px;
}

.menu-extra ul {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-extra li {
  display: flex;
  align-items: center;
  height: 100%;
}

.search-box .fa-search {
  font-size: 18px;
  color: #333;
}

.login-btn {
  padding: 6px 16px;
  display: inline-flex;  
  align-items: center;   
  justify-content: center; 
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #32bfc0;
  border-radius: 20px;
  transition: all 0.3s;
  color: #32bfc0;
  text-decoration: none;
  height: 36px;
  
  background: transparent; 
}
   
.login-btn:hover {
  background: #32bfc0;
  color: white !important;
}

.login-btn a {
  padding: 5px 12px;
  display: inline-block;
  font-size: 13px;
  border: 1px solid #32bfc0;
  border-radius: 20px;
  transition: all 0.3s;
  color: #32bfc0;
  text-decoration: none;
}
   
.login-btn a:hover {
  background: #32bfc0;
  color: white !important;
}
     
.highlight-text {
   color: #32bfc0 !important;
   font-weight: 600;
   font-size: 14px;
   letter-spacing: 0.5px;
   position: relative;
   padding-right: 12px;   
}
   
.highlight-text::after {
   content: "";
   position: absolute;
   right: 0;
   top: 50%;
   transform: translateY(-50%);
   height: 16px;
   width: 1px;
   background: #ddd;   
}
     
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f8f8;
  padding: 6px 16px;
  border-radius: 20px;
  height: 36px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f0f0f0;
}

.flat-top {
  background: #000;
  padding: 8px 0;
}

.flat-wrapper {
  display: flex;
  flex-direction: column; 
  gap: 6px;
}

.contact-line {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.address-line {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.social-links {
  position: absolute;
  right: 15px;
  top: 8px;
  display: flex;
  gap: 12px;
}

/* 菜单栏高度压缩 */
.header {
  padding: 5px 0; 
}

.menu > li > a {
  padding: 4px 0; 
  font-size: 13px; 
}

.wechat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
}
.modal-content img {
  width: 200px;
  height: 200px;
  margin: 15px 0;
}

.modal-content h3 {
  color: #333;
  margin-bottom: 10px;
}

.modal-content p {
  color: #666;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close:hover {
  color: #333;
}

.login-box {
  margin-top: 20px;
}

.zem-logo {
  text-align: center;
  margin-bottom: 20px;
}

.zem-logo img {
  height: 60px;
  width: auto;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.logout-btn {
  display: inline-block;
  background: linear-gradient(to right, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 2px 5px; /* 增加左右内边距 */
  border-radius: 3px;
  transition: all 0.3s ease;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}

.logout-btn:hover {
  text-decoration: none;
  background: linear-gradient(to right, #c0392b, #e74c3c); /* 反转渐变方向 */
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: none;
}


.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background: #3367d6;
}

.user-info-wrapper {
  display: flex;
  align-items: center;
}

.user-container, .login-container {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 15px;
}

@media (max-width: 992px) {
  .company-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .company-name {
    font-size: 1rem;
  }
  #logo {
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .company-name {
    display: none;
  }
}
</style>