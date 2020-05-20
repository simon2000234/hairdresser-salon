import {Cart} from './cart';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {AddProductToCart, GetCart, GetProductsInCart, PurchaseProducts, RemoveProductFromCart} from './cart.action';
import {first, switchMap, takeUntil, tap} from 'rxjs/operators';
import {CartService} from './cart.service';
import {Product} from '../../products/shared/product';
import {ProductService} from '../../products/shared/product.service';
import {UserState} from '../../users/shared/user.state';



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
  @Selector()
  static productsInCart(state: CartStateModel) {
    return state.productsInCart;
  }

  @Action(AddProductToCart)
  addProductToCar({getState, setState}: StateContext<CartStateModel>, action: AddProductToCart) {
    return this.store.select(UserState.currentUser)
      .pipe(first(), switchMap(u => {
        return this.cartService.addProductToCart(action.prodId, u.cartId);
      }));
  }

  @Action(RemoveProductFromCart)
  removeProductFromCart({getState, setState}: StateContext<CartStateModel>, action: RemoveProductFromCart) {
    return this.store.select(UserState.currentUser)
      .pipe(first(), switchMap(u => {
        return this.cartService.removeProductFromCart(action.prodId, u.cartId);
      }));
  }

  @Action(GetCart)
  getCart({getState, setState, dispatch}: StateContext<CartStateModel>, action: GetCart) {
    const state = getState();
    return this.cartService
      .getCart(action.id).pipe(
        first(),
        tap(cart => {

          if (cart.productInCart.length > 0) {
            setState({
              ...state,
              userCart: cart
            });
          } else {
            setState({
              ...state,
              userCart: cart,
              productsInCart: []
            });
          }

        })
      );
  }

  @Action(PurchaseProducts)
  purchaseProducts({getState, setState}: StateContext<CartStateModel>) {
    return this.store.select(UserState.currentUser)
      .pipe(first(), switchMap(u => {
        return this.cartService.purchaseProducts(u.cartId);
      }));
  }

  @Action(GetProductsInCart)
  getProductsInCart({getState, setState}: StateContext<CartStateModel>) {
    const state1 = getState();
    const arrayOfIds: string[] = [];

    for (let i = state1.userCart.productInCart.length - 1; i >= 0; i--) {
      arrayOfIds.push(state1.userCart.productInCart[i].productRef);
    }

    if (state1.userCart.productInCart.length > 0) {
      return this.productService.getProductsInCart(arrayOfIds)
        .pipe(first(),
          tap(pInCart => {
            setState({
              ...state1,
              productsInCart: pInCart
            });
          })
        );
    } else {
      setState({
        ...state1,
        productsInCart: []
      });
    }
  }
}
