<template>
  <div class="board">
    <h3 class="subtitle-1 mb-3">파이어스토어 게시판</h3>

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :options.sync="options"
      :server-items-length="serverItemsLength"
      must-sort
    >
      <template v-slot:[`item.id`]="{ item }">
        <v-btn icon @click="openDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="remove(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        {{ item.createdAt }}
      </template>
    </v-data-table>

    <v-card flat class="my-5">
      <v-btn depressed color="primary" class="mr-2" @click="openDialog(null)">Write</v-btn>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card class="pt-5">
        <v-card-text>
          <v-text-field v-model='form.title' label="제목" />
          <v-text-field v-model='form.content' label="내용" />
          <v-btn depressed color="primary" class="mr-3" @click="update" v-if="selectedItem">수정</v-btn>
          <v-btn depressed color="primary" class="mr-3" @click="add" v-else>저장</v-btn>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>

</template>
<script>
import { head, last } from 'lodash'
export default {
  data () {
    return {
      headers: [
        { value: 'createdAt', text: '작성일' },
        { value: 'title', text: '제목' },
        { value: 'content', text: '내용' },
        { value: 'id', text: 'id', sortable: false }
      ],
      dialog: false,
      form: {
        title: '',
        content: ''
      },
      items: [],
      selectedItem: null,
      unSubscribe: null,
      unSubscribeCount: null,
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      serverItemsLength: 0,
      docs: []
    }
  },
  created () {
    // this.read()
  },
  destroyed () {
    if (this.unSubscribe) this.unSubscribe()
    if (this.unSubscribeCount) this.unSubscribeCount()
  },
  watch: {
    options: {
      handler (n, o) {
        const arrow = n.page - o.page
        this.read(arrow)
      }
    }
  },
  methods: {
    read (arrow) {
      this.unSubscribeCount = this.$fire.firestore().collection('meta').doc('boards').onSnapshot(doc => {
        if (!doc.data) return
        this.serverItemsLength = doc.data().count
      })

      const sort = head(this.options.sortBy)
      const order = head(this.options.sortDesc) ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage
      const ref = this.$fire.firestore().collection('boards').orderBy(sort, order)

      let query
      switch (arrow) {
        case -1: query = ref.endBefore(head(this.docs)).limit(limit)
          break
        case 1: query = ref.startAfter(last(this.docs)).limit(limit)
          break
        default: query = ref.limit(limit)
          break
      }

      this.unSubscribe = query.onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }

        this.docs = sn.docs // 정렬을 위해서 docs를 저장

        this.items = sn.docs.map(doc => {
          return {
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            createdAt: doc.data().createdAt.toDate().toLocaleString()
          }
        })
      })
    },
    openDialog (item) {
      this.dialog = true
      this.selectedItem = item
      if (!item) {
        this.form.title = ''
        this.form.content = ''
      } else {
        this.selectedItem = item
        this.form.title = item.title
        this.form.content = item.content
      }
    },
    add () {
      const item = {
        createdAt: new Date(),
        title: this.form.title,
        content: this.form.content
      }
      this.$fire.firestore().collection('boards').add(item)
      this.dialog = false
    },
    update () {
      this.dialog = false
      this.$fire.firestore().collection('boards').doc(this.selectedItem.id).update(this.form)
    },
    remove (item) {
      this.$fire.firestore().collection('boards').doc(item.id).delete()
    }
  }
}
</script>
