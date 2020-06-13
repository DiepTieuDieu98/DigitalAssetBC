import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-regis',
  templateUrl: './user-regis.component.html',
  styleUrls: ['./user.component.css']
})
export class UserRegisComponent implements OnInit {
  public userInfo: User;
  public apiURL = "https://localhost:5001/api";
  constructor(private http:HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  register(userInfo)
  {
    this.http.post(this.apiURL + '/UserAuth/Registration', userInfo)
    .subscribe(()=>{
      // console.warn(userInfo);
      this.router.navigate(['/music/statistic']);
    });
  }

}

export class User {
  firstName: String;
  lastName: String;
  emailID: String;
  dateOfBirth: Date;
  userType: Number;
  password: String;
  confirmPassword: String;
  resetPasswordCode: String;
}
