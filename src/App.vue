<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" width="360">
      <v-card class="text-center my-10" flat>
        <v-card-text>
          <v-avatar size="80" v-if="$store.state.user">
            <img :src="$store.state.user.photoURL" />
          </v-avatar>
          <v-avatar v-else color="red white--text subtitle-1" size="80">?</v-avatar>
        </v-card-text>
        <v-card-text v-if="$store.state.user">
          <div class="title">{{$store.state.user.displayName}}</div>
          <div class="caption">{{$store.state.user.email}}</div>
        </v-card-text>
        <v-card-text v-else>
          <div class="title">who</div>
          <div class="caption">firebase 사용하기</div>
        </v-card-text>
      </v-card>
      <Menu :items="site.items" />
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer=!drawer" />
      <Title :title="site.title" />
      <v-spacer></v-spacer>
      <Sign />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Title from '@/views/site/Title'
import Menu from '@/views/site/Menu'
import Sign from '@/views/site/Sign'
export default {
  name: 'App',
  components: { Title, Menu, Sign },
  data () {
    return {
      drawer: null,
      site: {
        title: '파이어베이스',
        items: [
          {
            icon: 'mdi-home',
            items: [
              { title: '소개', to: '/' }
            ],
            title: '홈'
          },
          {
            icon: 'mdi-clock-time-three',
            items: [
              { title: '아침', to: '/a' },
              { title: '점심', to: '/b' },
              { title: '저녁', to: '/c' }
            ],
            title: '시간'
          },
          {
            icon: 'mdi-chat',
            items: [
              { title: '게시판-1', to: '/bbs1' },
              { title: '게시판-2', to: '/bbs2' }
            ],
            title: '게시판'
          }
        ]
      }
    }
  },
  created () {
    this.subscribe()
  },
  methods: {
    async subscribe () {
      await this.$fire.database().ref().child('site').on('value', sn => {
        const v = sn.val()
        if (!v) {
          this.$fire.database().ref().child('site').set(this.site)
        } else {
          this.site = v
        }
      })
    }
  }
}
</script>
