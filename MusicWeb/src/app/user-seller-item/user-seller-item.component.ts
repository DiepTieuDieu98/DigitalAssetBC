import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MusicItem } from '../shared/music-item.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
export const approveType = 'approveType';

@Component({
  selector: 'app-user-seller-item',
  templateUrl: './user-seller-item.component.html',
  styleUrls: ['./user-seller-item.component.css']
})
export class UserSellerItemComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public musicTransact: MusicTransaction[];
  public licenceMusicTransact: MusicTransaction[];
  public approveMusicTransact: TransactionGet[];

  constructor(private http:HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getTransacMusic();
    this.getLicenceTransacMusic();
  }

  getTransacMusic(){
    const musicId = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/MusicAssetTransfersController/GetMusicTransfers/'+musicId)
    .subscribe(
      res=>{
        this.musicTransact = res as MusicTransaction[];
        for(let i = 0; i < this.musicTransact.length; i++)
        {
          this.musicTransact[i].transactionHashLink = this.musicTransact[i].transactionHash;
          if (this.musicTransact[i].transactionHash.length > 20)
          {
            this.musicTransact[i].transactionHash = this.musicTransact[i].transactionHash.substring(0, 25)+'...';
          }
        }
        
      });
  }

  getLicenceTransacMusic(){
    const musicId = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/MusicAssetTransfersController/GetLicenceMusicTransfers/'+musicId)
    .subscribe(
      res=>{
        this.licenceMusicTransact = res as MusicTransaction[];
        for(let i = 0; i < this.licenceMusicTransact.length; i++)
        {
          this.licenceMusicTransact[i].transactionHashLink = this.licenceMusicTransact[i].transactionHash;
          if (this.licenceMusicTransact[i].transactionHash.length > 20)
          {
            this.licenceMusicTransact[i].transactionHash = this.licenceMusicTransact[i].transactionHash.substring(0, 25)+'...';
          }
        }
      });
  }

  aprroveTypeChange(value: any)
  {
    sessionStorage.setItem(approveType, value);
    // console.log(value);
  }

  approveTransaction()
  {
    const musicAssetTranferId = sessionStorage.getItem(approveType);
    this.http.get(this.rootUrl + '/MusicAssetTransfersController/'+musicAssetTranferId)
    .subscribe(
      res=>{
        this.approveMusicTransact = res as TransactionGet[];
        this.approveMusicTransact['fromUserId'] = this.approveMusicTransact['fromId'];
        this.approveMusicTransact['toUserId'] = this.approveMusicTransact['toId'];
        this.approveMusicTransact['duration'] = 0;
        // console.log(this.approveMusicTransact);

        this.http.put(this.rootUrl + '/MusicAssetTransfersController/'+musicAssetTranferId, this.approveMusicTransact)
        .subscribe(()=>{
          this.toastr.success("Giao dịch bản quyền thành công", "Success", {
            positionClass: "toast-top-right",
            timeOut: 3000
          });
          setTimeout(() => 
          {
            this.router.navigate(['/music/user-seller/'+1]);
          },
          3000);
        });
      });
  }


}

export class MusicTransaction {
  id: String;
  musicId: String;
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
}


export class TransactionGet {
  musicId: String;
  fromUserId: String;
  toUserId: String;
  tranType: String;
  fanType: String;
  duration: Number;
  amountValue: Number;
  isPermanent: boolean;
}