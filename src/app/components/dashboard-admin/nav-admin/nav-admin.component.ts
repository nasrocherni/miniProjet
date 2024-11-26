import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-admin.component.html',
  styleUrl: './nav-admin.component.css'
})
export class NavAdminComponent {
  private readonly userService:UserService=inject(UserService)
  private readonly router:Router=inject(Router)

  user!:User







  logOut() {
    this.userService.logOut();
    this.router.navigate(['/main/home'])
  }

}
