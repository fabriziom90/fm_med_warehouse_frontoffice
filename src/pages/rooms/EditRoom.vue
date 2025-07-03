<script setup>
import api from "../../services/api";
import { ref, onMounted } from "vue";
import { useConfigStore } from "../../stores/configStore";
import { useToast } from "vue-toast-notification";
import { router } from "../../router/index.js";
import { useRoute } from "vue-router";

const configStore = useConfigStore();

const token = localStorage.getItem("token");

const $toast = useToast();

const route = useRoute();
const roomId = route.params.id;

const form = ref({
  name: "",
});

onMounted(() => {
  api
    .get(`${configStore.apiBaseUrl}/clinic_rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((resp) => {
      form.value.name = resp.data.clinicRoom.name;
    });
});

const handleSubmit = async () => {
  try {
    await api
      .patch(
        `${configStore.apiBaseUrl}/clinic_rooms/${roomId}/update`,
        form.value,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
          setTimeout(() => {
            router.push({ name: "indexRooms" });
          }, 1500);
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      });
  } catch (err) {
    console.log(err);
    if (err.response) {
      $toast.error(err.response.data.message, {
        position: "top-right",
        duration: 3000,
      });
    } else {
      $toast.error(err.data.message, {
        position: "top-right",
        duration: 3000,
      });
    }
  }
};
</script>
<template lang="">
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="fs-1">Modifica stanza</h2>
          <router-link to="/admin/rooms" class="btn-main"
            >Visualizza stanze</router-link
          >
        </div>
      </div>
      <div class="col-12">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="form-label">Nome stanza</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Inserisci il nome della stanza"
              class="form-control"
              v-model="form.name"
            />
          </div>
          <div class="mb-2">
            <button type="submit" class="btn-main">Salva</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
