import { fetchAll, num, text } from "@/lib/data";
import { pkr } from "@/lib/format";

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  outstanding_balance: number;
  reward_points: number;
};

export default async function CustomersPage() {
  const customers = (await fetchAll("customers", "name")) as Customer[];
  return (
    <>
      <h1>Customers</h1>
      <div className="table-wrap">
        {customers.length === 0 ? (
          <div className="empty">No customers synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Outstanding</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{text(customer.phone)}</td>
                  <td>{text(customer.address)}</td>
                  <td>{pkr(num(customer.outstanding_balance))}</td>
                  <td>{customer.reward_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
