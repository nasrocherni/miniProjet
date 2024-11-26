import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/nav/nav.component";
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './services/user.service';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chocolate';
  user!: User |null;
  constructor(private userService:UserService){}

  ngOnInit(){
    
    const id=localStorage.getItem('loggedInUserId')
    
    if (id) {
      this.userService.getUserById(id).subscribe((res)=>{
        this.userService.setUser(res)
        console.log('res',res);
        
      })
    }

  }
  

}
