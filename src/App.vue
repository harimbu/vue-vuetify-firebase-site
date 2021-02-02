<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" width="360">
      <v-card class="text-center my-10" flat>
        <v-card-text>
          <v-avatar color="red white--text subtitle-1" size="80">who?</v-avatar>
        </v-card-text>
        <v-card-text>
          <div class="title">하림부</div>
          <div class="caption">firebase 사용하기</div>
        </v-card-text>
      </v-card>
      <Menu :items="site.items" />
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-app-bar-nav-icon @click="drawer=!drawer" />
      <Title :title="site.title" />
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-account</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Title from '@/views/site/Title'
import Menu from '@/views/site/Menu'
export default {
  name: 'App',
  components: { Title, Menu },
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
