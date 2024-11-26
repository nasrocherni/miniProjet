import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error404/error404.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountComponent } from './components/account/account.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShopDetailComponent } from './components/shop-detail/shop-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { MainComponent } from './components/main/main.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { HomeAdminComponent } from './components/dashboard-admin/home-admin/home-admin.component';
import { ChocolatesAdminComponent } from './components/dashboard-admin/chocolates-admin/chocolates-admin.component';
import { OrdersAdminComponent } from './components/dashboard-admin/orders-admin/orders-admin.component';
import { ChocolateItemComponent } from './components/dashboard-admin/chocolate-item/chocolate-item.component';
import { AccountAdminComponent } from './components/dashboard-admin/account-admin/account-admin.component';
import { ReveiwsComponent } from './components/reveiws/reveiws.component';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: 'cart', component: CartComponent, title: 'Cart' },
      { path: 'shop', component: ShopComponent, title: 'Shop' },
      { path: 'orderHistory', component: OrderHistoryComponent, title: 'Order History' },
      { path: 'reviews', component: ReveiwsComponent, title: 'Reviews' },
      { path: 'shop/:categoryId', component: ShopComponent, title: 'Shop by Category' },
      { path: 'shop/:categoryId/:chocolateId', component: ShopDetailComponent, title: 'Chocolate Details' },
      { path: 'contact', component: ContactComponent, title: 'Contact' },
      { path: 'account', component: AccountComponent, title: 'Account' },
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'signup', component: SignupComponent, title: 'Signup' },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', component: Error404Component, title: 'Error' },
    ],
  },

  {
    path: 'dashboard',
    component: DashboardAdminComponent,
    children: [
      { path: 'home', component: HomeAdminComponent, title: 'Dashboard Home' },
      { path: 'chocolates', component: ChocolatesAdminComponent, title: 'Manage Chocolates' },
      { path: 'chocolates/:chocolateId', component: ChocolateItemComponent, title: 'Chocolate Item' },
      { path: 'orders', component: OrdersAdminComponent, title: 'Manage Orders' },
      { path: 'account', component: AccountAdminComponent, title: 'Admin Account' },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', component: Error404Component, title: 'Error' },
    ], canActivate: [adminGuard]
  },

  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', component: Error404Component, title: 'Error' },
];
