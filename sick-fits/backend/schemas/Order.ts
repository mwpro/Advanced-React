import { list } from '@keystone-next/keystone/schema';
import {
  text,
  select,
  integer,
  relationship,
  virtual,
} from '@keystone-next/fields';

export const Order = list({
  // todo access
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
