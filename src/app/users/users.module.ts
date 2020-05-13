import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './overview/users.component';
import {FlexModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {UserUpdateComponent} from './user-update/user-update.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';


@NgModule({
  declarations: [UsersComponent, UserUpdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    FlexModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule
  ]
})
export class UsersModule { }
