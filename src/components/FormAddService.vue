<script setup>
import api from "../services/api.js";
import { ref, defineEmits } from "vue";
import { useConfigStore } from "../stores/configStore.js";
import { useToast } from "vue-toast-notification";
import { router } from "../router/index.js";

const props = defineProps({
  refresh: Boolean,
});

const emit = defineEmits(["setServiceSelect"]);

const token = localStorage.getItem("token");
const configStore = useConfigStore();
const $toast = useToast();

const form = ref({
  name: "",
});

const handleSubmit = async () => {
  try {
    await api
      .post(`${configStore.apiBaseUrl}/services`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        if (resp.data.result) {
          $toast.success(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
          if (props.refresh) {
            setTimeout(() => {
              router.push({ name: "indexServices" });
            }, 1500);
          } else {
            emit("setServiceSelect", resp.data.service);
          }
        } else {
          $toast.error(resp.data.message, {
            position: "top-right",
            duration: 1500,
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};
</script>
<template lang="">
  <form @submit.prevent="handleSubmit">
    <div class="row gy-4">
      <div class="col-6">
        <label class="form-label">Nome</label>
        <input
          type="text"
          class="form-control"
          placeholder="Nome"
          name="name"
          id="name"
          v-model="form.name"
        />
      </div>
      <div class="col-12">
        <button type="submit" :class="props.refresh ? 'btn-main' : 'btn-white'">
          Salva
        </button>
      </div>
    </div>
  </form>
</template>
<style lang=""></style>
