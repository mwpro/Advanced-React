// At it's simplest AC is bool if user can access using session

import { ListAccessArgs } from './types';
import { permissionsList } from './schemas/fields';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatePermissions = Object.fromEntries(
  permissionsList.map((p) => [
    p,
    function ({ session }: ListAccessArgs): boolean {
      return !!session?.data.role?.[p];
    },
  ])
);

// permissions check
export const permissions = {
  ...generatePermissions,
};

// rule based functions
// rules can return a boolean or a filter which limits items can be crud
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // do they have a permission of canManageProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // do they're an author of the product?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      // can read everything
      return true;
    }
    // show only available products
    return { status: 'AVAILABLE' }; // todo use enum for product status
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // do they have a permission of canManageCart?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // do they're an author of the product?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // do they have a permission of canManageCart?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // do they're an author of the product?
    return { order: { user: { id: session.itemId } } };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // do they have a permission of canManageUsers?
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // can only update himself
    return { id: session.itemId };
  },
};
