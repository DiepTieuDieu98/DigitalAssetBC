import { Component, OnInit } from '@angular/core';
import { MusicService } from '../shared/music.service';
import { NgForm } from '@angular/forms';
import { MusicItem } from '../shared/music-item.model';
import { Music } from '../shared/music.model';
import { HttpClient } from '@angular/common/http';


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
      licenceId: 0,
      creatureType: '',
      ownerType: '',
  
      transactionHash: '',
      contractAddress: '',
    };
    // this.service.musicItems = [];
  }

  addMusic(musicInfo)
  {
    // let musicInfo = this.service.formData;
    this.service.addMusicService(musicInfo);
    // console.warn(musicInfo);
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