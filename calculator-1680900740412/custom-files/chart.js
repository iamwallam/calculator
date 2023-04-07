// This import is required if you are defining react components in this module.
import React from 'react';

// Add any other imports you need here. Make sure to add those imports (besides "react"
// and "react-native") to the Packages section.

import { View, Text, Dimensions } from 'react-native';

//Charts
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export function BarChartComponent({ tax_data }) {
  const data = {
    labels: ['NJ', 'NY State', 'NYC'], // optional
    datasets: [
      {
        data: tax_data,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#1471af',
    backgroundGradientTo: '#1471af',
    color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View>
      <BarChart
        data={data}
        width={screenWidth * 0.8}
        height={220}
        strokeWidth={16}
        yAxisLable="$"
        radius={32}
        chartConfig={chartConfig}
        showValuesOnTopOfBars={true}
        hideLegend={false}
        fromZero={true}
      />
    </View>
  );
}
