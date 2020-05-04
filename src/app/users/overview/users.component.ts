import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from '../shared/user.state';
import {User} from '../shared/user';
import {GetAllUsers} from '../shared/user.action';
import {Navigate} from '@ngxs/router-plugin';

@Component({
  selector: 'app-innotech-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(1600)
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {
  @Select(UserState.users)
  users$: Observable<User[]>;
  limit = 4;
  cardWidth = 100 / this.limit;
  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  goToUpdate(uid: string) {
    this.store.dispatch(new Navigate(['users/update/' + uid]));
  }
}
