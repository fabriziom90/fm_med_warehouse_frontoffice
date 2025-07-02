import { createRouter, createWebHistory } from "vue-router";

import Login from '../pages/auth/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Dashboard from '../pages/Dashboard.vue'

// rooms components
import Rooms from '../pages/rooms/Rooms.vue';
import CreateRoom from '../pages/rooms/CreateRoom.vue';
import EditRoom from '../pages/rooms/EditRoom.vue';

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
                }
            ]
        }
    ]
});

export { router }