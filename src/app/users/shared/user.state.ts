import {User} from './user';
import {UserService} from './user.service';
import {GetAllUsers} from './user.action';
import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';


export class UserStateModel {
  users: User[];
}

@State<UserStateModel>({
  name: 'users',
  defaults: {
    users: []
  }
})
@Injectable()
export class UserState {
  constructor(private userService: UserService) {
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.users;
  }

  @Action(GetAllUsers)
  getAllUsers({getState, setState}: StateContext<UserStateModel>) {
    const state = getState();
    return this.userService
      .getAllUsers().pipe(
        first(),
        tap(allUsers => {
          setState({
            ...state,
            users: allUsers
          });
        })
      );
  }
}

