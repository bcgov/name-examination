<!--eslint-disable-->
<template>
  <div class="container-fluid">
    <nav class="navbar fixed-top navbar-dark navbar-expand-lg" id="header-main">

      <router-link to="/home" class="navbar-brand router-link-never-mark-active">
        <img src="static/images/gov3_bc_logo.png"
             alt="Province of British Columbia"
             title="Province of British Columbia logo"/>
        Namex
      </router-link>
      <button class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- logged in -->
      <div v-if="auth" class="collapse navbar-collapse" id="navbarSupportedContent">

        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <span id="userid" class="nav-link">{{ userId }}</span>
          </li>
          <li class="navbar-text divider">|</li>
          <li class="nav-item">
            <a id="header-logout-button" href="#" @click="onLogout" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>

      <!-- not logged in -->
      <div v-else class="collapse navbar-collapse" id="navbarSupportedContent">
        <router-link tag="button" id="header-login-button" to="/signin" class="btn btn-sm ml-auto">Login</router-link>
      </div>

      <!-- SECONDARY MENU -->
      <div v-if="auth" class="navbar fixed-top" id="secondary-menu">

        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a target="_blank" href={{ adminURL }} id="admin" class="nav-link">Admin</a>
          </li>
          <li v-if="userCanExamine" class="navbar-text divider">|</li>
          <li v-if="userCanExamine" class="nav-item">
            <router-link to="/nameExamination" id="nameExamine" class="nav-link">Examine Names</router-link>
          </li>
          <li class="navbar-text divider">|</li>
          <li class="nav-item">
            <router-link to="/find" class="nav-link" id="header-search-link">Search</router-link>
          </li>
          <li class="navbar-text divider">|</li>
          <li class="nav-item">
            <form class="form-inline" id="header-search-form" @submit.prevent="onSubmit">
              <input id="header-search-input" class="form-control mr-sm-2" type="search"
                     placeholder="NR Number" aria-label="Search" v-model="nrNum">
              <button id="header-search-button" class="btn btn-outline-success my-2 my-sm-0"
                      type="submit">Load</button>
            </form>
          </li>
        </ul>

        <router-link to="/stats" class="nav-link ml-auto">Stats</router-link>

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
      userCanExamine() {
        return this.$store.getters.userHasApproverRole
      },
      adminURL() {
        return this.$store.getters.adminURL
      }
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
    padding-left: 40px;
  }

  .navbar-brand img {
    margin-top: -13px; /* bump the image up, since it's got white/blue space in the image itself that
                          adds artificial padding */
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 5px;
  }

  .nav-link {
    color: white !important;
  }


  #header-login-button {
    background-color: white;
    color: #003366;
  }

  #secondary-menu {
    height: 50px;
    background-color: #38598a;
    color: white;
    margin-top: 69px;
    box-shadow: 0px 5px 10px 0px rgba(169,169,169,1);
    font-size: 15px;
    line-height: 23px;
  }

  #secondary-menu .divider {
    color: #7597d6;
  }

  #header-search-button {
    border-color: #003366;
    color: white;
    padding-top: 3px;
    padding-bottom: 3px;
  }
  #header-search-button:hover {
    border-color: #003366;
    background-color: #1a5a96;
  }

  #header-search-form {
    padding-right: .5rem;
    padding-left: .5rem;
  }

</style>
