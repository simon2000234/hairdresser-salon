// Get Users 1 time and stop listening
import {User} from './user';

export class GetAllUsers {
  static readonly type = '[Users] GetAllUsers';

  constructor() {}
}

export class UpdateUser {
  static readonly type = '[Users] UpdateUser';

  constructor(public user: User) {}
}

export class GetUser {
  static readonly  type = '[Users} GetUser';

  constructor(public id: string) {}
}

export class GetCurrentUser {
  static readonly type = '[Users] GetCurrentUser';

  constructor() {}
}

export class StarStreamUsers {
  static readonly type = '[Users] StartStreamUsers';

  constructor() {}
}

export class StopStreamUsers {
  static readonly type = '[Users] StopStreamUsers';

  constructor() {}
}
