export default function calcTotalPrice(cart) {
  return cart.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.quantity * item.product.price;
  }, 0);
}
