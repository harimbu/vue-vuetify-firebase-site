<template>
  <v-list nav>
    <v-list-group
      v-for="(item, i) in items"
      :key="i"
      v-model="item.active"
      :prepend-icon="item.icon"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            <span>{{item.title}}</span>
            <span v-show="$store.state.user">
              <v-icon class="ml-2" @click="openDialog(i)">mdi-pencil</v-icon>
              <v-icon class="ml-2" @click="removeMenu(items, i)">mdi-delete</v-icon>
              <v-icon class="ml-2" @click="moveMenu(items, i, -1)" v-if="i > 0">mdi-chevron-double-up</v-icon>
              <v-icon class="ml-2" @click="moveMenu(items, i , 1)" v-if="i < items.length-1">mdi-chevron-double-down</v-icon>
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item
        v-for="(child, j) in item.items"
        :key="j"
        :to="child.to"
      >
        <v-list-item-content>
          <v-list-item-title>
            <span>{{child.title}}</span>
            <span v-show="$store.state.user">
              <v-icon class="ml-2" @click="openDialogSub(i, j)">mdi-pencil</v-icon>
              <v-icon class="ml-2" @click="removeMenu(item.items, j)">mdi-delete</v-icon>
              <v-icon class="ml-2" @click="moveMenu(item.items, j, -1)" v-if="j > 0">mdi-chevron-double-up</v-icon>
              <v-icon class="ml-2" @click="moveMenu(item.items, j , 1)" v-if="j < item.items.length-1">mdi-chevron-double-down</v-icon>
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="openDialogSub(i, -1)" v-show="$store.state.user">
        <v-list-item-icon class="mr-1"><v-icon>mdi-plus</v-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>서브 추가하기</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <v-list-item @click="openDialog(-1)" v-show="$store.state.user">
      <v-list-item-icon class="mr-1"><v-icon>mdi-plus</v-icon></v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>메뉴 추가하기</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- 1차 메뉴 추가 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title primary-title>
          <div>메뉴추가</div>
          <v-spacer></v-spacer>
          <v-btn color="success" icon @click="handleMenu"><v-icon>mdi-content-save</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="menu.title" label="메뉴" hide-details="" />
          <v-text-field v-model="menu.icon" label="아이콘" hide-details="" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 2차 서브 메뉴 추가 -->
    <v-dialog v-model="subDialog" max-width="400">
      <v-card>
        <v-card-title primary-title>
          <div>서브메뉴추가</div>
          <v-spacer></v-spacer>
          <v-btn color="success" icon @click="handleSubMenu"><v-icon>mdi-content-save</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="subMenu.title" label="메뉴" hide-details="" />
          <v-text-field v-model="subMenu.to" label="링크" hide-details="" />
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-list>
</template>
<script>
export default {
  props: ['items'],
  data () {
    return {
      dialog: false,
      subDialog: false,
      menu: {
        title: '',
        icon: ''
      },
      subMenu: {
        title: '',
        to: ''
      },
      selectedIndex: null,
      selectedSubIndex: null
    }
  },
  methods: {
    save () {
      this.$fire.database().ref('site').child('items').set(this.items)
      this.dialog = false
      this.subDialog = false
    },
    openDialog (index) {
      this.dialog = true
      this.selectedIndex = index
      if (index < 0) {
        this.menu.title = ''
        this.menu.icon = ''
      } else {
        this.menu.title = this.items[index].title
        this.menu.icon = this.items[index].icon
      }
    },
    openDialogSub (index, subIndex) {
      this.subDialog = true
      this.selectedIndex = index
      this.selectedSubIndex = subIndex
      if (subIndex < 0) {
        this.subMenu.title = ''
        this.subMenu.to = ''
      } else {
        this.subMenu.title = this.items[index].items[subIndex].title
        this.subMenu.to = this.items[index].items[subIndex].to
      }
    },
    handleMenu () {
      if (this.selectedIndex < 0) {
        this.items.push(this.menu)
      } else {
        this.items[this.selectedIndex].title = this.menu.title
        this.items[this.selectedIndex].icon = this.menu.icon
      }
      this.save()
    },
    handleSubMenu () {
      console.log(this.selectedIndex)
      console.log(this.selectedSubIndex)
      if (this.selectedSubIndex < 0) {
        if (!this.items[this.selectedIndex].items) this.items[this.selectedIndex].items = []
        this.items[this.selectedIndex].items.push(this.subMenu)
      } else {
        this.items[this.selectedIndex].items[this.selectedSubIndex].title = this.subMenu.title
        this.items[this.selectedIndex].items[this.selectedSubIndex].to = this.subMenu.to
      }
      this.save()
    },
    removeMenu (items, i) {
      items.splice(i, 1)
      this.save()
    },
    moveMenu (items, index, arrow) {
      // const item = items.splice(index, 1)[0]
      // items.splice(index + arrow, 0, item)
      items.splice(index + arrow, 0, ...items.splice(index, 1))
      this.save()
    }
  }
}
</script>
