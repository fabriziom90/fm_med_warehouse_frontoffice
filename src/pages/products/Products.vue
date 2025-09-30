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
const products = ref(null);
const selectedProduct = ref(null);
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
defaultOptions.rowCallback = function (row, data) {
  const deleteBtn = row.querySelector("button.btn-danger");
  const editBtn = row.querySelector("a.btn-warning");
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      selectedProduct.value = data;
      isModalOpen.value = true;
    };
  }
  if (editBtn) {
    editBtn.onclick = (e) => {
      e.preventDefault();
      router.push({ name: "editProduct", params: { id: data._id } });
    };
  }
};

onMounted(() => {
  getProducts();
});

const getProducts = () => {
  try {
    api
      .get(`${configStore.apiBaseUrl}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        products.value = resp.data.products;
      });
  } catch (err) {
    err.response.data.message;
  }
};

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/products/delete/${selectedProduct.value._id}`,
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
        await getProducts();
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
            <h2 class="fs-1">Elenco prodotti</h2>
            <router-link class="btn-main" to="/admin/products/create"
              >Aggiungi prodotto</router-link
            >
          </div>
        </div>
      </div>
      <div class="row" v-if="products">
        <div class="col-12">
          <DataTable
            class="display table table-striped mt-3"
            :options="defaultOptions"
            :data="products"
            v-if="products.length > 0"
          >
          </DataTable>
          <div v-else-if="products.length === 0">
            <h2>Non sono stati ancora inseriti prodotti</h2>
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
