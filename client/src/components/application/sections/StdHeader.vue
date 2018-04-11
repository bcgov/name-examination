/* eslint-disable */
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
            <router-link to="/mainPage" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#" id="navbarDropdown"
               role="button"
               data-toggle="dropdown"
               aria-haspopup="true"
               aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link to="/searchresults" class="dropdown-item">Search Results</router-link>
              <a class="dropdown-itePm" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
          <li class="nav-item active">
            <router-link to="/settings" class="nav-link">Settings</router-link>
          </li>
          <li class="nav-item active" v-if="!auth">
            <router-link to="/signup" class="nav-link">Sign Up</router-link>
          </li>
          <li class="nav-item active" v-if="!auth">
            <router-link to="/signin" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item active" v-if="auth">
            <button @click="onLogout" class="nav-link btn-outline-dark"
                    style="background-color: #041978;">Logout
            </button>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search"
                 placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <p class="navbar-text">&nbsp;{{email}}</p>
      </div>
    </nav>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "std-header",
    computed: {
      email() {
        return this.$store.getters.email
      },
      auth() {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style scoped>

</style>
