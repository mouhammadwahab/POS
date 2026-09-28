import { fetchAll, num } from "@/lib/data";
import { karachiStart, pkr } from "@/lib/format";

type Sale = { id: number; grand_total: number; status: string; created_at: string };
type Item = {
  sale_id: number;
  unit_price: number;
  purchase_price_at_sale: number;
  quantity: number;
  discount: number;
};
type Product = {
  is_active: boolean;
  stock_qty: number;
  min_stock_alert: number;
  purchase_price: number;
};

function inRange(value: string, from: Date) {
  return new Date(value).getTime() >= from.getTime();
}

function itemProfit(item: Item) {
  return (
    (num(item.unit_price) - num(item.purchase_price_at_sale)) * num(item.quantity) -
    num(item.discount)
  );
}

export default async function DashboardPage() {
  const [sales, items, products] = await Promise.all([
    fetchAll("sales", "created_at"),
    fetchAll("sale_items", "id"),
    fetchAll("products", "name"),
  ]);

  const completed = (sales as Sale[]).filter((sale) => sale.status === "completed");
  const completedIds = new Set(completed.map((sale) => sale.id));
  const lines = (items as Item[]).filter((item) => completedIds.has(item.sale_id));
  const catalog = (products as Product[]).filter((product) => product.is_active);

  const today = karachiStart(0);
  const week = karachiStart(-6);
  const month = karachiStart(0, true);

  const salesTotal = (from?: Date) =>
    completed
      .filter((sale) => !from || inRange(sale.created_at, from))
      .reduce((sum, sale) => sum + num(sale.grand_total), 0);

  const profitTotal = (from?: Date) =>
    lines
      .filter((item) => {
        if (!from) return true;
        const sale = completed.find((row) => row.id === item.sale_id);
        return sale ? inRange(sale.created_at, from) : false;
      })
      .reduce((sum, item) => sum + itemProfit(item), 0);

  const inventoryValue = catalog.reduce(
    (sum, product) => sum + num(product.stock_qty) * num(product.purchase_price),
    0,
  );
  const lowStock = catalog.filter(
    (product) => num(product.stock_qty) > 0 && num(product.stock_qty) <= num(product.min_stock_alert),
  ).length;
  const outOfStock = catalog.filter((product) => num(product.stock_qty) <= 0).length;

  const cards = [
    ["Today's sales", pkr(salesTotal(today))],
    ["Weekly sales", pkr(salesTotal(week))],
    ["Monthly sales", pkr(salesTotal(month))],
    ["All-time sales", pkr(salesTotal())],
    ["Today's profit", pkr(profitTotal(today)), true],
    ["Weekly profit", pkr(profitTotal(week)), true],
    ["Monthly profit", pkr(profitTotal(month)), true],
    ["All-time profit", pkr(profitTotal()), true],
    ["Inventory value", pkr(inventoryValue)],
    ["Low stock", String(lowStock)],
    ["Out of stock", String(outOfStock)],
    ["Completed sales", String(completed.length)],
  ] as const;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="grid">
        {cards.map(([label, value, good]) => (
          <div className={good ? "stat good" : "stat"} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
