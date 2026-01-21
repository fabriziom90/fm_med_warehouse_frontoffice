<script setup>
import api from "../../services/api.js";
import { ref, onMounted } from "vue";
import { useConfigStore } from "../../stores/configStore.js";
import { useToast } from "vue-toast-notification";

const props = defineProps({
  showModal: Boolean,
  type: String,
  roomId: String,
});

const emit = defineEmits(["close", "uploaded"]);

const configStore = useConfigStore();
const $toast = useToast();
const id = ref("");
const file = ref(null);

const token = localStorage.getItem("token");

const loadInventory = async (type) => {
  const formData = new FormData();

  formData.append("file", file.value);

  if (type.toLowerCase() === "medicinali") {
    api
      .post(
        `${configStore.apiBaseUrl}/drugs/${props.roomId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((resp) => {
        const { result, message } = resp.data;
        if (result) {
          $toast.success(message, {
            position: "top-right",
            duration: 3000,
          });
          emit("close");
          emit("uploaded", "Medicinali");
        } else {
          $toast.error(message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  } else {
    api
      .post(
        `${configStore.apiBaseUrl}/products/${props.roomId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((resp) => {
        const { result, message } = resp.data;

        if (result) {
          $toast.success(message, {
            position: "top-right",
            duration: 3000,
          });

          emit("close");
          emit("uploaded", "Prodotti");
        } else {
          $toast.error(message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  }
};

const handleFileChange = (e) => {
  file.value = e.target.files[0];
};
</script>
<template lang="">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <form @submit.prevent="loadInventory(type)">
            <div class="modal-header">Importa {{ type }}</div>
            <div class="modal-body">
              <input
                type="file"
                class="form-control"
                placeholder="Inserisci il file da leggere"
                @change="handleFileChange"
                accept=".csv"
              />
            </div>
            <div class="modal-footer">
              <button class="btn btn-sm btn-main btn-shape me-2" type="submit">
                Carica {{ type.toLowerCase() }}
              </button>

              <button
                class="btn btn-transparent btn-shape"
                @click="$emit('close')"
              >
                Chiudi modale
              </button>
            </div>
          </form>
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
