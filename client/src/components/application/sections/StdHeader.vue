<!--eslint-disable-->
<template>
  <div class="container-fluid">
    <nav class="navbar fixed-top navbar-dark navbar-expand-lg">
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

      <!-- MENU WHEN LOGGED IN -->
      <div v-if="auth" class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="/home" class="nav-link" id="header-home-link">Home</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/nameExamination" id="nameExamine" class="nav-link">Examine Names</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/find" class="nav-link" id="header-search-link">Search</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0 mr-auto" @submit.prevent="onSubmit">
          <input id="header-search-input" class="form-control mr-sm-2" type="search"
                 placeholder="NR Number" aria-label="Search" v-model="nrNum">
          <button id="header-search-button" class="btn btn-outline-success my-2 my-sm-0"
                  type="submit">Load</button>
        </form>


        <div class="nav-item">
          <p id="userid" class="navbar-text active">{{ userId }}</p>
          <button id="header-logout-button" @click="onLogout" class="btn btn-sm">Logout</button>
        </div>

      </div>

      <!-- MENU WHEN LOGGED OUT  -->
      <div v-else class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-text mr-auto">&nbsp;</div><!-- empty, for spacing -->
        <router-link tag="button" id="header-login-button" to="/signin" class="btn btn-sm">Login</router-link>
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
        if(this.nrNum!='') {
          var myNum = this.nrNum.toUpperCase().trim();
          if (myNum.includes('NR')) {
            if (!myNum.includes('NR ')) {
              myNum = myNum.replace('NR', 'NR ')
            }
          } else {
            myNum = 'NR ' + myNum
          }
          console.log('Set new NR number to:' + myNum)
          this.$store.dispatch('newNrNumber', myNum)
          this.nrNum = ''
          this.$router.push('/nameExamination')
        }
      }
    }
  }
</script>

<style scoped>

  .navbar {
    background-color: #003366;
  }

  #userid {
    color: white;
  }

  #header-login-button, #header-logout-button {
    background-color: white;
    color: #003366;
  }

  #header-logout-button {
    margin-left: 10px;
  }

  #header-search-button {
    border-color: #1a5a96;
    color: white;
  }
  #header-search-button:hover {
    border-color: #1a5a96;
    background-color: #1a5a96;
  }

</style>
