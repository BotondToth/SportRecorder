import { Button, Icon } from '@ui-kitten/components';
import React, { useState } from 'react';
import {
  Tooltip, ResponsiveContainer,
  LineChart, XAxis, Label,
  YAxis, CartesianGrid, Area, AreaChart,
  RadialBar, RadialBarChart, Legend,
} from 'recharts';
import { jsPDF } from 'jspdf';
import { getPngData } from 'recharts-to-png';
import { DataType, NO_OF_ACTIVITIES, RadialBarDataType } from '../../types/statsConstants';
import { Client } from '../../api';

interface StatsChartsInput {
  statsData: DataType[],
  workoutsByType: RadialBarDataType[],
  xaxisLabel: string,
  title: string,
  onClickHandler?: (num: number) => void,
}

export const StatisticsChart = (inputs: StatsChartsInput) => {
  const [chartRef, setAreaChartRef] = useState<LineChart>();
  const [radialChartRef, setRadialChartRef] = useState<RadialBarChart>();
  const [areaCharIsAnimating, setAreaCharIsAnimating] = useState(false);
  const [radialChartAnimating, setRadialChartIsAnimating] = useState(false);
  const client: Client = Client.getInstance();

  const SaveIcon = (props: any) => (<Icon {...props} name="save-outline" />);

  const print = async () => {
    const areaPng = await getPngData(chartRef);
    const radialPng = await getPngData(radialChartRef);
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({ orientation: 'l' });
    const user = await client.getCurrentUser();
    doc.text(`Hello ${user.fullName}`, 149, 15, { align: 'center' });
    doc.text(`Your statistics at ${inputs.title}`, 10, 25);
    doc.addImage(areaPng, 'PNG', 10, 30, 280, 45);
    doc.addImage(radialPng, 'PNG', 50, 100, 200, 60);
    doc.save(`${user.username} ${inputs.title}.pdf`);
  };

  return (
    <>
      <ResponsiveContainer width="95%" height={250}>
        <AreaChart
          ref={(value) => setAreaChartRef(value)}
          data={inputs.statsData}
          onClick={(value) => inputs.onClickHandler(value.activeTooltipIndex)}
        >
          <Area
            type="monotone"
            dataKey="y"
            stroke="#3366FF"
            name={NO_OF_ACTIVITIES}
            onAnimationStart={() => {
              setAreaCharIsAnimating(true);
            }}
            onAnimationEnd={() => {
              setAreaCharIsAnimating(false);
            }}
            fillOpacity={0.5}
            animationDuration={2000}
          />
          <XAxis height={40} dataKey="x" label={{ fontWeight: 'bolder' }}>
            <Label value={inputs.xaxisLabel} offset={0} position="insideBottom" fontSize={18} fontWeight="bolder" />
          </XAxis>
          <YAxis allowDecimals={false} angle={-45}>
            <Label angle={-90} value={NO_OF_ACTIVITIES} fontSize={18} fontWeight="bolder" />
          </YAxis>
          <CartesianGrid />
          {!areaCharIsAnimating && <Tooltip animationDuration={100} animationEasing="linear" />}
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="40%" height={200}>
        <RadialBarChart
          ref={(value) => setRadialChartRef(value)}
          data={inputs.workoutsByType}
          outerRadius={150}
          innerRadius="20%"
          startAngle={180}
          endAngle={0}
          cy="80%"
        >
          <RadialBar
            label={{
              fill: '#000',
              position: 'inside',
              fontWeight: 'bolder',
              fontSize: '25',
            }}
            background
            dataKey="value"
            onAnimationStart={() => setRadialChartIsAnimating(true)}
            onAnimationEnd={() => setRadialChartIsAnimating(false)}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" iconSize={30} />
        </RadialBarChart>
      </ResponsiveContainer>
      <Button
        accessoryLeft={SaveIcon}
        onPress={print}
        disabled={areaCharIsAnimating || radialChartAnimating}
      >
        Export diagrams to PDF
      </Button>
    </>
  );
};

StatisticsChart.defaultProps = { onClickHandler: () => {} };
