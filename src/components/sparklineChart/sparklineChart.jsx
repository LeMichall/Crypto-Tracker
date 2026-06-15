import{
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from "recharts";
import {formatCurrency} from "../../utils/formatter";

export default function SparklineChart({data=[], currency="usd", height=120}){
  const clean =data.filter((v) => typeof v === "number");
  if(clean.length === 0) return null;

  const now = new Date();
  const rechartsData = clean.map((price, i) => {
    const timestamp = new Date(now.getTime() - (clean.length -1 -i)*60*60*1000);
    return{
      time: timestamp.toLocaleDateString("en-US", {weekday: "short"}),
      price,
    }
});
const first = rechartsData[0].price;
  const last = rechartsData[rechartsData.length - 1].price;
  const min = Math.min(...rechartsData.map((d) => d.price));
  const max = Math.max(...rechartsData.map((d) => d.price));
  const changePct = first ? ((last - first) / first) * 100 : 0;
  const positive = last >= first;
  const gradientId = `grad-${positive ? "up" : "down"}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].value;
    return (
      <div style={{ background: "rgba(0,0,0,0.8)", color: "#fff", padding: 8, borderRadius: 6 }}>
        <div style={{ fontSize: 12 }}>{`Dzień: ${label}`}</div>
        <div style={{ fontWeight: 600 }}>{formatCurrency(p, currency)}</div>
      </div>
    );
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontWeight: 700 }}>{formatCurrency(last, currency)}</div>
        <div style={{ color: positive ? "#2ecc71" : "#e74c3c" }}>
          {changePct >= 0 ? "+" : ""}
          {changePct.toFixed(2)}%
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={rechartsData}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={positive ? "#2ecc71" : "#e74c3c"} stopOpacity={0.6} />
              <stop offset="95%" stopColor={positive ? "#2ecc71" : "#e74c3c"} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(rechartsData.length / 6))} />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke={positive ? "#2ecc71" : "#e74c3c"}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />

          <ReferenceDot
            x={rechartsData[rechartsData.length - 1].time}
            y={last}
            r={3}
            fill={positive ? "#2ecc71" : "#e74c3c"}
            stroke="#fff"
            strokeWidth={1}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#666" }}>
        <div>min: {formatCurrency(min, currency)}</div>
        <div>max: {formatCurrency(max, currency)}</div>
      </div>
    </div>
  );

}