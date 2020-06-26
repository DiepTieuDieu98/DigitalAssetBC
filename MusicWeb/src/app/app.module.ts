import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MusicComponent } from './music/music.component';
import { MusicService } from './shared/music.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './main-page/main-page.component';
import { StatisticComponent } from './statistic/statistic.component';
import { UserSellerComponent } from './user-seller/user-seller.component';
import { UserBuyerComponent } from './user-buyer/user-buyer.component';
import { UserSellerItemComponent } from './user-seller-item/user-seller-item.component';
import { UserLoginComponent } from './user/user-login.component';
import { UserRegisComponent } from './user/user-regis.component';
import { UserForgotComponent } from './user/user-forgot.component';
import { UserResetComponent } from './user/user-reset.component';
import { UserVerifyComponent } from './user/user-verify.component';
// import { NotifierModule } from "angular-notifier";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { UserBuyerItemComponent } from './user-buyer-item/user-buyer-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MusicComponent,
    MainPageComponent,
    StatisticComponent,
    UserSellerComponent,
    UserBuyerComponent,
    UserSellerItemComponent,
    UserLoginComponent,
    UserRegisComponent,
    UserForgotComponent,
    UserResetComponent,
    UserVerifyComponent,
    UserBuyerItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    MusicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


