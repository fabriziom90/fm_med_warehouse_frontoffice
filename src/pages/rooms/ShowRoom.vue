<script setup>
import api from "../../services/api";
import { ref, onMounted, inject, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useConfigStore } from "../../stores/configStore.js";

import ModalUploadCsv from "./ModalUploadCsv.vue";

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
const refreshInventory = () => {
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
  console.log("ciao");
  isModalOpen.value = false;
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
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
        <div class="col-12 col-md-6" v-if="inventoryProducts">
          <div class="border-right-main p-4">
            <h2>Prodotti</h2>
            <table
              class="table table-striped"
              v-if="inventoryProducts.length > 0"
            >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantità</th>
                  <th>Scadenza</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ip in inventoryProducts" :key="ip._id">
                  <td>{{ ip.product.name }}</td>
                  <td>{{ ip.quantity }}</td>
                  <td>
                    {{ formatDate(ip.expirationDate) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <h3 class="font-montserrat">Nessun prodotto inserito</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6" v-if="inventoryDrugs">
          <div class="p-4">
            <h2>Medicinali</h2>
            <table class="table table-striped" v-if="inventoryDrugs.length > 0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantità</th>
                  <th>Scadenza</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ip in inventoryDrugs" :key="ip._id">
                  <td>{{ ip.drug.name }}</td>
                  <td>{{ ip.quantity }}</td>
                  <td>
                    {{ formatDate(ip.expirationDate) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <h3 class="font-montserrat">Nessun medicinale inserito</h3>
            </div>
          </div>
        </div>
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

<style lang="scss" scoped>
@use "../../styles/_partials/_variables.scss" as *;
@use "../../styles/generals.scss";
.border-right-main {
  border-right: 1px solid $mainColor;
}
</style>
