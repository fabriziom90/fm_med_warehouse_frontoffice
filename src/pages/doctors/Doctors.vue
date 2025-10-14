<script setup>
import { ref, onMounted, inject } from "vue";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../../router/index";
import DataTable from "datatables.net-vue3";
import Modal from "./Modal.vue";
import api from "../../services/api";

const configStore = useConfigStore();
const token = localStorage.getItem("token");
const $toast = useToast();

// define variables
const columns = [
  { title: "Nome", data: "name" },
  { title: "Cognome", data: "surname" },
  { title: "Specializzazione", data: "specialty" },
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
      selectedDoctor.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editDoctor", params: { id: data._id } });
    };
  }
  if (showBtn) {
    showBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "showDoctor", params: { id: data._id } });
    };
  }
};

const doctors = ref([]);
const selectedDoctor = ref(null);
const isModalOpen = ref(false);

onMounted(() => {
  getDoctors();
});

const getDoctors = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        doctors.value = resp.data.doctors;
      });
  } catch (err) {
    console.log(err);
  }
};

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/doctors/delete/${selectedDoctor.value._id}`,
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
        await getDoctors();
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
            <h2 class="fs-1">Elenco dottori</h2>
            <div>
              <router-link class="btn-main" to="/admin/doctors/create"
                >Aggiungi dottore</router-link
              >
              <router-link
                class="btn-main"
                to="/admin/medical_appointments/create"
                >Crea appuntamento medico</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="doctors">
        <div class="col-12">
          <DataTable
            class="display table table-striped mt-3"
            :options="defaultOptions"
            :data="doctors"
            v-if="doctors.length > 0"
          >
          </DataTable>
          <div v-else-if="doctors.length === 0">
            <h2>Non sono stati ancora inseriti dottori</h2>
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
<style lang=""></style>
