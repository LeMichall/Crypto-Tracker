import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SparklineChart({ data }) {
  const now = new Date();

  const rechartsData = data.map((price, index) => {
    const timestamp = new Date(now.getTime() - (168 - index) * 60 * 60 * 1000);

    return {
      time: timestamp.toLocaleDateString("en-US", { weekday: "short" }),
      price,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={rechartsData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="time" interval={23} /> {/* co 24h */}
        <YAxis domain={["auto", "auto"]} width={40} />
        <Tooltip
          formatter={(value) => `$${value.toFixed(2)}`}
          labelFormatter={(label) => `Dzień: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
