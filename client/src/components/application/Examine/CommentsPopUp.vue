<!--eslint-disable-->
<template>
    <v-card flat
            style="z-index: 11111; position: absolute; top: 165px; left: 25px;"
            class="expanded-info"
            v-if="showCommentsPopUp"
            width="350px">
      <v-container fluid p-1 ma-0>
        <v-layout mt-4>
          <v-flex lg8="!is_editing">
            <v-icon color="grey" class="mirrored fs-18 ml-3 mr-1">
              chat_bubble_outline
            </v-icon>
            {{ commentsCount }} Comments
          </v-flex>
          <v-flex lg4 text-right>
            <v-btn class="ma-0 pa-0"
                   flat
                   :ripple="false"
                   @click="toggleCommentsPopUp(false)">
              <v-icon :style="alignTop" color="light-blue">clear</v-icon>
              <span :style="alignTop" color="blue">Close
            </span>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-flex>
            <v-textarea class="comments-text-area"
                        no-resize
                        v-model="newComment" />
          </v-flex>
        </v-layout>
        <v-flex text-right c-link>
          <v-btn id="comments-cancel-button" flat :ripple="false" @click="clickCancel()">Cancel</v-btn>
          <v-btn id="comments-save-button" flat :ripple="false" @click="saveInfo">
            <b style="font-weight: 600">Save</b>
          </v-btn>
        </v-flex>
        <v-layout px-3 pb-2 mt-2 column style="overflow-y: scroll; max-height: 475px;">
          <template v-for="(comment, i) in comments">
            <v-flex fs-15>
              {{ comment.comment }}
            </v-flex>
            <v-flex fs-14 mt-2 ft-ital>
              {{ comment.examiner }} - {{ formatTime(comment.timestamp) }}
            </v-flex>
            <v-divider v-if="i < commentsCount - 1 " />
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
        top: `${-8}px`
      },
    }
  },
  computed: {
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
    cardClass() {
      let classes = ['base-info-card']
      this.is_editing ? classes.push('editing-info') : null
      this.showCommentsPopUp ? classes.push('expanded-info') : null
      return classes
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
    toggleCommentsPopUp(bool) {
      this.$store.commit('toggleCommentsPopUp', bool)
    },
    formatTime(d) {
      return moment(d).format('YYYY-MM-DD[,] h:mma')
    },
    saveInfo() {
      this.$store.dispatch('postComment')
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
    height: 80px;
  }
  .expanded-info {
    font-size: 15px;
    background-color: var(--xl-grey);
    border-radius: 0px !important;
    box-shadow: 0px 0px 6px 3px var(--grey) !important;
    margin-bottom: 10px !important;
  }
  .editing-info {
    z-index: 1000;
    font-size: 15px;
    background-color: var(--xl-grey);
    border-radius: 0px !important;
    outline: 4px solid var(--xl-grey);
  }

</style>
