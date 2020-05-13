import {Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext, Store} from '@ngxs/store';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Product} from './product';
import {ProductService} from './product.service';
import {
  CreateProduct,
  DeleteProduct,
  GetAllProducts, GetProduct, GetProductCount,
  StartStreamingNextPage, StartStreamingPrevPage,
  StartStreamProducts, StopStreamNextProducts, StopStreamPrevProducts,
  StopStreamProducts
} from './product.action';
import {Subject} from 'rxjs';
import {Navigate, RouterDataResolved} from '@ngxs/router-plugin';
import {routingConstants, stateKeys} from '../../public/shared/constants';

export class ProductStateModel {
  products: Product[];
  totalPages: number;
  product: Product;
}

@State<ProductStateModel>({
  name: stateKeys.products,
  defaults: {
    products: [],
    totalPages: undefined,
    product: undefined
  }
})
@Injectable()
export class ProductState implements NgxsOnInit {
  private stopSteamProducts$: Subject<any>;
  private stopSteamNextProducts$: Subject<any>;
  private stopSteamPrevProducts$: Subject<any>;
  urlsForProductStream = [routingConstants.slash + routingConstants.products,
    routingConstants.slash + routingConstants.products + routingConstants.slash + routingConstants.create
  ];
  constructor(private productService: ProductService,
              private actions: Actions,
              private store: Store) {}

  @Selector()
  static products(state: ProductStateModel) {
    return state.products;
  }

  @Action(CreateProduct)
  createProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: CreateProduct) {
    return this.productService
      .createProduct(action.product)
      .pipe(
        tap(() => {
          dispatch(new Navigate([routingConstants.products]));
        })
      );
  }

  @Action(GetProduct)
  getProduct({getState, setState}: StateContext<ProductStateModel>, action: GetProduct) {
    const state = getState();
    return this.productService
      .getProduct(action.id).pipe(
        first(),
        tap(theProduct => {
          setState({
            ...state,
            product: theProduct
          });
        })
      );
  }

  @Action(GetAllProducts)
  getAllProducts({getState, setState}: StateContext<ProductStateModel>) {
    const state = getState();
    return this.productService
      .getProducts().pipe(
        first(),
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        })
      );
  }
  @Action(StartStreamingNextPage)
  nextPage({getState, setState}: StateContext<ProductStateModel>) {
    this.store.dispatch(new StopStreamProducts());
    this.store.dispatch(new StopStreamPrevProducts());
    this.stopSteamNextProducts$ = new Subject<void>();
    const state = getState();
    return this.productService
      .getNextProducts().pipe(
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        }),
        takeUntil(this.stopSteamNextProducts$)
      );
  }

  @Action(StopStreamNextProducts)
  stopNext() {
    if (this.stopSteamNextProducts$ != null) {
      this.stopSteamNextProducts$.next();
      this.stopSteamNextProducts$.complete();
      this.stopSteamNextProducts$ = null;
    }
  }

  @Action(StartStreamingPrevPage)
  prevPage({getState, setState}: StateContext<ProductStateModel>) {
    this.store.dispatch(new StopStreamProducts());
    this.store.dispatch(new StopStreamNextProducts());
    this.stopSteamPrevProducts$ = new Subject<void>();
    const state = getState();
    return this.productService
      .getPrevProducts().pipe(
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        }),
        takeUntil(this.stopSteamPrevProducts$)
      );
  }

  @Action(StopStreamPrevProducts)
  stopPrev() {
    if (this.stopSteamPrevProducts$ != null) {
      this.stopSteamPrevProducts$.next();
      this.stopSteamPrevProducts$.complete();
      this.stopSteamPrevProducts$ = null;
    }
  }

  @Action(StartStreamProducts)
  streamProducts({getState, setState}: StateContext<ProductStateModel>, limit: number) {
    this.stopSteamProducts$ = new Subject<void>();
    const state = getState();
    return this.productService
      .getProducts().pipe(
        tap(allProducts => {
          setState({
            ...state,
            products: allProducts
          });
        }),
        takeUntil(this.stopSteamProducts$)
      );
  }
  @Action(StopStreamProducts)
  stopStreamProducts() {
    if (this.stopSteamProducts$ != null) {
      this.stopSteamProducts$.next();
      this.stopSteamProducts$.complete();
      this.stopSteamProducts$ = null;
    }
  }

  @Action(DeleteProduct)
  deleteProduct({getState, setState, dispatch}: StateContext<ProductStateModel>, action: DeleteProduct) {
    return this.productService
      .deleteProduct(action.product);
  }

  @Action(GetProductCount)
  getProductCount({getState, setState}: StateContext<ProductStateModel>) {
    const state = getState();
    return this.productService
      .getProductCount().subscribe( stream => {
        this.store.dispatch(new StartStreamProducts());
      });
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.actions.pipe(
      ofActionSuccessful(RouterDataResolved)
    ).subscribe((action: RouterDataResolved) => {
      if (this.urlsForProductStream.includes(action.event.url )) {
        if (!this.stopSteamProducts$) {
          this.store.dispatch(new GetProductCount());
        }
      } else {
        if (this.stopSteamProducts$) {
          this.store.dispatch(new StopStreamProducts());
        }
      }
    });
    return undefined;
  }
}




