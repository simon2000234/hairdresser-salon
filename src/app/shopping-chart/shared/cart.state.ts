import {Cart} from './cart';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetCart} from './cart.action';
import {tap} from 'rxjs/operators';
import {CartService} from './cart.service';


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
  constructor(private cartService: CartService) {}

  @Selector()
  static userCart(state: CartStateModel) {
    return state.userCart;
  }

  @Action(GetCart)
  getCart({getState, setState}: StateContext<CartStateModel>, action: GetCart) {
    console.log('hallo');
    const state = getState();
    return this.cartService
      .getCart(action.id).pipe(
        tap(cart => {
          setState({
            ...state,
            userCart: cart
          });
        })
      );

  }
}

