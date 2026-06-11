import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { TrendPoint } from '../../types/domain';
import { EmptyState } from '../ui/EmptyState';

interface LearningLineChartProps {
  data: TrendPoint[];
  height?: number;
}

export function LearningLineChart({ data, height = 300 }: LearningLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    const option: EChartsOption = {
      color: ['#60A5FA'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
        },
        valueFormatter: (value) => `${value} 分钟`,
      },
      grid: {
        top: 28,
        right: 20,
        bottom: 36,
        left: 44,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(({ date }) => date),
        axisLine: {
          lineStyle: {
            color: '#CBD5E1',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#64748B',
        },
      },
      yAxis: {
        type: 'value',
        name: '分钟',
        min: 0,
        nameTextStyle: {
          color: '#64748B',
        },
        axisLabel: {
          color: '#64748B',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.2)',
          },
        },
      },
      series: [
        {
          name: '学习时长',
          type: 'line',
          smooth: true,
          data: data.map(({ duration }) => duration),
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: {
            color: '#60A5FA',
            width: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(96, 165, 250, 0.38)',
          },
          itemStyle: {
            color: '#60A5FA',
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  if (data.length === 0) {
    return <EmptyState icon="⌁" title="暂无学习趋势" description="开始学习后，这里会展示每日学习时长变化。" />;
  }

  return <div ref={chartRef} style={{ height }} className="w-full" />;
}
