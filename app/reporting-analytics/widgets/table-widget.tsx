import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  {
    id: "TR-7829",
    supplier: "Acme Corp",
    amount: "$24,500",
    date: "2023-05-12",
    status: "Completed",
  },
  {
    id: "TR-7830",
    supplier: "TechSys",
    amount: "$18,300",
    date: "2023-05-10",
    status: "Pending",
  },
  {
    id: "TR-7831",
    supplier: "GlobalServ",
    amount: "$32,100",
    date: "2023-05-08",
    status: "Completed",
  },
  {
    id: "TR-7832",
    supplier: "DataCo",
    amount: "$12,750",
    date: "2023-05-05",
    status: "Completed",
  },
]

export function TableWidget() {
  return (
    <div className="max-h-[200px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.supplier}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    transaction.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {transaction.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
