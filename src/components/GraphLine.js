import { useState } from "react";
import { Line } from "recharts";

const GraphLine = ({ dataKey, stroke, yAxisId }) => {
    const [hoveredLine, setHoveredLine] = useState(null);

    console.log("GraphLine: dataKey: ", dataKey);

    return (
        <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={hoveredLine === dataKey ? 7 : 2}
            dot={false}
            yAxisId={yAxisId}
            label={({ x, y, value }) => (
                <text x={x} y={y} dy={-4} fill="lightgreen" fontSize={10} textAnchor="middle">
                    {value}
                </text>
            )}
            onMouseEnter={() => setHoveredLine(dataKey)}
            onMouseLeave={() => setHoveredLine(null)}
            style={{ cursor: "pointer" }}
        />
    );
};

export default GraphLine;