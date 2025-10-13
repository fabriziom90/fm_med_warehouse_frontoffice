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
    orderable: false,
    render: function (data, type, row) {
      return `
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
const drugs = ref(null);
const selectedDrug = ref(null);
const isModalOpen = ref(false);
// get local token
const token = localStorage.getItem("token");

// define toast
const $toast = useToast();

// use pinia store
const configStore = useConfigStore();

// import default datatableOptions
const defaultOptions = inject("datatableOptions");
defaultOptions.paging = true;
defaultOptions.columns = columns;
defaultOptions.orderable = true;
defaultOptions.rowCallback = function (row, data) {
  const deleteBtn = row.querySelector("button.btn-danger");
  const editBtn = row.querySelector("a.btn-warning");
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      selectedDrug.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editDrug", params: { id: data._id } });
    };
  }
};

onMounted(() => {
  getDrugs();
});

const getDrugs = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/drugs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        drugs.value = resp.data.drugs;
      });
  } catch (err) {
    err.response.data.message;
  }
};

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/drugs/delete/${selectedDrug.value._id}`,
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
        await getDrugs();
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
            <h2 class="fs-1">Elenco medicinali</h2>
            <router-link class="btn-main" to="/admin/drugs/create"
              >Aggiungi medicinale</router-link
            >
          </div>
        </div>
      </div>
      <div class="row" v-if="drugs">
        <div class="col-12">
          <DataTable
            class="display table table-striped mt-3"
            :options="defaultOptions"
            :data="drugs"
            v-if="drugs.length > 0"
          >
          </DataTable>
          <div v-else-if="drugs.length === 0">
            <h2>Non sono stati ancora inseriti medicinali</h2>
          </div>
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
