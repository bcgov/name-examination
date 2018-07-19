<!--eslint-disable-->
<template>
  <span>
    <div class="row">

      <!-- details col 1 - priority, comments, etc -->
      <div id='div1' class="col-md-5" >
        <div class="row">
          <div class="col-md-4" style="height: 30px;">
            <div class="priority" v-if="priority">Priority</div>
          </div>
          <div class="col">
            <p v-if="!is_editing" style="font-weight: bold;">{{ requestType_desc }}</p>
            <select v-else v-model="requestType" class="form-control">
              <option v-for="option in requestType_options" v-bind:value="option.value"
                      v-bind:key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4" >
            <div class="nrNum" v-bind:class="{ REDnrNum: priority}">{{ nrNumber }}</div>
            <p v-if="!is_editing"
               style="font-weight: bold; text-align: center;">{{ jurisdiction_desc }}</p>
          </div>
          <div class="col">
            <nwpta jurisdiction="AB" />
          </div>
          <div class="col">
            <nwpta jurisdiction="SK" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-4" >
            <!-- spacer -->
          </div>
          <div class="col add-top-padding" >
            <h3 v-if="is_editing">Jurisdiction</h3>
            <select v-if="is_editing" v-model="jurisdiction" class="form-control">
              <option v-for="option in jurisdiction_options" v-bind:value="option.value"
                      v-bind:key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col add-top-padding">
            <div v-if="show_extended_header">
              <div>
                <h3>INTERNAL COMMENTS</h3>
                <div class="comment" v-for="comment in internalComments"
                     v-bind:key="comment.timestamp">
                  <p>
                    <span class="comment-examiner">{{ comment.examiner }}</span>
                    -
                    <span class="comment-timestamp">{{ comment.timestamp }}</span>
                  </p>
                  <p class="comment-text">{{ comment.comment }}</p>

                </div>
              </div>
              <div v-if="is_editing">
                <h3>add comment</h3>
                <textarea v-model="newComment" class="form-control" rows="5"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- details col 2 - nature of business -->
      <div id='div2' class="col-md-4">
        <div class="row">
          <div class="col">
            <h3>SUBMITTED DATE</h3>
            {{submittedDate}}

            <h3 v-if="expiryDate !== null">EXPIRY DATE</h3>
            <span v-if="expiryDate !== null">{{expiryDate}}</span>

            <h3 v-if="consumptionDate !== null">CONSUMPTION DATE</h3>
            <span v-if="consumptionDate !== null">{{consumptionDate}}</span>

            <h3 v-if="submitCount > 0">SUBMIT COUNT: {{submitCount}}</h3>

            <h3>NATURE OF BUSINESS</h3>
            <div v-if="show_extended_header">
              <textarea v-if="is_editing" v-model="natureOfBusiness" class="form-control" rows="10">
                </textarea>
              <p v-else style="white-space: pre-line;">{{ natureOfBusiness }}</p>
            </div>
            <p v-else style="white-space: pre-line;">{{ natureOfBusinessTruncated }}</p>

          </div>

        </div>
        <div class="row" v-if="is_editing">
          <div class="col add-top-padding">
            <h3>Name Choices</h3>

            <table style="width: 100%;">
              <tr>
                <td>1.</td>
                <td><input v-model="compName1.name" class="form-control" /></td>
              </tr>
              <tr>
                <td>2.</td>
                <td><input v-model="compName2.name" class="form-control" /></td>
              </tr>
              <tr>
                <td>3.</td>
                <td><input v-model="compName3.name" class="form-control" /></td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- details col 3 - additional info, client details -->
      <div id='div3' class="col-md-3">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <h3>ADDITIONAL INFORMATION</h3>
                <p v-if="!is_editing" style="white-space: pre-line;">{{ additionalInfo }}</p>
                <textarea v-else v-model="additionalInfo" class="form-control"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col add-top-padding">
                <clientinfoview />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- row 2 - buttons -->
    <div class="row">
      <div id='header-button-container' class="col-md-12">

        <button v-if="!is_editing" class="f1 btn btn-sm btn-outline-secondary"
                @click="toggleDetails">Show Details</button>

        <button v-if="!is_editing" class="btn btn-sm btn-secondary"
                style="float: left;" @click="edit">Edit</button>

        <button v-if="is_editing" class="btn btn-sm btn-success"
                style="float: left;" @click="save">Save</button>
        <button v-if="is_editing" class="btn btn-sm btn-secondary"
                style="float: left;" @click="cancelSave">Cancel</button>

      </div>
    </div>

  </span>
</template>

<script>
/* eslint-disable */

// ClientInfoHeader - editable component
import clientinfoview from '@/components/application/Examine/client/ClientInfoHeader.vue';
import nwpta from '@/components/application/Examine/nwpta/nwpta.vue';

