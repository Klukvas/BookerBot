
type CalculatePriceArgs = {
  price: number 
  duration: string
}

export function calculatePrice({ price, duration }: CalculatePriceArgs): number {
  const [hours, minutes] = duration.split(':').map(Number);

  const totalMinutes = hours * 60 + minutes;
  const totalPrice = (totalMinutes / 60) * price;

  return totalPrice;
}

