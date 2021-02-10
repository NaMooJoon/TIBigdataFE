import { Component } from '@angular/core';
import { AuthService } from './modules/communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'KUBiC';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    console.log("here");
    this.auth.verifySignIn()
  }
}
