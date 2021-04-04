<template>
  <div class="home">
    <h1>vue-blockchain</h1>
    <block
      v-for="blockNum in numBlocks"
      :num=blockNum
      :prev="getPreviousHash(blockNum)"
      :key=blockNum
      @hash="onHash" />
  </div>
</template>

<script>
import Block from '@/components/Block'

export default {
  name: 'home',
  components: {
    Block
  },
  data () {
    return {
      numBlocks: 5,
      blockHashes: {}
    }
  },
  methods: {
    getPreviousHash (blockNum) {
      return this.blockHashes[blockNum - 1] || ''
    },
    onHash ({ num, hash }) {
      this.blockHashes[num] = hash
      this.$forceUpdate()
    }
  }
}
</script>
