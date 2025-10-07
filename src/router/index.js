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

// tasks components
import Tasks from '../pages/tasks/Tasks.vue';

// doctors components
import Doctors from '../pages/doctors/Doctors.vue'
import CreateDoctor from '../pages/doctors/CreateDoctor.vue';
import EditDoctor from "../pages/doctors/EditDoctor.vue";
import ShowDoctor from "../pages/doctors/ShowDoctor.vue";

// patients components
import Patients from "../pages/patients/Patients.vue";
import CreatePatient from "../pages/patients/CreatePatient.vue";
import EditPatient from "../pages/patients/EditPatient.vue";
import ShowPatient from "../pages/patients/ShowPatient.vue";

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
                },
                {
                    path: 'tasks',
                    children: [
                        {
                            path: '',
                            name: 'indexTask',
                            component: Tasks
                        },
                        
                    ]
                },
                {
                    path: 'doctors',
                    children: [
                        {
                            path: '',
                            name: 'indexDoctors',
                            component: Doctors
                        },
                        {
                            path:'create',
                            name: 'createDoctor',
                            component: CreateDoctor
                        },
                        {
                            path: ':id/edit',
                            name: 'editDoctor',
                            component: EditDoctor
                        },
                        {
                            path: ':id/show',
                            name: 'showDoctor',
                            component: ShowDoctor
                        }
                    ]
                },
                {
                    path: 'patients',
                    children: [
                        {
                            path: '',
                            name: 'indexPatients',
                            component: Patients
                        },
                        {
                            path: ':id/',
                            name: 'showPatient',
                            component: ShowPatient
                        },
                        {
                            path: 'create',
                            name: 'createPatient',
                            component: CreatePatient
                        },
                        {
                            path: ':id/edit',
                            name: 'editPatient',
                            component: EditPatient
                        }
                    ]
                }
            ]
        }
    ]
});

export { router }