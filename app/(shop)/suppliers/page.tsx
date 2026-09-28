import { fetchAll, num, text } from "@/lib/data";
import { pkr } from "@/lib/format";

type Supplier = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  outstanding_balance: number;
};

export default async function SuppliersPage() {
  const suppliers = (await fetchAll("suppliers", "name")) as Supplier[];
  return (
    <>
      <h1>Suppliers</h1>
      <div className="table-wrap">
        {suppliers.length === 0 ? (
          <div className="empty">No suppliers synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{text(supplier.phone)}</td>
                  <td>{text(supplier.address)}</td>
                  <td>{pkr(num(supplier.outstanding_balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
