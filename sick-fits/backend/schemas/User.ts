import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  // todo access:
  // todo ui:
  fields: {
    name: text({
      isRequired: true,
    }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
    }),
    // todo add roles,
  },
});
