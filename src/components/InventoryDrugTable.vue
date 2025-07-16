<script setup>
import api from "../services/api";
import { ref, onMounted, inject, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useConfigStore } from "../stores/configStore.js";

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
</script>
<template lang="">
  <div class="col-12 col-md-6" v-if="inventoryDrugs">
    <div class="border-right-main p-4">
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
</template>
<style lang="scss" scoped>
@use "../styles/_partials/_variables.scss" as *;
@use "../styles/generals.scss";
.border-right-main {
  border-right: 1px solid $mainColor;
}
</style>
