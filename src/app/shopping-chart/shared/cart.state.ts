import {Cart} from './cart';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetCart} from './cart.action';
import {first, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {CartService} from './cart.service';
import {UserState} from '../../users/shared/user.state';
import {GetCurrentUser} from '../../users/shared/user.action';


export class CartStateModel {
  userCart: Cart;
}


@State<CartStateModel>( {
  name: 'carts',
  defaults: {
    userCart: undefined
  }
})
@Injectable()
export class CartState {
  constructor(private cartService: CartService,
              private store: Store) {}

  @Selector()
  static userCart(state: CartStateModel) {
    return state.userCart;
  }

  @Action(GetCart)
  getCart({getState, setState, dispatch}: StateContext<CartStateModel>, action: GetCart) {
    const state = getState();
    return this.cartService
      .getCart(action.id).pipe(
        first(),
        tap(cart => {
          setState({
            ...state,
            userCart: cart
          });
        })
      );
  }
}

