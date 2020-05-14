import {Cart} from './cart';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetCart, GetProductsInCart} from './cart.action';
import {first, switchAll, switchMap, tap} from 'rxjs/operators';
import {CartService} from './cart.service';
import {Product} from '../../products/shared/product';
import {ProductService} from '../../products/shared/product.service';
import {Observable} from 'rxjs';


export class CartStateModel {
  userCart: Cart;
  productsInCart: Array<Product>;
}


@State<CartStateModel>( {
  name: 'carts',
  defaults: {
    userCart: undefined,
    productsInCart: []
  }
})
@Injectable()
export class CartState {
  constructor(private cartService: CartService,
              private productService: ProductService,
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

  @Action(GetProductsInCart)
  getProductsInCart({getState, setState}: StateContext<CartStateModel>) {
    const state1 = getState();
    const arrayOfIds: string[] = [];

    for (let i = state1.userCart.productInCart.length - 1; i >= 0; i--) {
      arrayOfIds.push(state1.userCart.productInCart[i].productRef);
    }

    return this.productService.getProductsInCart(arrayOfIds)
      .pipe(first(),
        tap(pInCart => {
          setState({
            ...state1,
            productsInCart: pInCart
          });
        })
      );
  }
}
