<!--eslint-disable-->
<template>
  <div class="container-fluid">
    <nav class="navbar fixed-top navbar-dark navbar-expand-lg"
         style="background-color: #041978;">
      <a class="navbar-brand" href="#">
        <img src="static/images/gov3_bc_logo.png"
             alt="Province of British Columbia"
             title="Province of British Columbia logo"/>
      </a>
      <button class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="/home" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/nameExamination" id="nameExamine" class="nav-link">Examine Names</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/find" class="nav-link">Search</router-link>
          </li>
          <!--<li class="nav-item active">
            <router-link to="/settings" class="nav-link">Settings</router-link>
          </li>-->
          <li class="nav-item active" v-if="!auth">
            <router-link to="/signin" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item active" v-if="auth">
            <button @click="onLogout" class="nav-link btn-outline-dark"
                    style="background-color: #041978;">Logout
            </button>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0" @submit.prevent="onSubmit">
          <input class="form-control mr-sm-2" type="search"
                 placeholder="NR Number" aria-label="Search" v-model="nrNum">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Load</button>
        </form>
        <p class="navbar-text">&nbsp;{{userId }}</p>
      </div>
    </nav>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "std-header",
    data () {
      return {
        nrNum: ''
      }
    },
    computed: {
      userId() {
        return this.$store.getters.userId
      },
      auth() {
        return this.$store.getters.isAuthenticated
      },
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
        window.location.assign("/");
      },
      onSubmit() {
        console.log('Set new NR number')
        this.$store.dispatch('newNrNumber',this.nrNum)
        const path = '/nameExamination'
        console.log('re-direct to ' + path)
        this.$router.push(path)
      }
    }
  }
</script>

<style scoped>

</style>
