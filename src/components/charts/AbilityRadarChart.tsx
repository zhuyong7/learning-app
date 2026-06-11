import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { AbilityScore } from '../../types/domain';
import { EmptyState } from '../ui/EmptyState';

interface AbilityRadarChartProps {
  data: AbilityScore[];
  height?: number;
}

export function AbilityRadarChart({ data, height = 320 }: AbilityRadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    const option: EChartsOption = {
      color: ['#4ADE80'],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
        },
      },
      radar: {
        radius: '68%',
        center: ['50%', '52%'],
        indicator: data.map(({ label, max }) => ({ name: label, max })),
        splitNumber: 4,
        axisName: {
          color: '#475569',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.28)',
          },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(248, 250, 252, 0.72)', 'rgba(240, 253, 244, 0.72)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.32)',
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: data.map(({ value }) => value),
              name: '能力得分',
              areaStyle: {
                color: 'rgba(74, 222, 128, .4)',
              },
              lineStyle: {
                color: '#4ADE80',
                width: 3,
                shadowBlur: 12,
                shadowColor: 'rgba(74, 222, 128, 0.45)',
              },
              itemStyle: {
                color: '#4ADE80',
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 14,
                shadowColor: 'rgba(74, 222, 128, 0.8)',
              },
              symbol: 'circle',
              symbolSize: 8,
            },
          ],
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
    return <EmptyState icon="◎" title="暂无能力数据" description="完成学习任务后，这里会展示各项能力得分。" />;
  }

  return <div ref={chartRef} style={{ height }} className="w-full" />;
}
