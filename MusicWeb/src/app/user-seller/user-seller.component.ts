import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MusicItem } from '../shared/music-item.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
export const UserTypeCheck = 'UserTypeCheck';

@Component({
  selector: 'app-user-seller',
  templateUrl: './user-seller.component.html',
  styleUrls: ['./user-seller.component.css']
})
export class UserSellerComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public user: User;
  public ownerAddrInfo: OwnerAddrInfo;
  public musicItemList: MusicItem[];
  public ownerAddr: String;
  public userTypeCheck : String;
  public totalRecords: number;
  public page: number = 1;
  constructor(private http:HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getMusicListDefault();
    this.loadAddrInfo();
  }

  getUserInfo(){
    const userID = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/User/GetUserInfo/'+userID).toPromise().then(res => this.user = res as User);
  }

  loadAddrInfo(){
    const userID = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/UserAuth/GetOwnerAddress/'+userID)
    .subscribe(res =>{
      sessionStorage.setItem('ownerAddress', res['ownerAddress']);
    });
    this.ownerAddr = sessionStorage['ownerAddress'];
    
  }

  updateOwnerAddr(ownerInfo)
  {
    this.ownerAddrInfo = ownerInfo;
    const userID = this.route.snapshot.paramMap.get('id');
    this.ownerAddrInfo.userID = Number(userID);
    this.http.post(this.rootUrl + '/UserAuth/UpdateOwnerAddress', this.ownerAddrInfo)
    .subscribe(res=>{
        this.toastr.success("Cập nhật thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 2000
        });
        setTimeout(() => 
        {
          this.router.navigate(['/music/user-seller/'+userID]);
        },
        2000);
    });
    // console.log(this.ownerAddrInfo);
  }

  SetUserType()
  {
    sessionStorage.setItem(UserTypeCheck, "seller");
    this.userTypeCheck = sessionStorage.getItem(UserTypeCheck);
    this.getMusicList();
  }

  SetUserTypeBuyer()
  {
    sessionStorage.setItem(UserTypeCheck, "buyer");
    this.userTypeCheck = sessionStorage.getItem(UserTypeCheck);
    this.getMusicList();
  }

  getMusicListDefault()
  {
    sessionStorage.setItem(UserTypeCheck, "seller");
    this.userTypeCheck = sessionStorage.getItem(UserTypeCheck);
    this.getMusicList();
  }

  getMusicList()
  {
    // console.log(this.userType);
    if (this.userTypeCheck == "seller")
    {
      const userID = this.route.snapshot.paramMap.get('id');
      this.http.get(this.rootUrl + '/User/GetMusicAssetWithUser/'+userID)
      .subscribe(res =>{
        this.musicItemList = res as MusicItem[];
        for(let i = 0; i < this.musicItemList.length; i++)
          {
            if (this.musicItemList[i].creatureType == "Lyrics")
            {
              this.musicItemList[i].lyricsCheck = true;
            }
            else if (this.musicItemList[i].creatureType == "Audio")
            {
              this.musicItemList[i].audioCheck = true;
            }
            else if (this.musicItemList[i].creatureType == "MV")
            {
              this.musicItemList[i].mvCheck = true;
            }
            if (res["key2"] != null)
            {
              this.musicItemList[i].key1 = res["key1"];
            }
            // if (this.musicItemList[i].mediaLink != "")
            // {
            //   this.musicItemList[i].mediaLink = btoa(this.musicItemList[i].mediaLink.toString());
            // }
          }
          this.totalRecords = this.musicItemList.length;
        console.log(this.musicItemList);
      });
    }
    else if (this.userTypeCheck == "buyer")
    {
      const userID = this.route.snapshot.paramMap.get('id');
      this.http.get(this.rootUrl + '/User/GetMusicAssetWithUserBuyer/'+userID)
      .subscribe(res =>{
        this.musicItemList = res as MusicItem[];
        for(let i = 0; i < this.musicItemList.length; i++)
          {
            if (this.musicItemList[i].creatureType == "Lyrics")
            {
              this.musicItemList[i].lyricsCheck = true;
            }
            else if (this.musicItemList[i].creatureType == "Audio")
            {
              this.musicItemList[i].audioCheck = true;
            }
            else if (this.musicItemList[i].creatureType == "MV")
            {
              this.musicItemList[i].mvCheck = true;
            }
            this.musicItemList[i].musicLink = this.musicItemList[i].musicLink.substring(49);
            if (this.musicItemList[i].mediaLink != "")
            {
              this.musicItemList[i].mediaLink = btoa(this.musicItemList[i].mediaLink.toString());
            }
          }
          this.totalRecords = this.musicItemList.length;
          // console.log(this.musicItemList);
      });
    }
  }
}

export class User {
  userID: String;
  firstName: String;
  lastName: String;
  emailID: String; 
}

export class OwnerAddrInfo {
  userID: Number;
  ownerAddress: String;
}