import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
export const UserID = 'UserID';
export const licenceType = 'licenceType';
export const durationType = 'durationType';
@Component({
  selector: 'app-user-buyer-item',
  templateUrl: './user-buyer-item.component.html',
  styleUrls: ['./user-buyer-item.component.css']
})
export class UserBuyerItemComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public user: User;
  public transac: Transaction;
  constructor(private http:HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUserInfo();
  }



  licenceTypeChange(value: any)
  {
    sessionStorage.setItem(licenceType, value);
    // const musicId = this.route.snapshot.paramMap.get('id');
    // console.log(sessionStorage.getItem(licenceType));
    // console.log(musicId);
  }

  durationTypeChange(value: any)
  {
    sessionStorage.setItem(durationType, value);
    // console.log(sessionStorage.getItem(durationType));

  }

  excuteTransact(transactInfo)
  {
    const musicId = this.route.snapshot.paramMap.get('id');
    var licence_type = sessionStorage.getItem(licenceType);
    var duration_type = sessionStorage.getItem(durationType);
    if (Number(licence_type) == 0)
    {
      this.transac = transactInfo;
      this.transac.musicId = musicId;
      this.transac.tranType = "ForSale";
      this.transac.duration = 0;
      this.transac.amountValue = 1;
      this.transac.isPermanent = true;

      this.http.post(this.rootUrl + '/MusicAssetTransfersController/CreateTransferAsync', this.transac)
      .subscribe(()=>{
        this.toastr.success("Giao dịch thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 3000
        });
          sessionStorage.removeItem('licenceType');
          sessionStorage.removeItem('durationType');
        setTimeout(() => 
        {
          this.router.navigate(['/music/user-seller/'+1]);
        },
        3000);
      });
      // console.log(this.transac);
    }
    else
    {
      this.transac = transactInfo;
      this.transac.musicId = musicId;

      switch(Number(licence_type)) { 
        case 1: { 
           this.transac.tranType = "Regeneration";
           break; 
        } 
        case 2: { 
          this.transac.tranType = "CopyProduct";
           break; 
        } 
        case 3: { 
          this.transac.tranType = "Distribution";
          break; 
        } 
        case 4: { 
          this.transac.tranType = "ForOnline";
          break; 
        } 
        case 5: { 
          this.transac.tranType = "ToRent";
          break; 
        }   
      } 

      switch(Number(duration_type)) { 
        case 0: { 
           this.transac.duration = 7;
           break; 
        } 
        case 1: { 
          this.transac.duration = 14;
           break; 
        } 
        case 2: { 
          this.transac.duration = 30;
          break; 
        } 
        case 3: { 
          this.transac.duration = 90;
          break; 
        } 
        case 4: { 
          this.transac.duration = 180;
          break; 
        }
        case 5: { 
          this.transac.duration = 365;
          break; 
        } 
      } 
      this.transac.amountValue = 1;
      this.transac.isPermanent = false;

      this.http.post(this.rootUrl + '/MusicAssetTransfersController/CreateLicenceTrans', this.transac)
      .subscribe(()=>{
        this.toastr.success("Giao dịch thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 3000
        });
          sessionStorage.removeItem('licenceType');
          sessionStorage.removeItem('durationType');
        setTimeout(() => 
        {
          this.router.navigate(['/music/user-seller/'+1]);
        },
        3000);
      });
    }
  }

  getUserInfo(){
    const userID = sessionStorage.getItem(UserID);
    this.http.get(this.rootUrl + '/User/GetUserInfo/'+userID)
    .subscribe(
      res=>{
        this.user = res as User;
        this.transac.fromUserId = res['ownerAddress'];
      });
  }

}

export class User {
  userID: String;
  firstName: String;
  lastName: String;
  emailID: String; 
  ownerAddress: String;
}


export class Transaction {
  musicId: String;
  fromUserId: String;
  toUserId: String;
  tranType: String;
  fanType: String;
  duration: Number;
  amountValue: Number;
  isPermanent: boolean;
}
