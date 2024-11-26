import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  private readonly userService: UserService = inject(UserService)
  user!: User | null
  ngOnInit(): void {
    this.userService.user.subscribe(status => {
      this.user = status;
    });
  }
}
