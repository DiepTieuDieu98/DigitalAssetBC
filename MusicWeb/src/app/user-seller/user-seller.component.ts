import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MusicItem } from '../shared/music-item.model';

@Component({
  selector: 'app-user-seller',
  templateUrl: './user-seller.component.html',
  styleUrls: ['./user-seller.component.css']
})
export class UserSellerComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public user: User;
  public musicItemList: MusicItem[];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.getMusicList();
  }

  getUserInfo(){
    return this.http.get(this.rootUrl + '/User/GetUserInfo/'+8).toPromise().then(res => this.user = res as User);
  }

  getMusicList()
  {
    this.http.get(this.rootUrl + '/User/GetMusicAssetWithUser/'+8)
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
        }
      
      // console.log(this.items);
    });
  }
}

export class User {
  userID: String;
  firstName: String;
  lastName: String;
  emailID: String; 
}