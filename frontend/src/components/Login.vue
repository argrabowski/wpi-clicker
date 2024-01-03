<template>
  <div>
    <h2 class="text-center">Login</h2>
    <div class="input-group input-group-lg">
      <span class="input-group-text" id="inputGroup-sizing-lg">Name</span>
      <input v-model="username" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
    </div>
    <button v-on:click="login" v-bind:disabled="buttonClicked || username.trim().length < 1" type="button" class="btn btn-primary mt-1 w-100">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function() {
    return {
      username: '',
      buttonClicked: false
    }
  },
  methods: {
    login() {
      this.buttonClicked = true
      this.$socket.emit('login', this.username)
    }
  }
};
</script>