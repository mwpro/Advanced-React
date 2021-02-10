import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import { Session } from '../types';
import StripeConfig from '../lib/stripe';
import { OrderItem } from '../schemas/OrderItem';

interface Arguments {
  token: string;
}

const graphql = String.raw;

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // check if sign in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! you must be signed in to create an order!');
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
        id
        name
        email
        cart {
            id 
            quantity
            product {
                name
                price
                description
                id
                photo {
                    id
                    image {
                        id
                        publicUrlTransformed
                    }
                }
            }
        }`,
  });
  console.dir(user, { depth: null });

  // calculate total
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const totalPrice = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  console.log(totalPrice);

  // create charge with stripe
  const charge = await StripeConfig.paymentIntents
    .create({
      amount: totalPrice,
      currency: 'PLN',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);

  // convert cartitems to orderitems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
      photo: { connect: { id: cartItem.product.photo.id } },
      // user: { connect: { id: userId } },
    };
    return orderItem;
  });

  // create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: {
        create: orderItems,
      },
      user: { connect: { id: userId } },
    },
  });

  // cleanup cart items
  const cartItemIds = user.cart.map((c) => c.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}

export default checkout;
