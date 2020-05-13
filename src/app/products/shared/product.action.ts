import {Product} from './product';
import {User} from '../../users/shared/user';

// Get Products 1 time and stop listening
export class GetAllProducts {
  static readonly type = '[Products] GetAllProducts';
  constructor() {}
}

// Stream next Product page and keep listening
export class StartStreamingNextPage {
  static readonly type = '[Products] StartStreamingNextPage';

  constructor() {}
}

export class GetProduct {
  static readonly  type = '[Products} GetProduct';

  constructor(public id: string) {}
}

export class UpdateProduct {
  static readonly type = '[Products] UpdateProduct';

  constructor(public product: Product) {}
}

// Stop Stream of next Products page
export class StopStreamNextProducts {
  static readonly type = '[Products] StopStreamNextProducts';

  constructor() {}
}

// Get count for pagination
export class GetProductCount {
  static readonly type = '[Products] GetProductCount';

  constructor() {}
}

export class GetProduct {
  static readonly type = '[Products] GetProduct';

  constructor(public id: string) {
  }
}

// Stop Stream of previous Products page
export class StopStreamPrevProducts {
  static readonly type = '[Products] StopStreamPrevProducts';

  constructor() {}
}

// Stream previous Product page and keep listening
export class StartStreamingPrevPage {
  static readonly  type = '[Products] StartStreamingPrevPage';

  constructor() {}
}


// Stream Products and keep listening
export class StartStreamProducts {
  static readonly type = '[Products] StartStreamProducts';

  constructor() {}
}

// Stop Stream of Products
export class StopStreamProducts {
  static readonly type = '[Products] StopStreamProducts';

  constructor() {}
}

export class DeleteProduct {
  static readonly type = '[Products] DeleteProduct';

  constructor(public product: Product) {}
}

export class CreateProduct {
  static readonly type = '[Products] CreateProduct';

  constructor(public product: Product) {}
}
