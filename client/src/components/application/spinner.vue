<!-- eslint-disable -->
<template>
  <div :class="classes">
    <div class="bounce1" />
    <div class="bounce2" />
    <div class="bounce3" />
  </div>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'spinner',
    data: function() {
      return {
      }
    },
    props: {
      className: String,
    },
    computed: {
      classes() {
        var classes = 'spinner';
        if (this.className) classes += ' ' + this.className;
        return classes;
      },
    },
  }
</script>

