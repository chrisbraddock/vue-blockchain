<template>
  <div
    class="block"
    :class="{ valid: this.isHashValid(), invalid: !this.isHashValid() }">
    <!-- block number -->
    <label for="block">Block #</label>
    <input
      v-model="block.num"
      class="num"
      name="num"
      disabled />

    <!-- nonce -->
    <label for="nonce">Nonce</label>
    <input
      v-model="block.nonce"
      :disabled="mining"
      type="number"
      class="nonce"
      name="nonce" />

    <!-- data -->
    <label for="data">Data</label>
    <textarea
      v-model="block.data"
      :disabled="mining"
      class="data"
      name="data" />

    <!-- hash -->
    <label for="hash">Hash</label>
    <input
      v-model="hash"
      class="hash"
      name="hash"
      disabled />

    <!-- previous hash -->
    <label for="prev">Previous hash</label>
    <input
      v-model="block.prev"
      class="hash"
      name="prev"
      disabled />

    <!-- mine -->
    <button
      @click="mine"
      :disabled="this.isHashValid() || mining">{{ mining ? 'Mining...' : 'Mine' }}</button>
  </div>
</template>

<script>
import { sha256 } from '@/lib/crypto'

function blockFactory (num, nonce, data, prev) {
  // parseInt to make sure numbers are not stringified via <input> DOMString
  return {
    num: parseInt(num, 10),
    nonce: parseInt(nonce, 10),
    data,
    prev
  }
}

function calculateHash ({ num, nonce, data, prev }) {
  return sha256(JSON.stringify(blockFactory(
    num,
    nonce,
    data,
    prev
  )))
}

export default {
  name: 'Block',
  props: {
    num: Number,
    prev: String
  },
  async created () {
    this.block.num = this.num
    this.block.prev = this.prev
    this.hash = await calculateHash(this.block)
  },
  data () {
    return {
      mining: false,
      block: {
        num: null,
        nonce: null,
        data: '',
        prev: null
      },
      hash: null
    }
  },
  methods: {
    isHashValid (hash) {
      hash = hash || this.hash
      return hash.substring(0, 4) === '0000'
    },
    async mine () {
      // set state = mining
      this.mining = true

      // mine
      let hash = null
      let tryNonce = -1
      while (!this.isHashValid(hash)) {
        tryNonce++
        hash = await calculateHash(blockFactory(
          this.block.num,
          tryNonce,
          this.block.data,
          this.block.prev
        ))
      }

      // set mined values
      this.block.nonce = tryNonce
      this.hash = hash

      // set state = not mining
      this.mining = false
    }
  },
  watch: {
    block: {
      deep: true,
      async handler () {
        this.hash = await calculateHash(this.block)
      }
    },
    hash () {
      this.$emit('hash', {
        num: this.num,
        hash: this.hash
      })
    },
    prev () {
      this.block.prev = this.prev
    }
  }
}
</script>

<style lang="scss" scoped>
  .block:not(:last-child) {
    padding-bottom: 1em;
    margin-bottom: 2em;
  }
  .block {
    padding: 1em;
    border-radius: 0.5em;
    &.invalid {
      border: 2px solid red;
    }
    &.valid {
      border: 2px solid green;
    }
  }
  .data {
    width: 100%;
  }
  .hash {
    width: 97%;
  }
</style>
