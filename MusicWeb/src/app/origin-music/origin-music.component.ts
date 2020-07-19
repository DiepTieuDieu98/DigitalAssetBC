import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MusicItem } from '../shared/music-item.model';

@Component({
  selector: 'app-origin-music',
  templateUrl: './origin-music.component.html',
  styleUrls: ['./origin-music.component.css']
})
export class OriginMusicComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public musicItem: MusicItem;
  public firstName: String;
  public lastName: String;
  public musicTransact: MusicTransaction;
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMusicInfo();
    this.getMusicTFInfo();
  }

  getMusicInfo()
  {
    const transactionHash = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/Music/GetMusicWithTransactionHash/'+transactionHash)
    .subscribe(
      res=>{
        this.musicItem = res as MusicItem;
        this.musicItem.id = this.musicItem.id.split("-")[0];
        this.http.get(this.rootUrl + '/User/GetUserInfo/'+ res["ownerId"])
      .subscribe(
        res=>{
          this.firstName = res["firstName"];
          this.lastName = res["lastName"];
        });
      });
  }

  getMusicTFInfo()
  {
    const transactionHash = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/Music/GetMusicTFWithTransactionHash/'+transactionHash)
    .subscribe(
      res=>{
        this.musicTransact = res as MusicTransaction;
        
        if (this.musicTransact.transactionHash.length > 20)
        {
          this.musicTransact.transactionHashLink = this.musicTransact.transactionHash.substring(0, 35)+'...';
        }
      });
  }
}

export class MusicTransaction {
  id: String;
  musicId: String;
  buyerId: String;
  fromId: String;
  toId: String;
  tranType: String;
  fanType: String;
  dateStart: Number;
  dateEnd: Number;
  transactionHash: String;
  transactionHashLink: String;
  dateCreated: String;
  amountValue: Number;
  isConfirmed: boolean;
  
  buyerName: String;
}
