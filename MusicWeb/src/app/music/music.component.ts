import { Component, OnInit } from '@angular/core';
import { MusicService } from '../shared/music.service';
import { NgForm } from '@angular/forms';
import { MusicItem } from '../shared/music-item.model';
import { Music } from '../shared/music.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
export const licenceLink = 'licenceLink';
export const musicLink = 'musicLink';
export const demoLink = 'demoLink';
export const mediaLink = 'mediaLink';
export const musicType = 'musicType';
export const UserID = 'UserID';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: [
    './music.component.css']
})
export class MusicComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  public musicItemList: MusicItem[];
  public userList: User[];
  public keyInfo: Key1;
  public keyServerInfo: Key2;
  public verifyInfo: VerifySign;
  music: Music = new Music();
  selectedLicence: File = null;
  selectedMusic: File = null;
  selectedMusicDemo: File = null;
  public userID = sessionStorage.getItem(UserID);
  public hashedMessageKey1: String;
  public signatureKey1: String;
  public keyType: Number;
  public checkSign: boolean;
  public checkSignServer: boolean;
  public openFormKey2: boolean;
  public pValue: String;
  public fullKey1X: String;
  public fullKey: string;
  public key2: string;
  public hashedMessageKeyServer: String;
  public signatureKeyServer: String;
  public openFormUploadMusic: boolean;
  public openFormAddMusic: boolean;
  
  constructor(public service: MusicService,
    private http:HttpClient,
    private toastr: ToastrService) { 
      this.openFormKey2 = false;
      this.openFormAddMusic = false;
      this.openFormUploadMusic = false;
    }

  ngOnInit(): void {
    this.resetForm();

    this.service.getMusicList().then(res => this.musicItemList = res as MusicItem[]);
    this.getUserList();
  }

  activeFormKey2()
  {
    this.openFormKey2 = true;
  }

  activeFormUploadMusic()
  {
    this.openFormUploadMusic = true;
  }

  activeFormAddMusic()
  {
    this.openFormAddMusic = true;
  }

  resetForm(form?: NgForm)
  {
    if (form = null)
    {
      form.resetForm();
    }
    this.service.formData = {
      name: '',
      title: '',
      album: '',
      publishingYear: '',
      ownerId: 0,
      licenceLink: '',
      musicLink: '',
      demoLink: '',
      mediaLink: '',
      key1: '',
      key2: '',
      fullKey: '',
      creatureType: '',
      ownerType: '',
  
      transactionHash: '',
      contractAddress: '',
    };
    // this.service.musicItems = [];
  }

  onLicenceSelected(event)
  {
    this.selectedLicence = <File>event.target.files[0];

  }

  musicAssetChange(event)
  {
    this.selectedMusic = <File>event.target.files[0];
  }

  musicAssetDemoChange(event)
  {
    this.selectedMusicDemo = <File>event.target.files[0];
  }

  musicTypeChange(value: any)
  {
    sessionStorage.setItem(musicType, value);
    // console.log(sessionStorage.getItem(musicType));
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

  addKey2(keyServerInfoForm)
  {
    this.keyServerInfo = keyServerInfoForm;
    this.keyServerInfo.pValue = this.pValue;
    this.keyServerInfo.fullKey1X = this.fullKey1X;
    this.keyServerInfo.keyType = 1;
    // console.log(this.keyServerInfo);
    this.http.post(this.rootUrl + '/Music/SignDataKey2Server', this.keyServerInfo)
    .subscribe(res => {
      // console.warn(res['sign']);
      this.hashedMessageKeyServer = res["hashMess"];
      this.signatureKeyServer = res["sign"];
      this.fullKey = res["fullKey"];
      this.key2 = res["key2"];
    });
  }

  signKeyServer(signInfoForm)
  {
    this.verifyInfo = signInfoForm;
    this.verifyInfo.keyType = 0;
    this.verifyInfo.userID = Number.parseInt(this.userID);
    // console.log(this.keyInfo);
    this.http.post(this.rootUrl + '/Music/VerifySignature', this.verifyInfo)
    .subscribe(res => {
      // console.warn(res['checkSign']);
      this.checkSignServer = res["checkSign"];
    });
  }

  encryptMusic()
  {
    var music = sessionStorage.getItem(musicType);
    if (Number(music) == 0)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      musicAsset.append('password', this.fullKey);
      console.log(musicAsset.get('password'));
      this.http.post(this.rootUrl + '/UploadMusicAsset/EncryptFileMusic', musicAsset)
      .subscribe(res=>{
        this.toastr.success("Mã hóa file thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 3000
        });
        setTimeout(() => {
          console.log('hide');
          this.activeFormAddMusic();
        }, 3000);
      });
    }
    else if (Number(music) == 1)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      musicAsset.append('password', this.fullKey);
      this.http.post(this.rootUrl + '/UploadMusicAsset/EncryptFileMusic', musicAsset)
      .subscribe(res=>{
        this.toastr.success("Mã hóa file thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 3000
        });
        setTimeout(() => {
          console.log('hide');
          this.activeFormAddMusic();
        }, 3000);
      });
    }
    else if (Number(music) == 2)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      musicAsset.append('password', this.fullKey);
      this.http.post(this.rootUrl + '/UploadMusicAsset/EncryptFileMusic', musicAsset)
      .subscribe(res=>{
        this.toastr.success("Mã hóa file thành công", "Success", {
          positionClass: "toast-top-right",
          timeOut: 3000
        });
        setTimeout(() => {
          console.log('hide');
          this.activeFormAddMusic();
        }, 3000);
      });
    }
  }

  addMusic(musicInfo)
  {
    // let musicInfo = this.service.formData;
    // this.service.addMusicService(musicInfo);
    // console.warn(musicInfo);

    const licence = new FormData();
    licence.append('myFile', this.selectedLicence, this.selectedLicence.name);
    this.http.post(this.rootUrl + '/UploadMusicAsset/licence', licence)
    .subscribe(res=>{
      sessionStorage.setItem(licenceLink, res['licenceLink']);
      // console.warn(res);
    });

    var music = sessionStorage.getItem(musicType);

    if (Number(music) == 0)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      this.http.post(this.rootUrl + '/UploadMusicAsset/lyrics', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['lyricsLink']);
      });
    }
    else if (Number(music) == 1)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      this.http.post(this.rootUrl + '/UploadMusicAsset/audio', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['audioLink']);
      });
    }
    else if (Number(music) == 2)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name);
      this.http.post(this.rootUrl + '/UploadMusicAsset/video', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['videoLink']);
      });
    }

    if (Number(music) == 1)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusicDemo, this.selectedMusicDemo.name);
      this.http.post(this.rootUrl + '/UploadMusicAsset/audio', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(demoLink, res['audioLink']);
      });
    }
    else if (Number(music) == 2)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusicDemo, this.selectedMusicDemo.name);
      this.http.post(this.rootUrl + '/UploadMusicAsset/video', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(demoLink, res['videoLink']);
      });
    }

    // const musicAsset = new FormData();
    // musicAsset.append('myFile', this.selectedMusicDemo, this.selectedMusicDemo.name);
    // this.http.post(this.rootUrl + '/UploadMusicAsset/MediaTest', musicAsset)
    // .subscribe(res=>{
    //   sessionStorage.setItem(mediaLink, res['url']);
    // });
    
    this.service.formData = musicInfo;
    this.service.formData.licenceLink = sessionStorage.getItem(licenceLink);
    this.service.formData.musicLink = sessionStorage.getItem(musicLink);
    this.service.formData.demoLink = sessionStorage.getItem(demoLink);

    this.service.formData.key1 = this.fullKey1X;
    this.service.formData.key2 = this.key2;
    this.service.formData.fullKey = this.fullKey;

    // this.service.formData.mediaLink = sessionStorage.getItem(mediaLink);
    this.service.addMusicService(this.service.formData);
    // console.log(this.service.formData);
  }

  getUserList(){
    return this.http.get(this.rootUrl + '/User').toPromise().then(res => this.userList = res as User[]);
  }

  onSubmit(form: NgForm){
    
  }

  getMusicList()
  {
    this.service.getMusicList().then(res => this.musicItemList = res as MusicItem[]);
  }

}


export class User {
  userID: String;
  firstName: String;
  lastName: String;
}

export class Key1 {
  key1X: Number;
  keyType: Number;
  userID: Number;
}

export class Key2 {
  pValue: String;
  fullKey1X: String;
  key2X: Number;
  keyType: Number;
}

export class VerifySign {
  hashedMessage: String;
  signature: String;
  keyType: Number;
  userID: Number;
}