<template>
  <div class="service-showcase">
    <div class="parallax-overlay"></div>
    <div class="container">
      <div class="imagebox-wrapper">

        <div class="imagebox-item" :style="{ 'margin-left': '300px' }">
          <div class="imagebox-hover">
            <img src="@/assets/images/imagebox/1.jpg" alt="Transport Service">
            <h5>Why choose canava transport?</h5>
            <div class="hover-content">             
              <p>At Canava Transport, we know time is of the essence...</p>
              <router-link class="read-more" to="/about">READ MORE <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </div>
        </div>

        <div class="imagebox-item">
          <div class="imagebox-hover">
            <img src="@/assets/images/imagebox/2.jpg" alt="Transport Service">
            <h5>Why choose canava transport?</h5>
            <div class="hover-content">           
              <p>At Canava Transport, we know time is of the essence...</p>
              <router-link class="read-more" to="/about">READ MORE <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </div>
        </div>

        <div class="imagebox-item" :style="{ 'margin-right': '300px' }">
          <div class="imagebox-hover">
            <img src="@/assets/images/imagebox/3.jpg" alt="Transport Service">
            <h5>Why choose canava transport?</h5>
            <div class="hover-content">             
              <p>At Canava Transport, we know time is of the essence...</p>
              <router-link class="read-more" to="/about">READ MORE <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceShowcase'
}
</script>

<style scoped>
.service-showcase {
  background: #000;
  width: 100%;
  padding: 60px 0;
  position: relative;
}

.parallax-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
}

.imagebox-wrapper {
  display: flex;
  justify-content: center;
  gap: 2%;
}

.imagebox-item {
  width: 30%;
  position: relative;
  transition: all 0.3s;
}

.imagebox-hover {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.imagebox-hover img {
  width: 100%;
  display: block;
  transition: transform 0.5s;
}

.imagebox-hover h5 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  margin: 0;
  background: rgba(0,0,0,0.7);
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  transition: transform 0.5s ease-out;
  transform: translateY(0);
  z-index: 2;
}

.hover-content {
  position: absolute;
  top: 100%; 
  left: 0;
  width: 100%;
  height: auto; 
  padding: 40px 20px; 
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  transition: transform 0.5s ease-out;
  z-index: 1;
}

.hover-content p {
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
}

.read-more {
  display: inline-flex;
  width: 120px;
  padding: 12px 13px;      
  background-color: #ffcc00;
  color: #000 !important;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  text-align: center;      
}

.read-more:hover {
  background-color: #fff;
}

.read-more i {
  margin-left: 8px;        
  transition: transform 0.3s;
}

.read-more:hover i {
  transform: translateX(3px);
}

.imagebox-item:hover h5 {
  transform: translateY(100%); 
}

.imagebox-item:hover .hover-content {
  transform: translateY(-100%);
}

.imagebox-item:hover img {
  transform: scale(1.05);
}
</style>