export type Sellability = {
  stock: number;
  vendingEnabled: boolean;
  lowStockThreshold?: number;
};

export function isSellable(product: Sellability): boolean {
  return product.vendingEnabled && product.stock > 0;
}

export function isOutOfStock(product: Sellability): boolean {
  return product.stock <= 0;
}

export function isLowStock(product: Sellability): boolean {
  const threshold = product.lowStockThreshold ?? 3;
  return (
    product.vendingEnabled &&
    product.stock > 0 &&
    product.stock <= threshold
  );
}

export function sellabilityLabel(product: Sellability): string {
  if (!product.vendingEnabled) return "Vending disabled";
  if (isOutOfStock(product)) return "Out of stock";
  if (isLowStock(product)) return "Low stock";
  return "In stock";
}
