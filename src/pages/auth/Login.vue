<script setup>
import { ref } from "vue";
import api from "../../services/api";
import { router } from "../../router/index.js";

// import toast
import { useToast } from "vue-toast-notification";

// import Loader
import Loader from "../../components/Loader.vue";

// import store
import { useConfigStore } from "../../stores/configStore.js";

// save store in variable
const configStore = useConfigStore();

// save useToast function in variable
const $toast = useToast();

const form = ref({
  username: "",
  password: "",
});

const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    await api
      .post(`${configStore.apiBaseUrl}/users/login`, form.value)
      .then((resp) => {
        const token = resp.data.token;
        localStorage.setItem("token", token);
        $toast.success(
          "Login effettuato con successo. A breve verrai verrai reindirizzata alla dashboard",
          {
            position: "top-right",
            duration: 3000,
          }
        );

        setTimeout(() => {
          router.push({ name: "dashboard" });
        }, 3000);
      });
  } catch (err) {
    $toast.error(err.response.data.message, {
      position: "top-right",
      duration: 3000,
    });
    isLoading.value = false;
  }
};
</script>
<template lang="">
  <Loader v-if="isLoading" />
  <div
    class="vw-100 vh-100 d-flex justify-content-center align-items-center bg-main"
    v-if="!isLoading"
  >
    <div class="bg-white p-5">
      <div class="text-center">
        <img src="/logo.png" alt="" class="logo" />
        <h2 class="my-2">MediStock</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-2">
          <label for="" class="form-label">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            class="form-control"
            v-model="form.username"
            required
          />
        </div>
        <div class="mb-2">
          <label for="" class="form-label">Username</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            class="form-control"
            v-model="form.password"
            required
          />
        </div>
        <div class="my-4">
          <button type="submit" class="btn-main">Accedi</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/generals.scss";
</style>
