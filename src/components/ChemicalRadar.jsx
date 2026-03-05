'use client'

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CustomPolarAngleAxisTick = ({ payload, x, y, cx, cy, index, orientation, radius, ...rest }) => {
    const { fill, fontSize, fontWeight, letterSpacing } = rest;

    const dx = x - cx;
    const dy = y - cy;
    const angleRad = Math.atan2(dy, dx);

    // Determining offset - more for chemical radar to avoid overlap
    const offset = 25;
    const nx = x + Math.cos(angleRad) * offset;
    const ny = y + Math.sin(angleRad) * offset;

    let rotation = 0;
    // For 6 points, we can rotate them to point towards center or just keep some standard
    // Based on user "rotate towards center", let's apply partial rotation
    const angleDeg = (angleRad * 180) / Math.PI;

    // If it's on the sides, we rotate
    if (Math.abs(angleDeg) > 40 && Math.abs(angleDeg) < 140) {
        // rotation = angleDeg > 0 ? angleDeg - 90 : angleDeg + 90;
    }

    return (
        <g transform={`translate(${nx},${ny}) rotate(${rotation})`}>
            <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                fill={fill}
                fontSize={fontSize}
                fontWeight={900}
                style={{
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: '"Inter", "Outfit", "system-ui", sans-serif',
                }}
            >
                {payload.value}
            </text>
        </g>
    );
};

const ChemicalRadar = ({ steels, compact = false }) => {
    // Standard elements to compare
    const elements = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];

    // Normalize data: Different elements have different typical ranges
    const maxValues = {
        C: 4.0,
        Cr: 30.0,
        V: 15.0,
        Mo: 10.0,
        W: 20.0,
        Co: 15.0
    };

    const data = elements.map(el => {
        const entry = { subject: el };
        steels.forEach(s => {
            const val = s[el] || 0;
            // Normalize to 0-100 for the radar shape
            entry[s.name] = (val / maxValues[el]) * 100;
            // Store original for tooltip
            entry[`${s.name}_raw`] = val;
        });
        return entry;
    });

    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

    return (
        <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => (
                            <CustomPolarAngleAxisTick
                                {...props}
                                fill="#94a3b8"
                                fontSize={11}
                            />
                        )}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                    {steels.map((s, i) => (
                        <Radar
                            key={s.id}
                            name={s.name}
                            dataKey={s.name}
                            stroke={colors[i % colors.length]}
                            fill={colors[i % colors.length]}
                            fillOpacity={0.3}
                            strokeWidth={3}
                        />
                    ))}

                    <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0b', borderColor: '#334155', borderRadius: '1rem', padding: '1rem' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value, name, props) => {
                            const rawVal = props.payload[`${name}_raw`];
                            return [`${rawVal}%`, name];
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChemicalRadar;
