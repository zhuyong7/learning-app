import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { TrendPoint } from '../../types/domain';
import { EmptyState } from '../ui/EmptyState';

interface GrowthAreaChartProps {
  data: TrendPoint[];
  height?: number;
}

export function GrowthAreaChart({ data, height = 300 }: GrowthAreaChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    const option: EChartsOption = {
      color: ['#4ADE80'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
        },
        valueFormatter: (value) => `${value} EXP`,
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
        name: 'EXP',
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
          name: '成长值',
          type: 'line',
          smooth: true,
          data: data.map(({ exp }) => exp),
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: {
            color: '#4ADE80',
            width: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(74, 222, 128, 0.38)',
          },
          itemStyle: {
            color: '#4ADE80',
            borderColor: '#fff',
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(74, 222, 128, 0.45)' },
              { offset: 1, color: 'rgba(74, 222, 128, 0.04)' },
            ]),
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
    return <EmptyState icon="△" title="暂无成长数据" description="获得成长值后，这里会展示经验值增长曲线。" />;
  }

  return <div ref={chartRef} style={{ height }} className="w-full" />;
}
