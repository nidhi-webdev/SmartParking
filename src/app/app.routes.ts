import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Layout } from './Pages/layout/layout';
import { Dashboard } from './Pages/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'login', component: Login
    },
    {
        path: 'app', component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
