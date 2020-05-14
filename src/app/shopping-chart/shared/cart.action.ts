
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
