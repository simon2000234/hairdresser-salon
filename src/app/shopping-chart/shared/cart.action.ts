
export class GetCart {
  static readonly type = '[Carts] GetCart';
  constructor(public id: string) {}
}

export class GetProductsInCart {
  static readonly type = '[Carts] GetProductsInCart';

  constructor() {}
}

export class AddProductToCart {
  static readonly type = '[Carts] AddProductToCart';
  constructor(public prodId: string) {}
}

export class RemoveProductFromCart {
  static readonly type = '[Carts] RemoveProductFromCart';
  constructor(public prodId: string) {
  }
}

export class StartStreamCart {
  static readonly type = '[Carts] StartStreamCart';

  constructor(public cartId: string) {}
}

export class StopStreamCart {
  static readonly type = '[Carts] StopStreamCart';

  constructor() {}
}
