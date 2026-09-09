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
                fontWeight={500}
                style={{
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: '"JetBrains Mono", monospace',
                }}
            >
                {payload.value}
            </text>
        </g>
    );
};

const ChemicalRadar = ({ steels, compact = false }) => {
    // Standard elements to compare; extend when any steel carries N/Nb
    const elements = ['C', 'Cr', 'V', 'Mo', 'W', 'Co'];
    if (steels?.some(s => s.N > 0)) elements.push('N');
    if (steels?.some(s => s.Nb > 0)) elements.push('Nb');

    // Normalize data: Different elements have different typical ranges
    const maxValues = {
        C: 4.0,
        Cr: 30.0,
        V: 15.0,
        Mo: 10.0,
        W: 20.0,
        Co: 15.0,
        N: 2.0,
        Nb: 1.0
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

    const colors = ['#FF5A1F', '#FFD9A8', '#FF9D62', '#C53A0C'];

    return (
        <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#2E2822" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => (
                            <CustomPolarAngleAxisTick
                                {...props}
                                fill="rgba(237,233,226,0.55)"
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
                            fillOpacity={0.25}
                            strokeWidth={3}
                        />
                    ))}

                    <Tooltip
                        contentStyle={{ backgroundColor: '#12100D', borderColor: 'rgba(237,233,226,0.1)', borderRadius: '0.75rem', padding: '1rem', fontFamily: 'JetBrains Mono, monospace' }}
                        itemStyle={{ color: '#EDE9E2', fontSize: '12px', fontWeight: 600 }}
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
