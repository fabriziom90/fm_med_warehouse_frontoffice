<script setup>
defineProps({
  showModal: Boolean,
});
</script>
<template lang="">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">Conferma cancellazione</div>
          <div class="modal-body">
            Sei sicura di voler cancellare questo prodotto?
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-sm btn-main btn-shape me-2"
              @click="$emit('handleConfirmDelete')"
            >
              Conferma cancellazione
            </button>

            <button
              class="btn btn-transparent btn-shape"
              @click="$emit('close')"
            >
              Chiudi modale
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss";
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
