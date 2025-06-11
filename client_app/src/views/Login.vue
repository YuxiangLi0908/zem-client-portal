<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-box">
        <div class="zem-logo">
          <img src="@/assets/images/ZEM.png" alt="zem-Logo">
        </div>
        
        <form @submit.prevent="login">
          <div class="input-group">
            <label>用户名</label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="Enter your username"
            >
          </div>
          <div class="input-group">
            <label>密码</label>
            <input 
              v-model="password" 
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
  data() {
    return {
      username: '',
      password: ''
    }
  },
  async login() {
    const response = await fetch('http://localhost:8000/login', {  //向后端发送用户名和密码的POST请求
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: this.password })
    })
    console.log('响应状态',response.status);
    if (response.ok) {  //如果认证成功，保存信息到localStorage
      const data = await response.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('username', this.username)
      this.$router.push('/home')
    } else {
      alert('Invalid login')
    }
  }
}
</script>

<style scoped>
/* 基础重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 全屏容器 */
.login-wrapper, .login-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 绝对定位确保全屏覆盖 */
.login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background: #f8f9fa url('@/assets/images/warehouse-bg.jpg') no-repeat center center;
  background-size: cover;
  /* 添加半透明遮罩提高文字可读性 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 主容器设置 */
.login-container {
  background-color: rgba(255, 255, 255, 0.9); /* 半透明白色背景 */
  backdrop-filter: blur(2px); /* 毛玻璃效果 */
  padding: 40px;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
}

/* 登录框样式 */
.login-box {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.zem-logo {
  text-align: center;
  margin-bottom: 25px;
  padding: 15px 0;
  position: relative;
}

.zem-logo img {
  height: 100px; /* 适当放大logo */
  width: auto;
  transition: all 0.3s ease; /* 添加悬停动画 */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.zem-logo::after {
  content: "";
  display: block;
  width: 60px;
  height: 3px;
  background: #4285f4; /* 使用主题色 */
  margin: 15px auto 0;
  border-radius: 3px;
  transition: all 0.3s ease;
}
.zem-logo:hover::after {
  width: 80px;
  background: #3367d6;
}


.login-box {
  background: transparent;
  box-shadow: none;
  padding: 0;
  margin-top: 10px; /* 与logo区域间距 */
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
  letter-spacing: 0.3px;
}
.input-group {
  margin-bottom: 22px;
  position: relative;
}
.input-group input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.3s;
  background-color: rgba(255,255,255,0.8);
}

.input-group input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}


/* 添加输入图标效果（可选） */
.input-group::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 38px;
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237f8c8d"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') no-repeat;
  opacity: 0.6;
}

.input-group:nth-child(2)::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237f8c8d"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4285f4;
}

button {
  width: 100%;
  padding: 12px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #3367d6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-box {
    padding: 30px 20px;
  }
}
.login-container {
  position: relative;
}
.login-container::before {
  content: "";
  background: url('@/assets/images/ZEM-watermark.png') no-repeat center;
  background-size:70%;
  opacity: 0.08;
  position: absolute;
  top: -220px;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
</style>