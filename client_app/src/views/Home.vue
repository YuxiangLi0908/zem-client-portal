<template>
  <div>
    <h1>Welcome to the User Home Page</h1>
    <p>Logged in as: {{ username }}</p>
    <p>User info: {{ user }}</p>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      username: localStorage.getItem('username') || 'Unknown',
      user: JSON.parse(localStorage.getItem('user'))
    }
  }
}
</script>
