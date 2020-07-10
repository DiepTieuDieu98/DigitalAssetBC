import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from '@angular/router';
export const UserID = 'UserID';
@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public keyInfo: Key1;
  public userID = sessionStorage.getItem(UserID);
  public hashedMessageKey1: String;
  public signatureKey1: String;
  public pValue: String;
  public fullKey1X: string;
  public checkSign: boolean;
  public verifyInfo: VerifySign;
  public musicId: String;
  public key2: string;
  public createKey: CreateKey;
  public blobName: string;
  public keyCreateCheck: boolean;
  public fullKeyOld: string;
  public fullKeyNew: string;
  public musicNewLink : string;
  public musicInfoUpdatefullKeyNew: MusicInfoUpdate;
  public updateCheck: boolean;
  public updateProgressCheck: boolean;
  public updateMusicInfoCheck: boolean;
  public inheritUserId: Number;
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMusicInfo();
    this.keyCreateCheck = false;
    this.updateCheck = false;
    this.updateMusicInfoCheck = false;
    const infoMusic = this.route.snapshot.paramMap.get('id');
    this.inheritUserId = Number.parseInt(infoMusic.split("_")[1]);
  }

  getMusicInfo()
  {
    const infoMusic = this.route.snapshot.paramMap.get('id');
    this.http.get(this.rootUrl + '/Music/GetMusicWithId/'+infoMusic.split("_")[0])
      .subscribe(res =>{
          this.key2 = res["key2"];
          this.fullKeyOld = res["fullKey"];
          this.blobName = res["musicLink"].substring(49);
          // console.log(this.blobName);
      });
  }

  changeOwnerShip()
  {
    const assetUpdate = new FormData();
    assetUpdate.append('blobName', this.blobName);
    assetUpdate.append('old_password', this.fullKeyOld.toString());
    assetUpdate.append('new_password', this.fullKeyNew.toString());

    this.updateProgressCheck = false;
    this.http.post(this.rootUrl + '/UploadMusicAsset/CopyFileEncryptAndUploadAudioOwnerShip', assetUpdate)
    .subscribe(
      res=>{
        this.updateCheck = true;
        this.updateProgressCheck = true;
        this.musicNewLink = res["musicLink"];
        this.toastr.success("Mã hóa nhạc số thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 2000
        });
      });

    // console.log(this.musicInfoUpdatefullKeyNew);
    // console.log(this.assetUpdate);
  }

  updateInfoForMusic(ownerInfo)
  {
    const infoMusic = this.route.snapshot.paramMap.get('id');
    this.musicInfoUpdatefullKeyNew = ownerInfo;

    if (this.inheritUserId != 0)
    {
      this.musicInfoUpdatefullKeyNew.ownerId = this.inheritUserId;
    }
    this.musicInfoUpdatefullKeyNew.musicId = infoMusic.split("_")[0];
    this.musicInfoUpdatefullKeyNew.key1 = this.fullKey1X;
    this.musicInfoUpdatefullKeyNew.fullKey = this.fullKeyNew;
    this.musicInfoUpdatefullKeyNew.musicLink = this.musicNewLink;

    this.http.post(this.rootUrl + '/Music/UpdateKey', this.musicInfoUpdatefullKeyNew)
    .subscribe(
      res=>{
        this.updateMusicInfoCheck = true;
        this.toastr.success("Cập nhật nhạc số thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 2000
        });
      });
  }

  createNewKey()
  {
    this.createKey = new CreateKey();
    this.createKey.key1X = Number.parseFloat(this.fullKey1X);
    this.createKey.key2X = Number.parseFloat(this.key2);
    this.http.post(this.rootUrl + '/Music/CreateFullKey', this.createKey)
    .subscribe(
      res=>{
        this.keyCreateCheck = true;
        // console.log(res['fullKey']);
        this.fullKeyNew = res['fullKey'];
        this.toastr.success("Tạo khóa mới thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 2000
        });
      });
  }

  addKey1(keyInfoForm)
  {
    this.keyInfo = keyInfoForm;
    this.keyInfo.keyType = 1;
    this.keyInfo.userID = Number.parseInt(this.userID);
    // console.log(this.keyInfo);
    this.http.post(this.rootUrl + '/Music/SignDataKey1', this.keyInfo)
    .subscribe(res => {
      // console.warn(res['sign']);
      this.hashedMessageKey1 = res["hashMess"];
      this.signatureKey1 = res["sign"];
      this.pValue = res["pValue"];
      this.fullKey1X = res["key1"];
    });
  }

  signKey1(signInfoForm)
  {
    this.verifyInfo = signInfoForm;
    this.verifyInfo.keyType = 1;
    this.verifyInfo.userID = Number.parseInt(this.userID);
    // console.log(this.keyInfo);
    this.http.post(this.rootUrl + '/Music/VerifySignature', this.verifyInfo)
    .subscribe(res => {
      // console.warn(res['checkSign']);
      this.checkSign = res["checkSign"];
    });
  }

}

export class Key1 {
  key1X: Number;
  keyType: Number;
  userID: Number;
}

export class VerifySign {
  hashedMessage: String;
  signature: String;
  keyType: Number;
  userID: Number;
}

export class CreateKey {
  key1X: Number;
  key2X: Number;
}

export class MusicInfoUpdate {
  musicId: string;
  key1: string;
  fullKey: string;
  ownerId: Number;
  musicLink: string;
}

export class AssetUpdate {
  blobName: string;
  old_password: string;
  new_password: string;
}