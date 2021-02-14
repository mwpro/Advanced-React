import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        quantity
        price
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { order } = data;

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{order.items.length}</span>
      </p>

      <h2>Order Items</h2>
      <div className="items">
        {order.items.map((orderItem) => (
          <div key={orderItem.id} className="order-item">
            <img
              src={orderItem.photo.image.publicUrlTransformed}
              alt={orderItem.photo.altText}
            />
            <div className="details">
              <h2>{orderItem.name}</h2>
              <p>Quantity: {orderItem.quantity}</p>
              <p>Each: {formatMoney(orderItem.price)}</p>
              <p>
                Sub Total: {formatMoney(orderItem.price * orderItem.quantity)}
              </p>
              <p>{orderItem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
