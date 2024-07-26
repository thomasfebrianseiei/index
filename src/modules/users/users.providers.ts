import { User } from './user.entity';

import { USER_DETAIL_REPOSITORY, USER_REPOSITORY, BANK_REPOSITORY } from '../../core/constants';
import { UserDetail } from './entity/userdetail.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: USER_DETAIL_REPOSITORY,
    useValue: UserDetail,
  },
  // {
  //     provide: CUSTOMER_REPOSITORY,
  //     useValue: Customer,

  // },
];
