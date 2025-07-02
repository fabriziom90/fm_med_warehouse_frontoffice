<script setup>
import axios from "axios";
import { ref, inject, onMounted } from "vue";
import DataTable from "datatables.net-vue3";

// import store
import { useConfigStore } from "../../stores/configStore";

const defaultOptions = inject("datatableOptions");
defaultOptions.paging = false;
const token = localStorage.getItem("token");

const configStore = useConfigStore();

const rooms = ref([]);

onMounted(() => {
  try {
    axios
      .get(`${configStore.apiBaseUrl}/clinic_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        rooms.value = resp.data.clinicRooms;
      });
  } catch (err) {
    err.response.data.message;
  }
});
</script>
<template lang="">
  <div class="m-3">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="fs-1">Elenco stanze</h2>
            <router-link class="btn-main" to="/admin/rooms/create"
              >Aggiungi stanza</router-link
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <DataTable
            class="display table table-striped mt-3"
            :options="defaultOptions"
            v-if="rooms.length"
          >
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Strumenti</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(room, index) in rooms" :key="room._id">
                <td>{{ index + 1 }}</td>
                <td>{{ room.name }}</td>
                <td>
                  <router-link
                    :to="`/admin/rooms/${room._id}/edit`"
                    class="btn btn-warning rounded-0 me-2"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button class="btn btn-danger rounded-0">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss";
</style>
