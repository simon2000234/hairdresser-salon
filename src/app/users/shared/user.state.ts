import {User} from './user';
import {UserService} from './user.service';
import {GetAllUsers, GetUser, StarStreamUsers, StopStreamUsers, UpdateUser} from './user.action';
import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {RouterDataResolved} from '@ngxs/router-plugin';

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
export class UserState implements NgxsOnInit {
  private stopSteamUsers$: Subject<any>;
  urlsForUsersStream = ['/users'];

  constructor(private userService: UserService,
              private actions: Actions,
              private store: Store) {
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

  @Action(StarStreamUsers)
  streamUsers({getState, setState}: StateContext<UserStateModel>, limit: number) {
    this.stopSteamUsers$ = new Subject<void>();
    const state = getState();
    return this.userService
      .getAllUsers().pipe(
        tap(allUsers => {
          setState({
            ...state,
            users: allUsers
          });
        }),
        takeUntil(this.stopSteamUsers$)
      );
  }
  @Action(StopStreamUsers)
  stopStreamUsers() {
    if (this.stopSteamUsers$ != null) {
      this.stopSteamUsers$.next();
      this.stopSteamUsers$.complete();
      this.stopSteamUsers$ = null;
    }
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.actions.pipe(
      ofActionSuccessful(RouterDataResolved)
    ).subscribe((action: RouterDataResolved) => {
      if (this.urlsForUsersStream.includes(action.event.url )) {
        if (!this.stopSteamUsers$) {
          this.store.dispatch(new StarStreamUsers());
        }
      } else {
        if (this.stopSteamUsers$) {
          this.store.dispatch(new StopStreamUsers());
        }
      }
    });
    return undefined;
  }
}


