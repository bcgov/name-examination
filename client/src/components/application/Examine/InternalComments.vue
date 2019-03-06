<!--eslint-disable-->
<template>
  <span v-if="layout_decision">
    <div class="row">
      <div class="col add-top-padding">
        <h3>INTERNAL COMMENTS</h3>
        <textarea v-model="newComment" class="form-control" id="decision-new-comment-textarea"
                  rows="5"></textarea>
      </div>
      <div class="col">
        <div class="comment" v-for="comment in internalComments"
             v-bind:key="comment.id">
          <p>
            <span class="comment-examiner">{{ comment.examiner }}</span>
            -
            <span class="comment-timestamp">{{ new Date(comment.timestamp).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'}) }}</span>
          </p>
          <p class="comment-text">{{ comment.comment }}</p>

        </div>
      </div>
    </div>
  </span>

  <span v-else-if="layout_details">

  </span>

  <span v-else></span>

</template>

<script>
/* eslint-disable */

  export default {
    name: "InternalComments",
    props: [
      'layout'
    ],
    data: function () {
      return {
        newComment: null,
      }
    },
    computed: {
      layout_decision() {
        if (this.layout == 'decision') return true;
        else return false;
      },
      layout_details() {
        if (this.layout == 'details') return true;
        else return false;
      },
      internalComments: {
        get: function () {
          return this.$store.getters.internalComments;
        },
        set: function (value) {
          this.$store.commit('internalComments', value);
        }
      },
      currentNameObj: {
        get: function () {
          return this.$store.getters.currentNameObj;
        },
        set: function (value) {
          this.$store.dispatch('currentNameObj', value);
        }
      },
    },
    methods: {
      addNewComment() {
        console.log('got here to addNewComment() in InternalComments component');

        // do nothing if comment is blank
        if (this.newComment == '' || this.newComment == null) return;

        // create new comment object with just text, and add it to list of comments in data structure
        var newCommentData = {
          comment: this.newComment,
          examiner: this.$store.state.examiner
        };
        // add to list of comments (effects display only)
        this.internalComments = this.internalComments.concat(newCommentData);

        // add to name record, to be sent to API
        this.currentNameObj.comment = newCommentData;
      }

    }
  }
</script>

<style scoped>

  .comment {
    padding: 10px 0px;
    border-bottom: 1px solid #ccc;
  }
  .comment:last-child {
    border-bottom: none;
  }

  .comment-text {
    white-space: pre-line;
  }

  .comment-timestamp, .comment-examiner {
    font-style: italic;
  }


</style>
