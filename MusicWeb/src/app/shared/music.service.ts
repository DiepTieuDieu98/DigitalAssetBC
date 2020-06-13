import { Injectable } from '@angular/core';
import { Music } from './music.model';
import { MusicItem } from './music-item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  public formData: Music;
  public musicItems: MusicItem[];
  public apiURL = "https://localhost:5001/api";

  constructor(private http:HttpClient) { }

  getMusicList(){
    return this.http.get(this.apiURL + '/Music').toPromise();
  }

  addMusicService(formData){
    this.http.post(this.apiURL + '/Music', formData)
    .subscribe(()=>{
      console.warn(formData);
    });
  }
}
