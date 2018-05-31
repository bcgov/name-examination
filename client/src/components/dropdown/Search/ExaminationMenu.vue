/* eslint-disable */
<template>
  <div>
    <div>
      <div class="menu-sect">

      <div class="row">
        <div class="col-2">
          <!-- empty column to match preceding row -->
        </div>
        <div class="col">

          <!-- TODO - this is pagination structure but currently hardcoded -->
          <nav style="float: left;">
            <ul class="pagination">
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo; Previous</span>
                </a>
              </li>
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">Next &raquo;</span>
                </a>
              </li>
            </ul>
          </nav>


        </div>
        <div class="col-md-2">
          <button class="btn btn-sm btn-outline-danger" style="float: right;">
            Add Rejection Reason
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col"></div>
      </div>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ExaminationMenu',
    methods: {
    }
  }
</script>

<style scoped>

</style>
