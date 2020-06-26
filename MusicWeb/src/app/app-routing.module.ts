import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MusicComponent } from './music/music.component';
import { MainPageComponent } from './main-page/main-page.component';
import { StatisticComponent } from './statistic/statistic.component';
import { UserSellerComponent } from './user-seller/user-seller.component';
import { UserSellerItemComponent } from './user-seller-item/user-seller-item.component';
import { UserBuyerComponent } from './user-buyer/user-buyer.component';
import { UserLoginComponent } from './user/user-login.component';
import { UserRegisComponent } from './user/user-regis.component';
import { UserForgotComponent } from './user/user-forgot.component';
import { UserResetComponent } from './user/user-reset.component';
import { UserVerifyComponent } from './user/user-verify.component';
import { UserBuyerItemComponent } from './user-buyer-item/user-buyer-item.component';


const routes: Routes = [
  {path: '', redirectTo: 'music/main-page', pathMatch:'full'},
  {path: 'music', children: [
    {path: 'main-page', component: MainPageComponent},
    {path: 'statistic', component: StatisticComponent},
    {path: 'music-info', component: MusicComponent},
    {path: 'user-seller/:id', component: UserSellerComponent},
    {path: 'user-seller-item/:id', component: UserSellerItemComponent},
    {path: 'user-buyer', component: UserBuyerComponent},
    {path: 'user-login', component: UserLoginComponent},
    {path: 'user-regis', component: UserRegisComponent},
    {path: 'user-forgot', component: UserForgotComponent},
    {path: 'user-reset', component: UserResetComponent},
    {path: 'user-verify/:id', component: UserVerifyComponent},
    {path: 'user-buyer/:id', component: UserBuyerItemComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
