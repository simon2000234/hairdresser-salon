import {User} from './user';
import {UserService} from './user.service';
import {GetAllUsers, GetUser, UpdateUser} from './user.action';
import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

export class UserStateModel {
  users: User[];
  user2Update: User;
}

@State<UserStateModel>({
  name: 'users',
  defaults: {
    user2Update: undefined,
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

  @Selector()
  static user2update(state: UserStateModel) {
    return state.user2Update;
  }

  @Action(GetUser)
  getUser({getState, setState}: StateContext<UserStateModel>, action: GetUser) {
    const state = getState();
    return this.userService
      .getUser(action.id).pipe(
        tap(user => {
          setState({
            ...state,
            user2Update: user
          });
        })
      );
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

  @Action(UpdateUser)
  updateUser({getState, setState, dispatch}: StateContext<UserStateModel>, action: UpdateUser) {
    return this.userService
      .updateUser(action.user);
  }
}

