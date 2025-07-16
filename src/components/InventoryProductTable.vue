<script setup>
import api from "../services/api";
import { ref, onMounted, inject, defineEmits } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useConfigStore } from "../stores/configStore.js";

const props = defineProps({
  inventoryProducts: Array,
});

const emit = defineEmits(["refresh"]);

const route = useRoute();

const type = ref("");

const editProductQuantity = ref(false);
const editProductExpirationDate = ref(false);
const actualProduct = ref(null);
const editQuantity = ref(null);
const editExpirationDate = ref(null);
const showInventoryProductForm = ref(false);
const products = ref(null);

const form = ref({
  product: "",
  quantity: null,
  expirationDate: null,
  roomId: null,
});

// get local token
const token = localStorage.getItem("token");

// define toast
const $toast = useToast();

// use pinia store
const configStore = useConfigStore();

onMounted(() => {
  form.value.roomId = route.params.id;
  api
    .get(`${configStore.apiBaseUrl}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((resp) => {
      products.value = resp.data.products;
    });
});

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

const onEditProductQuantity = (checked, id, quantity) => {
  editProductQuantity.value = checked ? false : true;

  if (!editProductQuantity.value) {
    api
      .patch(
        `${configStore.apiBaseUrl}/inventory_products/${id}/edit_quantity`,
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
          emit("refresh", "Prodotti");
        } else {
          $toast.error(message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } else {
    editQuantity.value = quantity;
    actualProduct.value = id;
  }
};

const onEditProductExpirationDate = (checked, id, expirationDate) => {
  editProductExpirationDate.value = checked ? false : true;

  if (!editProductExpirationDate.value) {
    api
      .patch(
        `${configStore.apiBaseUrl}/inventory_products/${id}/edit_expiration_date`,
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
          emit("refresh", "Prodotti");
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
    actualProduct.value = id;
  }
};

const handleSubmit = async (req, res) => {
  api
    .post(`${configStore.apiBaseUrl}/inventory_products/create`, form.value, {
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
        emit("refresh", "Prodotti");
        showInventoryProductForm = false;
        form.value.product = "";
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
</script>
<template lang="">
  <div class="col-12 col-md-6" v-if="inventoryProducts">
    <div class="border-right-main p-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2>Prodotti</h2>
        <button
          class="btn btn-main"
          @click="
            showInventoryProductForm
              ? (showInventoryProductForm = false)
              : (showInventoryProductForm = true)
          "
        >
          Aggiungi prodotto
        </button>
      </div>
      <div v-if="showInventoryProductForm" class="mt-4">
        <form @submit.prevent="handleSubmit" class="bg-main p-4">
          <div class="row gy-3 mt-4">
            <div class="col-12 col-md-4">
              <select class="form-select" v-model="form.product">
                <option value="">Seleziona prodotto</option>
                <option
                  v-for="product in products"
                  :key="product._id"
                  :value="product._id"
                >
                  {{ product.name }}
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
      <table
        class="table table-striped mt-4"
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
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <span v-if="!editProductQuantity || actualProduct !== ip._id">
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
                    onEditProductQuantity(
                      editProductQuantity,
                      ip._id,
                      ip.quantity
                    )
                  "
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </td>
            <td>
              <div class="d-flex justify-content-between align-items-center">
                <span
                  v-if="!editProductExpirationDate || actualProduct !== ip._id"
                >
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
                    onEditProductExpirationDate(
                      editProductExpirationDate,
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
