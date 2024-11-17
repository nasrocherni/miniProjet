import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error404/error404.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
    {path:'home',title:'home',component:HomeComponent},
    {path:'contact',title:'contact',component:ContactComponent},
    {path:'',redirectTo:'home', pathMatch:'full'},
    {path:'**',title:'error',component:Error404Component}

];
