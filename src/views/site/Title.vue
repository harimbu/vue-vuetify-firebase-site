<template>
  <v-toolbar-title class="pl-2">
    {{title}}
    <v-btn color="success" icon @click="openDialog"><v-icon v-show="$store.state.user">mdi-pencil</v-icon></v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>사이트 타이틀 수정</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="타이틀" v-model='text' @keyup.enter="save" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-toolbar-title>
</template>
<script>
export default {
  props: ['title'],
  data () {
    return {
      dialog: false,
      text: this.title
    }
  },
  methods: {
    openDialog () {
      this.dialog = true
      this.text = this.title
    },
    async save () {
      try {
        await this.$fire.database().ref('site').update({
          title: this.text
        })
      } finally {
        this.dialog = false
      }
    }
  }
}
</script>
