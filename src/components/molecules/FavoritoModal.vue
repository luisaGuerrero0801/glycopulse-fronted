<template>
  <transition name="modal">
    <div v-if="show"  class="modal-overlay" @click.self="closeModal">
        <div class="modal-container"
        >
        <button class="modal-close"  @click="closeModal">
            <span class="material-icons">close</span>

        </button>
        <div class="modalcontent">
            <img :src="" alt="">

        </div>
        </div>

        
    </div>

  </transition>
</template>

<script>
export default {

}
</script>

<style>

</style>