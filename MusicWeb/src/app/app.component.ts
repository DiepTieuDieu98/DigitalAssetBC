import { Component } from '@angular/core';
export const UserID = 'UserID';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public userID = sessionStorage.getItem(UserID);

  title = 'MusicWeb';
}
