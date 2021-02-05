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
    // todo add roles, cart, orders
  },
});
