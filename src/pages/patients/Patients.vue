<script setup>
import { ref, onMounted, inject } from "vue";
import api from "../../services/api";
import { useConfigStore } from "../../stores/configStore";
import { router } from "../../router";
import { DataTable } from "datatables.net-vue3";
import { useToast } from "vue-toast-notification";
import Modal from "./Modal.vue";

const configStore = useConfigStore();
const token = localStorage.getItem("token");
const $toast = useToast();

const columns = [
  { title: "Nome", data: "name" },
  { title: "Cognome", data: "surname" },
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

const defaultOptions = inject("datatableOptions");
defaultOptions.paging = false;
defaultOptions.columns = columns;
defaultOptions.rowCallback = function (row, data) {
  const deleteBtn = row.querySelector("button.btn-danger");
  const editBtn = row.querySelector("a.btn-warning");
  const showBtn = row.querySelector("a.btn-primary");

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      selectedPatient.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editPatient", params: { id: data._id } });
    };
  }
  if (showBtn) {
    showBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "showPatient", params: { id: data._id } });
    };
  }
};

const patients = ref([]);
const selectedPatient = ref(null);
const isModalOpen = ref(false);

onMounted(() => {
  getPatients();
});

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/patients/delete/${selectedPatient.value._id}`,
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
        await getPatients();
      } else {
        $toast.error(message, {
          position: "top-right",
          duration: 3000,
        });
      }
    });
};

const getPatients = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        patients.value = resp.data.patients;
      });
  } catch (err) {
    console.log(err);
  }
};

function closeModal() {
  isModalOpen.value = false;
}
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Pazienti</h2>
          <router-link class="btn-main" to="/admin/patients/create"
            >Aggiungi paziente</router-link
          >
        </div>
      </div>
    </div>
    <div class="row" v-if="patients">
      <div class="col-12">
        <DataTable
          class="display table table-striped mt-3"
          :options="defaultOptions"
          :data="patients"
          v-if="patients.length > 0"
        >
        </DataTable>
        <div v-else-if="patients.length === 0">
          <h2>Non sono stati ancora inseriti pazienti</h2>
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
<style lang=""></style>
