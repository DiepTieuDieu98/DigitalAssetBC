import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MusicItem } from '../shared/music-item.model';

@Component({
  selector: 'app-user-seller-item',
  templateUrl: './user-seller-item.component.html',
  styleUrls: ['./user-seller-item.component.css']
})
export class UserSellerItemComponent implements OnInit {
  readonly rootUrl = "https://localhost:5001/api";
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }



}
