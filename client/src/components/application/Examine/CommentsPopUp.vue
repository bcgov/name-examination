<!--eslint-disable-->
<template>
    <v-card flat
            class="expanded-info">
      <v-container fluid pa-2 ma-0>
        <v-layout justify-space-between my-2>
          <v-flex shrink>
            <v-icon color="grey" class="mirrored fs-18 ml-3 mr-1">
              chat_bubble_outline
            </v-icon>
            {{ commentsCount }} Comments
          </v-flex>
          <v-flex shrink>
            <v-btn class="ma-0 pa-0"
                   flat
                   @click="toggleCommentsPopUp(false)">
              <v-icon :style="alignTop" color="light-blue">clear</v-icon>
              <span :style="alignTop" color="blue">Cl<span class="shortkey">o</span>se
            </span>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-flex shrink>
            <v-textarea class="comments-text-area"
                        ref="commentstextarea"
                        :rows="8"
                        no-resize
                        v-model="newComment" />
          </v-flex>
        </v-layout>

        <v-layout justify-end>
          <v-flex shrink c-link>
            <v-btn id="comments-cancel-button" flat @click="clickCancel()">Cancel</v-btn>
          </v-flex>
          <v-flex shrink c-link>
            <v-btn id="comments-save-button" flat :disabled="saveButtonDisabled" @click="saveInfo">
              <b style="font-weight: 600">Sa<span class="shortkey">v</span>e</b>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout px-3 pb-2 mt-2 column class="comments-display">
          <template v-for="(comment, i) in comments">
            <v-flex fs-15 comment-text>
              {{ comment.comment }}
            </v-flex>
            <v-flex fs-14 mt-1 ft-ital>
              {{ comment.examiner }} - {{ formatTime(comment.timestamp) }}
            </v-flex>
            <v-flex my-2>
              <v-divider v-if="i < commentsCount - 1 " />
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
  import moment from 'moment'

  export default {
    name: 'CommentsPopUp',
    data() {
      return {
        alignTop: {
          position: 'relative',
          top: '-8px'
        },
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.$el.scrollIntoViewIfNeeded()
        if (this.$refs.commentstextarea) {
          this.$refs.commentstextarea.focus()
        }
      })
    },
    computed: {
      cardClass() {
        let classes = ['base-info-card']
        this.is_editing ? classes.push('editing-info') : null
        this.showCommentsPopUp ? classes.push('expanded-info') : null
        return classes
      },
      comments() {
        function compareDateTime(b,a) {
          if (moment(a.timestamp).unix() < moment(b.timestamp).unix() ) return -1
          if (moment(a.timestamp).unix() > moment(b.timestamp).unix() ) return 1
          return 0
        }
        if (this.$store.getters.internalComments && this.$store.getters.internalComments.length > 0) {
          return this.$store.getters.internalComments.sort(compareDateTime)
        }
        return []
      },
      commentsCount() {
        if (this.comments && this.comments.length > 0) {
          return this.comments.length
        }
        return 0
      },
      commentsStyle() {
        return {
          maxHeight: `${this.innerHeight - 300}px`,
          minHeight: `${300}px`
        }
      },
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      newComment: {
        get() {
          if (this.$store.state.newComment) {
            return this.$store.state.newComment
          }
          return ''
        }, set(e) {
          this.$store.commit('setNewComment', e)
        }
      },
      saveButtonDisabled() {
        if (this.newComment && this.newComment.length > 0) {
          return false
        }
        return true
      },
      showCommentsPopUp() {
        if (this.$store.state.showCommentsPopUp) {
          return this.$store.state.showCommentsPopUp
        }
        return false
      },
    },
    methods: {
      clickCancel() {
        this.newComment = ''
        this.toggleCommentsPopUp(false)
      },
      formatTime(d) {
        return moment(d).format('YYYY-MM-DD[,] h:mma')
      },
      saveInfo() {
        this.$store.dispatch('postComment')
      },
      toggleCommentsPopUp(bool) {
        this.$store.commit('toggleCommentsPopUp', bool)
      },
    }
  }
</script>

<style scoped>
  #comments-save-button {
    margin: 0px 0px 0px -20px;
    padding: 0px;
    color: var(--link);
  }
  #comments-cancel-button {
    margin: 0px;
    padding: 0px;
    color: var(--link);
  }

  ws-pre {
    white-space: pre-line !important;
  }

  top-less-10 {
    position: relative !important;
    top: -10px !important;
    padding: 0px !important;
    margin: 0px !important;
  }

  .comments-text-area {
    margin-left: auto;
    margin-right: auto;
    padding-top: 0px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: white;
    border: 1px solid var(--l-grey);
    width: 320px;
  }

  .shortkey {
    text-decoration: underline;
  }

  .expanded-info {
    font-size: 15px;
    background-color: var(--xl-grey);
    border-radius: 0px !important;
    box-shadow: 0px 0px 6px 3px var(--grey) !important;
    margin-bottom: 10px !important;
    z-index: 11111;
    position: absolute;
    top: 165px;
    left: 25px;
    max-width: 350px;
  }

  .comments-display {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 425px;
  }

  .comment-text {
    white-space: pre-line;
    overflow-wrap: break-word !important;
  }

  .editing-info {
    z-index: 1000;
    font-size: 15px;
    background-color: var(--xl-grey);
    border-radius: 0px !important;
    outline: 4px solid var(--xl-grey);
  }
</style>
