import { PAGINATION_QUERY } from '../components/Pagination';

export default function PaginationField() {
  return {
    keyArgs: false, // tells Apollo we'll take care of everything?
    read(existing = [], { args, cache }) {
      console.log(args, existing, cache);
      const { skip, first } = args;

      // read number of items on page from cahce
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items?
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // ?? if (items.length && (items.length === first || page === pages)) {
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // no items, we need fetch
        return false;
      }

      // if there are items, return them, don't call network
      if (items.length) {
        console.log(`There are ${items.length} items in cache`);
        return items;
      }
      return false; // fallback
      // ask for items
      // return items as they're in cache
      // or return false to make network request
    },
    merge(existing, incoming, { args }) {
      // runs when Apollo client comes back from the network with products
      // so we're telling how to put them in cache
      const { skip, first } = args;
      console.log(`Merging items from the network ${incoming.length}`);

      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      return merged;
    },
  };
}
