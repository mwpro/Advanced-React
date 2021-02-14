import { list } from '@keystone-next/keystone/schema';
import {
  text,
  select,
  integer,
  relationship,
  virtual,
} from '@keystone-next/fields';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    // label: virtual({
    //   extendGraphQLTypes: 'String',
    //   resolver(item) {
    //     return `something...`;
    //   },
    // }),
    total: integer(),
    items: relationship({
      ref: 'OrderItem.order',
      many: true,
    }),
    user: relationship({
      ref: 'User.orders',
    }),
    charge: text(),
  },
});
