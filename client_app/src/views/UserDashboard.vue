<template>
  <div>
  <h2>Your Orders</h2>
  <p>User info: {{ user }}</p>
  </div>
  <div v-if="error">{{ error }}</div>
  <div v-else>
    <ul>
    <li v-for="order in orders" :key="order.id">
      {{ order.product_name }} - {{ order.status }}
    </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      error: null
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        this.error = data.detail || 'Unauthorized'
        return
      }
      this.orders = data
    } catch (e) {
      console.error("Network error:", e)
      this.error = 'Failed to fetch orders.'
    }
  }
}
</script>