export default {
    name: 'RequestInfoHeader',
    data: function () {
      return {
        newComment: null,
      }
    },
    computed: {
      jurisdiction_options() {
        return this.$store.getters.listJurisdictions;
      },
      requestType_options() {
        return this.$store.getters.listRequestTypes;
      },
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      show_extended_header() {
        return this.is_editing || this.$store.state.is_header_shown;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      compName1: {
        get: function() {
          return this.$store.getters.compName1;
        },
        set: function(value) {
          this.$store.commit('compName1', value);
        }
      },
      compName2: {
        get: function() {
          return this.$store.getters.compName2;
        },
        set: function(value) {
          this.$store.commit('compName2', value);
        }
      },
      compName3: {
        get: function() {
          return this.$store.getters.compName3;
        },
        set: function(value) {
          this.$store.commit('compName3', value);
        }
      },
      requestType: {
        get: function() {
          return this.$store.getters.requestType;
        },
        set: function(value) {
          this.$store.commit('requestType', value);
        }
      },
      requestType_desc() {
        try {
          return getDescFromList(this.requestType_options, this.requestType);
        } catch (err) {
          return 'ERROR!!';
        }
      },
      jurisdiction: {
        get: function() {
          return this.$store.getters.jurisdiction;
        },
        set: function(value) {
          this.$store.commit('jurisdiction', value);
        }
      },
      jurisdiction_desc() {
        try {
          return getDescFromList(this.jurisdiction_options, this.jurisdiction);
        } catch (err) {
          return '';
        }
      },
      natureOfBusiness: {
        get: function() {
          return  this.$store.getters.natureOfBusiness;
        },
        set: function(value) {
          this.$store.commit('natureOfBusiness', value);
        }
      },
      natureOfBusinessTruncated() {
        try {
          if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
          else return this.natureOfBusiness;
        } catch (err) {
          return this.natureOfBusiness;
        }
        if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
        else return this.natureOfBusiness;
      },
      nr_status: {
        get: function() {
          return this.$store.getters.nr_status;
        },
        set: function(value) {
          this.$store.commit('nr_status', value);
        }
      },
      examiner() {
        return this.$store.getters.examiner;
      },
      priority() {
        return this.$store.getters.priority;
      },
      resubmissionYN: {
        get: function() {
          return this.$store.getters.resubmissionYN;
        },
        set: function(value) {
          this.$store.commit('resubmissionYN', value);
        }
      },
      linkedNR: {
        get: function() {
          return this.$store.getters.linkedNR;
        },
        set: function(value) {
          this.$store.commit('linkedNR', value);
        }
      },
      reservationCount: {
        get: function() {
          return this.$store.getters.reservationCount;
        },
        set: function(value) {
          this.$store.commit('reservationCount', value);
        }
      },
      details: {
        get: function() {
          return this.$store.getters.details;
        },
        set: function(value) {
          this.$store.commit('details', value);
        }
      },
      additionalInfo: {
        get: function() {
          return this.$store.getters.additionalInfo;
        },
        set: function(value) {
          this.$store.commit('additionalInfo', value);
        }
      },
      internalComments: {
        get: function() {
          return this.$store.getters.internalComments;
        },
        set: function(value) {
          this.$store.commit('internalComments', value);
        }
      },
      expiryDate() {
        return this.$store.getters.expiryDate;
      },
      consumptionDate() {
        return this.findConsumptionDate();
      },
      submittedDate() {
        return this.$store.getters.submittedDate;
      },
      submitCount() {
        return this.$store.getters.submitCount;
      },
    },
    components: {
      clientinfoview,
      nwpta,
    },
    methods: {
      toggleDetails() {
        if (this.$store.state.is_header_shown) this.$store.state.is_header_shown = false;
        else this.$store.state.is_header_shown = true;
      },
      edit() {
        this.$store.state.is_editing = true;
      },
      save() {

        // save new comment
        this.addNewComment();

        this.$store.dispatch('updateRequest');
        this.$store.state.is_editing = false;

        // get updated data fresh from server
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)

        // show full header after editing so user can see everything they changed
        this.$store.state.is_header_shown = true;

      },
      cancelSave() {
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)
        this.$store.state.is_editing = false;
      },
      addNewComment() {

        // create new comment object with just text, and add it to list of comments in data structure
        var newCommentData = {
          comment: this.newComment,
          examiner: this.$store.state.examiner
        };
        this.internalComments = this.internalComments.concat(newCommentData);

        // clear newComment field for next comment added in this session
        this.newComment = null;
      },
      findConsumptionDate() {
        if (this.compName1.consumptionDate != null) {
          return this.compName1.consumptionDate;
        }
        if (this.compName2.consumptionDate != null) {
          return this.compName2.consumptionDate;
        }
        return this.compName3.consumptionDate;
      }
    },
    watch: {
      nrNumber: function (val) {
        console.log('RequestInfoHeader.nrNumber watcher fired:' )
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)
        if( this.$store.getters.currentChoice == null || this.$store.getters.currentChoice == 1 ){
          console.log('RequestInfoHeader.watch runRecipe:' + val)
          this.$store.dispatch('runRecipe')
        } else {
          console.log('RequestInfoHeader.watch set currentChoice to 1')
          this.$store.commit('currentChoice',1)
        }
      }
    }
}
</script>

<style scoped>

   .nrNum {
     font-size: 1.5em;
     font-weight: bold;
     text-align: center;
     margin-top: 10px;
   }
  .REDnrNum {
    color: #ff0000;
  }
  .priority {
    padding: 5px;
    text-align: center;
    background-color: #cc0000;
    color: white;
  }

  #header-button-container button {
    margin: 5px 5px 5px 0;
  }
  #header-button-container .f1 {
    float: right;
    margin-right: 0;
  }

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
