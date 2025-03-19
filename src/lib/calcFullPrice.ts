const DISCOUNT_THRESHOLD = 1500;
const DISCOUNT_PERCENTAGE = 0;

export const calcFullPrice = (productTotalAmount: number) => {
  let discount = 0;

  if (productTotalAmount >= DISCOUNT_THRESHOLD) {
    discount = (productTotalAmount * DISCOUNT_PERCENTAGE) / 100;
  }

  const finalAmount = productTotalAmount - discount;

  return { finalAmount, discount };
};
