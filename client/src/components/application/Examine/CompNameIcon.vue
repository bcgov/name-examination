<!--eslint-disable-->
<template>
  <v-icon v-if="state"
          :style="setup.style"
          :class="setup.class">{{ setup.icon }}
  </v-icon>
</template>

<script>
  export default {
    name: 'CompNameIcon',
    props: [ 'state' ],
    computed: {
      setup() {
        let output = {
          class: '', icon: '', style: ''
        }
        if (this.state === 'REJECTED') {
          output.class = 'c-priority fs-18'
          output.icon = 'clear'
          output.style = {
            position: 'relative', top: '-2px',
          }
        }
        if (this.state === 'APPROVED' || this.state === 'CONDITION') {
          output.class = 'c-cyan fs-20'
          output.icon = 'done'
          output.style = {
            position: 'relative', top: '-2px',
          }
        }
        return output
      }
    },
  }
</script>
