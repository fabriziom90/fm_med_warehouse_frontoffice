import { createRouter, createWebHistory } from "vue-router";

import Login from '../pages/auth/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Dashboard from '../pages/Dashboard.vue'

// rooms components
import Rooms from '../pages/rooms/Rooms.vue';
import ShowRoom from '../pages/rooms/ShowRoom.vue';
import CreateRoom from '../pages/rooms/CreateRoom.vue';
import EditRoom from '../pages/rooms/EditRoom.vue';

// products components
import Products from '../pages/products/Products.vue';
import CreateProduct from '../pages/products/CreateProduct.vue';
import EditProduct from '../pages/products/EditProduct.vue';

// drugs components
import Drugs from '../pages/drugs/Drugs.vue';
import CreateDrug from '../pages/drugs/CreateDrug.vue';
import EditDrug from '../pages/drugs/EditDrug.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/admin',
            component: MainLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: Dashboard,
                },
                {
                    path: "rooms",
                    children: [
                        {
                            path: '',
                            name: 'indexRooms',
                            component: Rooms
                        },
                        {
                            path: ':id/show',
                            name: 'showRoom',
                            component: ShowRoom
                        },
                        {
                            path: 'create',
                            name: 'createRoom',
                            component: CreateRoom
                        },
                        {
                            path: ':id/edit',
                            name: 'editRoom',
                            component: EditRoom
                        }

                    ]
                },
                {
                    path: 'products',
                    children: [
                        {
                            path: '',
                            name: 'indexProducts',
                            component: Products
                        },
                        {
                            path: 'create',
                            name: 'createProduct',
                            component: CreateProduct
                        },
                        {
                            path: ':id/edit',
                            name: 'editProduct',
                            component: EditProduct
                        }
                    ]
                },
                {
                    path: "drugs",
                    children: [
                        {
                            path: '',
                            name: 'indexDrugs',
                            component: Drugs
                        },
                        {
                            path: 'create',
                            name: 'createDrug',
                            component: CreateDrug
                        },
                        {
                            path: ':id/edit',
                            name: 'editDrug',
                            component: EditDrug
                        }
                    ]
                }
            ]
        }
    ]
});

export { router }