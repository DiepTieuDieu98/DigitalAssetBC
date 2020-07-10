import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-check-key',
  templateUrl: './check-key.component.html',
  styleUrls: ['./check-key.component.css']
})
export class CheckKeyComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public musicId: String;
  public blobName: string;
  public key1: string;
  public mediaLink: string;
  public mediaLinkTrust: SafeUrl;
  public musicLinkTrust: SafeUrl;
  public createKey: CreateKey;
  public blobUpdate: BlobUpdate;
  public fullKey: Number;
  public fullKeyCheck: boolean;
  public creatureType: Number;
  constructor(private http:HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  playMusic()
  {
    const infoId = this.route.snapshot.paramMap.get('id');
    this.blobName = infoId.split("_")[2];
    // console.log(this.fullKey);
    const blobUpdate = new FormData();
    blobUpdate.append('blobName', this.blobName);
    blobUpdate.append('password', this.fullKey.toString());
    // this.blobUpdate = new BlobUpdate();
    // this.blobUpdate.blobName = this.blobName;
    // this.blobUpdate.password = this.fullKey.toString();
    this.http.post(this.rootUrl + '/UploadMusicAsset/DownloadFileEncryptAndUploadMedia', blobUpdate)
      .subscribe(
        res=>{
          this.toastr.success("Mã hóa file thành công", "Success", {
            positionClass: "toast-top-right",
            timeOut: 2000
          });
      });
  }

  loadInfoSubmit(verifyInfo)
  {
    const infoId = this.route.snapshot.paramMap.get('id');
    this.musicId = infoId.split("_")[0];
    this.http.get(this.rootUrl + '/Music/GetMusicWithId/'+this.musicId)
    .subscribe(
      res=>{
        this.creatureType = res['creatureType'];
        this.createKey = verifyInfo;
        this.createKey.key1X = Number.parseFloat(verifyInfo['key1']);
        this.createKey.key2X = Number.parseFloat(res['key2']);
        this.http.post(this.rootUrl + '/Music/CreateFullKey', this.createKey)
        .subscribe(
          resNew=>{
            this.fullKey = resNew['fullKey'];
              // console.log(this.fullKey);
              // console.log(res['fullKey']);
            if (this.fullKey == res['fullKey'])
            {
                this.fullKeyCheck = true;
                this.toastr.success("Tạo khóa bảo mật thành công", "Success", {
                  positionClass: "toast-top-right",
                  timeOut: 2000
                });

                if (this.creatureType == 3)
                {
                  if (infoId.split("_")[3] != undefined)
                  {
                    this.mediaLink = "localhost:8080/hdwallets/Streaming/video_streaming.php?mediaLink=" + infoId.split("_")[3];
                    this.mediaLinkTrust = this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/hdwallets/Streaming/video_streaming.php?mediaLink=" + infoId.split("_")[3]);
                  }
                }
                else if (this.creatureType == 2)
                {
                  this.musicLinkTrust = this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/hdwallets/Streaming/play_audio.php?token=" + btoa(res['musicLink'])); 
                }
                
            }
            else
            {
              this.fullKeyCheck = false;
              this.toastr.error("Khóa bảo mật không khớp", "Error", {
                positionClass: "toast-top-right",
                timeOut: 2000
              });
            }
              
          });
      });
  }

  loadInfo()
  {
    const infoId = this.route.snapshot.paramMap.get('id');
    this.musicId = infoId.split("_")[0];
    this.key1 = infoId.split("_")[1];
    this.http.get(this.rootUrl + '/Music/GetMusicWithId/'+this.musicId)
    .subscribe(
      res=>{
        this.createKey = new CreateKey();
        // console.log(res['key2']);
        this.createKey.key1X = Number.parseFloat(this.key1);
        this.createKey.key2X = Number.parseFloat(res['key2']);
        this.http.post(this.rootUrl + '/Music/CreateFullKey', this.createKey)
        .subscribe(
          resNew=>{
            this.fullKey = resNew['fullKey'];
              // console.log(this.fullKey);
              // console.log(res['fullKey']);
            if (this.fullKey == res['fullKey'])
            {
              this.fullKeyCheck = true;
              this.toastr.success("Tạo khóa bảo mật thành công", "Success", {
                positionClass: "toast-top-right",
                timeOut: 2000
              });
              this.mediaLink = "localhost:8080/hdwallets/Streaming/video_streaming.php?mediaLink=" + infoId.split("_")[3];
            
              this.mediaLinkTrust = this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/hdwallets/Streaming/video_streaming.php?mediaLink=" + infoId.split("_")[3]);
            }
            else
            {
              this.fullKeyCheck = false;
              this.toastr.error("Khóa bảo mật không khớp", "Error", {
                positionClass: "toast-top-right",
                timeOut: 2000
              });
            }
          });
      });
  }

}

export class CreateKey {
  key1X: Number;
  key2X: Number;
}

export class BlobUpdate {
  blobName: string;
  password: string;
}

