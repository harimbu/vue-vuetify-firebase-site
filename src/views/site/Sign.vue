<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" color="primary">
        <v-icon  v-if="!$store.state.user">mdi-account</v-icon>
        <v-avatar size="36" color="red" v-else>
          <img :src="$store.state.user.photoURL" />
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-actions class="pa-1" v-if="!$store.state.user">
        <v-btn depressed small color="primary" @click="signInGoogle"><v-icon small left>mdi-google</v-icon>로그인</v-btn>
      </v-card-actions>

      <v-card-actions class="pa-1" @click="signOut" v-else>
        <v-btn depressed small block color="grey darken-4 white--text">로그아웃</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  methods: {
    signInGoogle () {
      const provider = new this.$fire.auth.GoogleAuthProvider()
      this.$fire.auth().languageCode = 'ko'
      this.$fire.auth().signInWithPopup(provider)
    },
    signOut () {
      this.$fire.auth().signOut()
    }
  }
}
</script>
