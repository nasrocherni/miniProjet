import { Component } from '@angular/core';
import { NavAdminComponent } from "./nav-admin/nav-admin.component";
import { FooterAdminComponent } from "./footer-admin/footer-admin.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [NavAdminComponent, FooterAdminComponent,RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

}
