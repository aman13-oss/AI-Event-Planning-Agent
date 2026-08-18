import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#f472b6", "#fb923c", "#facc15", "#4ade80", "#38bdf8"];

const LABELS = {
  venue: "Venue",
  catering: "Catering",
  decoration: "Decoration",
  photography: "Photography",
  entertainment: "Entertainment",
  staff_security: "Staff/Security",
  miscellaneous: "Miscellaneous",
  contingency: "Contingency",
};

export default function BudgetChart({ budget }) {
  const data = Object.entries(budget).map(([key, value]) => ({
    name: LABELS[key] || key,
    value,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={50}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-slate-500 mt-1">
        Total: <span className="font-semibold text-slate-700">₹{total.toLocaleString("en-IN")}</span>
      </p>
    </div>
  );
}
