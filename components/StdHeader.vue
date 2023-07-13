<template>
  <nav class="flex bg-white shadow-2xl font-medium h-20 text-lg">
      <div class="flex min-w-full">
        
          <div class="image">
              <img src="../public/images/top-nav.png" alt="Name Examination" class="h-full">
          </div>

          <div class="flex gap-24 mt-6 text-blue-800" v-if="this.auth">
              <a href="" class="ml-16 text-2xl" >Admin</a>
              <a href="" class="text-2xl">Examine</a>
              <a href="" class="text-2xl"><nuxt-link to="/search">Search</nuxt-link></a>
          </div>

          <div class="flex ml-auto" v-if="this.auth">

            <form class="flex items-center">   
              <label for="allowWordClassificationModal" class="sr-only">NR Number Lookup</label>
              <div class="relative w-full">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg aria-hidden="true" class="w-7 h-7 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                  </div>
                  <input type="text" id="allowWordClassificationModal" class="w-72 h-14 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-lg" placeholder="NR Number Lookup" required>
              </div>
              <button type="submit" class="p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <img src="../public/images/searchbutton.png" alt="" class="h-8 w-9">
              </button>
             </form>

             <span class="mt-7 mx-12 underline">Stats</span>
             
            <label class="relative inline-flex items-center cursor-pointer mt-2">
              <input type="checkbox" value="" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:left-[2px] after:top-[25px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span class="ml-3 font-medium text-gray-500 dark:text-gray-300">Classify Words</span>
            </label>

            <span class="flex mt-7 mx-10 text-gray-800">mkapoor@idir</span>

            <div class="divider"></div>

            <div class="mx-10 mt-7 text-blue-800">
              <a href="">Log Out</a>
             </div>
          </div>

          <div class="flex ml-auto mx-10 mt-7 text-blue-800" v-if="!this.auth">
              <a href="">Login</a>
             </div>

      </div>
  </nav>
</template>

<script>
export default{
  data(){
    return{
      auth: true
    }
  },
  computed:{

  }
}
</script>