import { Component, OnInit } from '@angular/core';
import { MusicService } from '../shared/music.service';
import { NgForm } from '@angular/forms';
import { MusicItem } from '../shared/music-item.model';
import { Music } from '../shared/music.model';
import { HttpClient } from '@angular/common/http';
export const licenceLink = 'licenceLink';
export const musicLink = 'musicLink';
export const musicType = 'musicType';

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
  music: Music = new Music();
  selectedLicence: File = null;
  selectedMusic: File = null;

  constructor(public service: MusicService,
    private http:HttpClient) { }

  ngOnInit(): void {
    this.resetForm();

    this.service.getMusicList().then(res => this.musicItemList = res as MusicItem[]);
    this.getUserList();
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

  musicTypeChange(value: any)
  {
    sessionStorage.setItem(musicType, value);
    // console.log(sessionStorage.getItem(musicType));
  }

  addMusic(musicInfo)
  {
    // let musicInfo = this.service.formData;
    // this.service.addMusicService(musicInfo);
    // console.warn(musicInfo);

    const licence = new FormData();
    licence.append('myFile', this.selectedLicence, this.selectedLicence.name + '.pdf');
    this.http.post(this.rootUrl + '/UploadMusicAsset/licence', licence)
    .subscribe(res=>{
      sessionStorage.setItem(licenceLink, res['licenceLink']);
      // console.warn(res);
    });

    var music = sessionStorage.getItem(musicType);

    if (Number(music) == 0)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name + '.zip');
      this.http.post(this.rootUrl + '/UploadMusicAsset/lyrics', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['lyricsLink']);
      });
    }
    else if (Number(music) == 1)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name + '.zip');
      this.http.post(this.rootUrl + '/UploadMusicAsset/audio', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['audioLink']);
      });
    }
    else if (Number(music) == 2)
    {
      const musicAsset = new FormData();
      musicAsset.append('myFile', this.selectedMusic, this.selectedMusic.name + '.zip');
      this.http.post(this.rootUrl + '/UploadMusicAsset/video', musicAsset)
      .subscribe(res=>{
        sessionStorage.setItem(musicLink, res['videoLink']);
      });
    }

    this.service.formData = musicInfo;
    this.service.formData.licenceLink = sessionStorage.getItem(licenceLink);
    this.service.formData.musicLink = sessionStorage.getItem(musicLink);
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