import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router/index.js'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import datatableOptions from './plugins/datatableOptions';

import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-select-dt";

import { createPinia } from 'pinia'

DataTable.use(DataTablesCore);

createApp(App).use(router).use(ToastPlugin).use(datatableOptions).use(createPinia()).mount('#app')
