import { list } from '@keystone-next/keystone/schema';
import { text, select, integer, relationship } from '@keystone-next/fields';

export const CartItem = list({
  // todo access
  ui: {
    listView: {
      initialColumns: ['user', 'product', 'quantity'],
    },
  },
  fields: {
    // todo custom label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
    // todo photo
  },
});
