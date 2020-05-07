import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './overview/users.component';
import {UserUpdateComponent} from './user-update/user-update.component';

const routes: Routes = [{ path: '', component: UsersComponent },
  { path: 'update/:id', component: UserUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
