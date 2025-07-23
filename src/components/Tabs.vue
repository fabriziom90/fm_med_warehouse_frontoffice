<script setup>
import api from "../services/api";
import { ref, onMounted } from "vue";
import { useConfigStore } from "../stores/configStore.js";
import DashboardTable from "./DashboardTable.vue";

const token = localStorage.getItem("token");
const configStore = useConfigStore();

const rooms = ref(null);
const loaded = ref(false);
const activeTab = ref(null);
const currentProductsQuantity = ref(null);
const currentProductsExpiration = ref(null);
const currentDrugsQuantity = ref(null);
const currentDrugsExpiration = ref(null);

onMounted(() => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/clinic_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        rooms.value = resp.data.clinicRooms;
        activeTab.value = resp.data.clinicRooms[0]._id;
        getInventory();
      });
  } catch (err) {
    console.log(err);
  }
});

const setActiveTab = (id) => {
  activeTab.value = id;
  getInventory();
};

const getInventory = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/dashboard/${activeTab.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        currentProductsQuantity.value = resp.data.inventoryProductsQuantity;
        currentProductsExpiration.value = resp.data.inventoryProductsExpiration;
        currentDrugsQuantity.value = resp.data.inventoryDrugsQuantity;
        currentDrugsExpiration.value = resp.data.inventoryDrugsExpiration;
        loaded.value = true;
      });
  } catch (err) {
    console.log(err);
  }
};
</script>
<template lang="">
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="room in rooms" :key="room._id">
      <a
        class="nav-link"
        :class="activeTab === room._id ? 'active' : ''"
        aria-current="page"
        href="#"
        @click="setActiveTab(room._id)"
        >{{ room.name }}</a
      >
    </li>
  </ul>
  <div class="row mt-4" v-if="loaded">
    <div class="col-12 col-md-6">
      <h2>Prodotti che stanno terminando</h2>
      <DashboardTable
        :items="currentProductsQuantity"
        :type="'Prodotti'"
        :danger="'qnt'"
        v-if="currentProductsQuantity.length > 0"
      />
      <div v-else>Nessun prodotto che sta per terminare</div>
      <h2>Prodotti in scadenza</h2>
      <DashboardTable
        :items="currentProductsExpiration"
        :type="'Prodotti'"
        :danger="'exp'"
        v-if="currentProductsExpiration.length > 0"
      />
      <div v-else>Nessun prodotto che sta per scadere</div>
    </div>
    <div class="col-12 col-md-6">
      <h2>Medicinali che stanno terminando</h2>
      <DashboardTable
        :items="currentDrugsQuantity"
        :type="'Medicinali'"
        :danger="'qnt'"
        v-if="currentDrugsQuantity.length > 0"
      />
      <div v-else>Nessun medicinale che sta per terminare</div>
      <h2>Medicinali in scadenza</h2>
      <DashboardTable
        :items="currentDrugsExpiration"
        :type="'Medicinali'"
        :danger="'exp'"
        v-if="currentDrugsExpiration.length > 0"
      />
      <div v-else>Nessun medicinale in scadenza</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/_partials/_variables" as *;
@use "../styles/generals.scss";
.nav.nav-tabs {
  border-bottom: none;
  .nav-link.active {
    background-color: $mainColor;
    color: #fff;
    border: 1px solid $mainColor;
  }

  .nav-link {
    border: 1px solid #fff;
    color: $mainColor;
  }
}
</style>
