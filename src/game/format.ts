export function formatMoney(thousands: number): string {
  return `$${(thousands * 1000).toLocaleString('en-US')}`
}

export function formatMoneyShort(thousands: number): string {
  return `$${thousands}k`
}
