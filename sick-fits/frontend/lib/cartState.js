import { createContext, useContext, useState } from 'react';

const localStateContext = createContext();
const LocalStateProvider = localStateContext.Provider;

function CartStateProvider({ children }) {
  // this is a custom provider
  // we will store data (state and functionality
  // (updaters) and anyone can access it via the consumers

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider value={{ cartOpen, toggleCart, closeCart, openCart }}>
      {children}
    </LocalStateProvider>
  );
}

// hook for accessing cart local state
function useCart() {
  // use consumer to access the local state
  const all = useContext(localStateContext);
  return all;
}

export { CartStateProvider, useCart };
