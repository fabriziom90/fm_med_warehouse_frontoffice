<script setup>
import api from "../services/api";
import { ref, onMounted, inject, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useConfigStore } from "../stores/configStore.js";

import Modal from "./Modal.vue";

const props = defineProps({
  inventoryDrugs: Array,
});

const emit = defineEmits(["refresh"]);

const route = useRoute();

const type = ref("");

const editDrugQuantity = ref(false);
const editDrugExpirationDate = ref(false);
const actualDrug = ref(null);
const editQuantity = ref(null);
const editExpirationDate = ref(null);
const showInventoryDrugForm = ref(false);
const drugs = ref(null);
const isModalOpen = ref(false);

const form = ref({
  drug: "",
  quantity: null,
  expirationDate: null,
  roomId: null,
});

onMounted(() => {
  form.value.roomId = route.params.id;
  api
    .get(`${configStore.apiBaseUrl}/drugs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      drugs.value = resp.data.drugs;
    });
});

// get local token
const token = localStorage.getItem("token");

// define toast
const $toast = useToast();

// use pinia store
const configStore = useConfigStore();

const handleChange = (quantity) => {
  editQuantity.value = quantity;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const onEditDrugQuantity = (checked, id, quantity) => {
  editDrugQuantity.value = checked ? false : true;

  if (!editDrugQuantity.value) {
    api
      .patch(
        `${configStore.apiBaseUrl}/inventory_drugs/${id}/edit_quantity`,
        { quantity: editQuantity.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        const { result, message } = resp.data;

        if (result) {
          $toast.success(message, {
            position: "top-right",
            duration: 1500,
          });
          emit("refresh", "Medicinali");
        } else {
          $toast.error(message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } else {
    editQuantity.value = quantity;
    actualDrug.value = id;
  }
};

const onEditDrugExpirationDate = (checked, id, expirationDate) => {
  editDrugExpirationDate.value = checked ? false : true;

  if (!editDrugExpirationDate.value) {
    api
      .patch(
        `${configStore.apiBaseUrl}/inventory_drugs/${id}/edit_expiration_date`,
        { expirationDate: editExpirationDate.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        const { result, message } = resp.data;

        if (result) {
          $toast.success(message, {
            position: "top-right",
            duration: 1500,
          });
          emit("refresh", "Medicinali");
        } else {
          $toast.error(message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } else {
    const date = new Date(expirationDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    editExpirationDate.value = `${yyyy}-${mm}-${dd}`;
    actualDrug.value = id;
  }
};

const handleSubmit = async (req, res) => {
  api
    .post(`${configStore.apiBaseUrl}/inventory_drugs/create`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      const { result, message } = resp.data;
      if (result) {
        $toast.success(message, {
          position: "top-right",
          duration: 1500,
        });
        emit("refresh", "Medicinali");
        showInventoryDrugForm.value = false;
        form.value.drug = "";
        form.value.quantity = null;
        form.value.expirationDate = null;
      } else {
        $toast.error(message, {
          position: "top-right",
          duration: 1500,
        });
      }
    });
};

const openModal = (id) => {
  isModalOpen.value = true;
  actualDrug.value = id;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const confirmDelete = async () => {
  await api
    .delete(
      `${configStore.apiBaseUrl}/inventory_drugs/${actualDrug.value}/delete`,
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
        actualDrug.value = null;
        emit("refresh", "Medicinali");
      } else {
        $toast.error(message, {
          position: "top-right",
          duration: 3000,
        });
      }
    });
};
</script>
<template lang="">
  <div class="col-12 col-md-6" v-if="inventoryDrugs">
    <div class="border-right-main p-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2>Medicinali</h2>
        <button
          class="btn btn-main"
          @click="
            showInventoryDrugForm
              ? (showInventoryDrugForm = false)
              : (showInventoryDrugForm = true)
          "
        >
          Aggiungi medicinale
        </button>
      </div>
      <div v-if="showInventoryDrugForm" class="mt-4">
        <form @submit.prevent="handleSubmit" class="bg-main p-4">
          <div class="row gy-3 mt-4">
            <div class="col-12 col-md-4">
              <select class="form-select" v-model="form.drug">
                <option value="">Seleziona prodotto</option>
                <option v-for="drug in drugs" :key="drug._id" :value="drug._id">
                  {{ drug.name }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-4">
              <input
                type="number"
                min="0"
                placeholder="Inserisci quantità"
                class="form-control"
                v-model="form.quantity"
              />
            </div>
            <div class="col-12 col-md-4">
              <input
                type="date"
                class="form-control"
                placeholder="Inserisci data di scadenza"
                v-model="form.expirationDate"
              />
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-white">Salva</button>
            </div>
          </div>
        </form>
      </div>
      <table class="table table-striped mt-4" v-if="inventoryDrugs.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Quantità</th>
            <th>Scadenza</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ip in inventoryDrugs" :key="ip._id">
            <td>
              {{ ip.drug.name }}
              <button class="not-button" @click="openModal(ip._id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <span v-if="!editDrugQuantity || actualDrug !== ip._id">
                  {{ ip.quantity }}
                </span>
                <input
                  type="number"
                  class="form-control me-2"
                  v-model="editQuantity"
                  placeholder="Modifica quantità"
                  v-else
                />
                <button
                  class="btn btn-warning"
                  @click="
                    onEditDrugQuantity(editDrugQuantity, ip._id, ip.quantity)
                  "
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </td>
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <span v-if="!editDrugExpirationDate || actualDrug !== ip._id">
                  {{ formatDate(ip.expirationDate) }}
                </span>
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="editExpirationDate"
                  placeholder="Modifica quantità"
                  v-else
                />
                <button
                  class="btn btn-warning"
                  @click="
                    onEditDrugExpirationDate(
                      editDrugExpirationDate,
                      ip._id,
                      ip.expirationDate
                    )
                  "
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <h3 class="font-montserrat">Nessun prodotto inserito</h3>
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
@use "../styles/_partials/_variables.scss" as *;
@use "../styles/generals.scss";
.border-right-main {
  border-right: 1px solid $mainColor;
}
</style>
