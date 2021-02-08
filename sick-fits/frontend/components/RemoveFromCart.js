import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: {
      id,
    },
    update,
    // optimisticResponse: { // sadly does not work :(
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <BigButton
      disabled={loading}
      type="button"
      onClick={() => {
        removeFromCart();
      }}
      title="Remove This Item from Cart"
    >
      &times;
    </BigButton>
  );
}
