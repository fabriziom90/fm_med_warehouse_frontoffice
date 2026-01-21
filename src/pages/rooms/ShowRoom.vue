<script setup>
import api from "../../services/api";
import { ref, onMounted, inject, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useConfigStore } from "../../stores/configStore.js";

import ModalUploadCsv from "./ModalUploadCsv.vue";
import InventoryProductTable from "../../components/InventoryProductTable.vue";
import InventoryDrugTable from "../../components/InventoryDrugTable.vue";

const route = useRoute();

const roomId = route.params.id;
const room = ref("");
const type = ref("");

const inventoryProducts = ref(null);
const inventoryDrugs = ref(null);
const isModalOpen = ref(false);

// get local token
const token = localStorage.getItem("token");

// define toast
const $toast = useToast();

// use pinia store
const configStore = useConfigStore();

onMounted(() => {
  api
    .get(`${configStore.apiBaseUrl}/clinic_rooms/${roomId}/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      room.value = resp.data.clinicRoom;
    });

  loadInventoryProducts();
  loadInventoryDrugs();
});

// function that load the inventory products
const loadInventoryProducts = () => {
  api
    .get(`${configStore.apiBaseUrl}/inventory_products/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      inventoryProducts.value = resp.data.inventoryProducts;
    });
};

// function that load the inventory drugs
const loadInventoryDrugs = () => {
  api
    .get(`${configStore.apiBaseUrl}/inventory_drugs/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      inventoryDrugs.value = resp.data.inventoryDrugs;
    });
};

// refresh the inventory vased on the active type clicked
const refreshInventory = (currentType) => {
  type.value = currentType;
  if (type.value === "Prodotti") {
    loadInventoryProducts();
  } else {
    loadInventoryDrugs();
  }
};

const openModal = (currentType) => {
  isModalOpen.value = true;
  type.value = currentType;
};

function closeModal() {
  isModalOpen.value = false;
}
</script>
<template lang="">
  <div class="m-3">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 class="mt-3">Stanza {{ room.name }}</h2>
            </div>
            <div>
              <button class="btn-main me-2" @click="openModal('Medicinali')">
                Importa Medicinali
              </button>
              <button class="btn-main" @click="openModal('Prodotti')">
                Importa Prodotti
              </button>
            </div>
          </div>
        </div>
        <InventoryProductTable
          :inventoryProducts="inventoryProducts"
          @refresh="refreshInventory"
        />
        <InventoryDrugTable
          :inventoryDrugs="inventoryDrugs"
          @refresh="refreshInventory"
        />
      </div>
    </div>
  </div>
  <ModalUploadCsv
    v-if="isModalOpen"
    :type="type"
    :roomId="room._id"
    @close="closeModal"
    @uploaded="refreshInventory"
  />
</template>

<style lang="scss" scoped></style>
