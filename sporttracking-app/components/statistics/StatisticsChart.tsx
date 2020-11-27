import React, { useState } from 'react';
import {
  Tooltip, Line, ResponsiveContainer,
  LineChart, XAxis, Label,
  YAxis, CartesianGrid,
} from 'recharts';
import { DataType, NO_OF_ACTIVITIES } from '../../types/statsConstants';

interface StatsInput {data: DataType[], xaxisLabel: string, onClickHandler?: any}

export const StatisticsChart = (
  { data, xaxisLabel, onClickHandler }: StatsInput,
) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <ResponsiveContainer width="95%" height={300}>
      <LineChart
        data={data}
        onClick={(value) => onClickHandler(value.activeTooltipIndex)}
      >
        <Line
          type="monotone"
          dataKey="y"
          stroke="#3366FF"
          name={NO_OF_ACTIVITIES}
          onAnimationStart={() => setShowTooltip(false)}
          onAnimationEnd={() => setShowTooltip(true)}
        />
        <XAxis height={40} dataKey="x">
          <Label value={xaxisLabel} offset={0} position="insideBottom" fontSize={18} />
        </XAxis>
        <YAxis allowDecimals={false} angle={-45}>
          <Label angle={-90} value={NO_OF_ACTIVITIES} fontSize={18} />
        </YAxis>
        <CartesianGrid />
        {showTooltip && <Tooltip animationDuration={100} animationEasing="linear" />}
      </LineChart>
    </ResponsiveContainer>
  );
};

StatisticsChart.defaultProps = { onClickHandler: () => {} };
