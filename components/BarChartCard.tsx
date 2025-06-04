import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function BarChartCard() {
  return (
    <View
      style={{
        backgroundColor: '#212529',
        margin: 16,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          color: '#F8F9FA',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        Gastos por Semana - Junho
      </Text>

      <BarChart
        data={{
          labels: ['1-7', '8-14', '15-21', '22-28'],
          datasets: [
            {
              data: [200, 450, 300, 500],
            },
          ],
        }}
        width={screenWidth - 64}
        height={250}
        yAxisLabel="R$ "
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#212529',
          backgroundGradientFrom: '#212529',
          backgroundGradientTo: '#212529',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(248, 249, 250, ${opacity})`,
          style: {
            borderRadius: 12,
          },
          propsForBackgroundLines: {
            stroke: '#495057',
          },
          propsForLabels: {
            fontSize: 12,
          },
        }}
        verticalLabelRotation={0}
        fromZero
      />
    </View>
  );
}
