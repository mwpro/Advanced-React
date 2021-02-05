import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import SingleProduct from '../../components/SingleProduct';

const SINGLE_ITEM_QUERY = gql`
  query {
    Product(where: { id: "601dc021e0d9c6c428192926" }) {
      name
      price
      description
    }
  }
`;

export default function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}
