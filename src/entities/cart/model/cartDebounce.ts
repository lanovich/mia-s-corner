import { cartService } from "./cartService";

let debounceTimer: NodeJS.Timeout;

export const debouncedUpdateCartFullPrice = (fullPrice: number) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    cartService.updateCartFullPrice(fullPrice);
  }, 500);
};
