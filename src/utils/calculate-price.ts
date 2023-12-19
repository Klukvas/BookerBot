
type CalculatePriceArgs = {
  price: number 
  duration: number
}

export function calculatePrice({ price, duration }: CalculatePriceArgs): number {
  const totalPrice = (duration / 60) * price;
  return totalPrice;
}

