<script setup>
import api from "../../services/api";
import { ref, inject, onMounted, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import DataTable from "datatables.net-vue3";
import Modal from "./Modal.vue";
import { router } from "../../router/index.js";

// import store
import { useConfigStore } from "../../stores/configStore";

// define variables
const columns = [
  { title: "Nome", data: "name" },
  {
    title: "Strumenti",
    data: null,
    render: function (data, type, row) {
      return `
        <a href="#" data-show-id="${row._id}" class="btn btn-primary btn-sm me-2">
          <i class="fas fa-eye"></i>
        </a>
        <a href="#" data-edit-id="${row._id}" class="btn btn-warning btn-sm me-2">
          <i class="fas fa-edit"></i>
        </a>
        <button class="btn btn-danger btn-sm" data-id="${row._id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
    },
  },
];
const rooms = ref([]);
const selectedRoom = ref(null);
const isModalOpen = ref(false);
// get local token
const token = localStorage.getItem("token");

// define toast
const $toast = useToast();

// use pinia store
const configStore = useConfigStore();

// import default datatableOptions
const defaultOptions = inject("datatableOptions");
defaultOptions.paging = false;
defaultOptions.columns = columns;
defaultOptions.rowCallback = function (row, data) {
  const deleteBtn = row.querySelector("button.btn-danger");
  const editBtn = row.querySelector("a.btn-warning");
  const showBtn = row.querySelector("a.btn-primary");

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      selectedRoom.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editRoom", params: { id: data._id } });
    };
  }
  if (showBtn) {
    console.log(showBtn);
    showBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "showRoom", params: { id: data._id } });
    };
  }
};

onMounted(() => {
  getRooms();
});

const getRooms = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/clinic_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        rooms.value = resp.data.clinicRooms;
      });
  } catch (err) {
    console.log(err);
  }
};

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/clinic_rooms/delete/${selectedRoom.value._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(async (resp) => {
      const { result, message } = resp.data;
      if (result) {
        $toast.success(message, {
          position: "top-right",
          duration: 3000,
        });
        closeModal();
        await getRooms();
      } else {
        $toast.error(message, {
          position: "top-right",
          duration: 3000,
        });
      }
    });
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
            :data="rooms"
            v-if="rooms.length"
          >
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <Modal
    v-if="isModalOpen"
    @close="closeModal"
    @handleConfirmDelete="confirmDelete"
  />
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss";
</style>
