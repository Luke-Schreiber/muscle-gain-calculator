import {
    useCallback, useContext, useMemo, useState,
} from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useObserver } from 'mobx-react';

// Mantine
import {
    useMantineTheme, Title, Stack, Card, Flex, Select, CloseButton, ActionIcon, Tooltip,
    LoadingOverlay,
    Box,
} from '@mantine/core';
import { BarChart, LineChart } from '@mantine/charts';
import {
    IconCalendarCode, IconGripVertical, IconNumbers, IconPercentage, IconPlus, IconChartBar, IconChartLine,
} from '@tabler/icons-react';

// Dashboard
import classes from '../GridLayoutItem.module.css';

// Application
import { Store } from '../../Store/Store';
import {
    DEFAULT_DATA_COLOR, smallHoverColor, smallSelectColor, useThemeConstants,
} from '../../Theme/mantineTheme';
import {
    dashboardYAxisOptions,
    type DashboardChartConfig,
    chartColors,
} from '../../Types/application';
import { formatValueForDisplay } from '../../Utils/dashboard';
import { DashboardChartTooltip } from './DashboardChartTooltip';

/**
 * @returns Patient Blood Management Dashboard - Stats and Charts
 */
export function DashboardView() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive) as any, []);

    // --- Store and styles ---
    const store = useContext(Store);
    const theme = useMantineTheme();
    const {
        buttonIconSize, cardIconSize, cardIconStroke, toolbarWidth,
    } = useThemeConstants();

    // --- Charts ---

    // Remove chart from dashboard
    const handleRemoveChart = useCallback((chartId: string) => {
        store.dashboardStore.removeChart(chartId);
    }, [store.dashboardStore]);

    // Handle Chart Hover
    const [hoveredChartId, setHoveredChartId] = useState<string | null>(null);

    // --- Render Dashboard ---
    return useObserver(() => {
        const chartRowHeight = 300;
        return (
            <Stack mb="xl" gap="lg">
                {/** Layout for charts */}
                <ResponsiveGridLayout
                    className="layout"
                    breakpoints={{
                        main: 852, sm: 0,
                    }}
                    cols={{
                        main: 2, sm: 1,
                    }}
                    rowHeight={chartRowHeight}
                    containerPadding={[0, 0]}
                    draggableHandle=".move-icon"
                    isResizable
                    resizeHandles={['se']}
                    onLayoutChange={(currentLayout: Layout[], newLayouts: Record<string, Layout[]>) => {
                        store.dashboardStore.chartLayouts = newLayouts;
                    }}
                    layouts={store.dashboardStore.chartLayouts}
                >
                    {/** Render each chart - defined in the store's chart configs */}
                    {Object.values(store.dashboardStore.chartConfigs).map(({
                        chartId, yAxisVar, xAxisVar, aggregation, chartType,
                    }) => {
                        const selectedSet = new Set(store.selectionsStore.selectedTimePeriods);

                        let chartData = store.dashboardStore.chartData[`${aggregation}_${yAxisVar}_${xAxisVar}`] || [];

                        const chartDataKeys = chartData.length > 0
                            ? Object.keys(chartData[0]).filter((k) => k !== 'timePeriod')
                            : [];

                        const series = chartDataKeys.map((name, idx) => ({
                            name,
                            color:
                                chartDataKeys.length === 1
                                    ? DEFAULT_DATA_COLOR // Or use a constant like DEFAULT_DATA_COLOR if defined
                                    : chartColors[idx % chartColors.length],
                            label: chartDataKeys.length === 1
                                ? 'Total'
                                : dashboardYAxisOptions.find((o) => o.value === name)?.label?.base || name,
                        }));
                        return (
                            <Card
                                key={chartId}
                                withBorder
                                className={classes.gridItem}
                                onMouseEnter={() => setHoveredChartId(chartId)}
                                onMouseLeave={() => setHoveredChartId(null)}
                            >
                                <Flex direction="column" gap="sm" style={{ flex: 1, minHeight: 0 }}>
                                    {/* Chart Header */}
                                    <Flex direction="row" justify="space-between" align="center" pl="md">
                                        <Flex direction="row" align="center" gap="md" ml={-12}>
                                            <IconGripVertical size={18} className="move-icon" style={{ cursor: 'move' }} />
                                            {/* Chart Title */}
                                            <Title
                                                order={4}
                                                className={hoveredChartId === chartId ? classes.chartTitleHovered : undefined}
                                            >
                                                {
                                                    (() => {
                                                        // E.g. "sum_rbc_units"
                                                        const chartYAxis = dashboardYAxisOptions.find((o) => o.value === yAxisVar);
                                                        // E.g. "Total RBC Units"
                                                        return chartYAxis?.label?.[aggregation] || yAxisVar;
                                                    })()
                                                }
                                            </Title>
                                        </Flex>
                                        <Flex direction="row" align="center" gap="sm">
                                            {/* Chart Type Toggle */}
                                            <Tooltip label={`Change chart type to ${chartType === 'line' ? 'Bar' : 'Line'}`}>
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() => store.dashboardStore.setChartConfig(chartId, {
                                                        chartId, yAxisVar, xAxisVar, aggregation, chartType: chartType === 'line' ? 'bar' : 'line',
                                                    })}
                                                >
                                                    {chartType === 'bar' ? (
                                                        <IconChartLine size={18} color={theme.colors.gray[6]} stroke={3} />
                                                    ) : (
                                                        <IconChartBar size={18} color={theme.colors.gray[6]} stroke={3} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                            {/** Chart x-axis aggregation toggle */}
                                            <Tooltip label={`Change X-Axis to ${xAxisVar === 'month' ? 'Quarter' : xAxisVar === 'quarter' ? 'Year' : 'Month'}`}>
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={() => store.dashboardStore.setChartConfig(chartId, {
                                                        chartId, yAxisVar, xAxisVar: xAxisVar === 'month' ? 'quarter' : xAxisVar === 'quarter' ? 'year' : 'month', aggregation, chartType,
                                                    })}
                                                >
                                                    <IconCalendarCode size={18} color={theme.colors.gray[6]} stroke={3} />
                                                </ActionIcon>
                                            </Tooltip>
                                            {/* Chart Select Attribute Menu */}
                                            <Select
                                                data={dashboardYAxisOptions.map((opt) => ({
                                                    value: opt.value,
                                                    label: opt.label.base,
                                                }))}
                                                defaultValue={yAxisVar}
                                                value={yAxisVar}
                                                allowDeselect={false}
                                                onChange={(value) => {
                                                    const selectedOption = dashboardYAxisOptions.find((opt) => opt.value === value);
                                                    let inferredChartType: DashboardChartConfig['chartType'] = 'line';
                                                    if (selectedOption && selectedOption.units?.sum === '$') {
                                                        inferredChartType = 'bar';
                                                    }
                                                    store.dashboardStore.setChartConfig(chartId, {
                                                        chartId,
                                                        xAxisVar,
                                                        yAxisVar: value as DashboardChartConfig['yAxisVar'],
                                                        aggregation,
                                                        chartType: inferredChartType,
                                                    });
                                                }}
                                            />
                                            {/* Remove / Delete chart */}
                                            <CloseButton onClick={() => handleRemoveChart(chartId)} />
                                        </Flex>
                                    </Flex>
                                    <Box style={{ flex: 1, minHeight: 0, padding: '0 15px' }}>
                                        <LoadingOverlay visible={chartData.length === 0} overlayProps={{ radius: 'sm', blur: 2 }} />
                                        {chartType === 'bar' ? (
                                            // Bar Chart
                                            <BarChart
                                                h="100%"
                                                data={chartData}
                                                dataKey="timePeriod"
                                                series={series}
                                                xAxisProps={{
                                                    interval: 'equidistantPreserveStart',
                                                }}
                                                type="stacked"
                                                withLegend
                                                legendProps={{
                                                    verticalAlign: 'middle',
                                                    align: 'right',
                                                    layout: 'vertical',
                                                }}
                                                tooltipAnimationDuration={200}
                                                tooltipProps={{
                                                    content: ({ label, payload }) => (
                                                        <DashboardChartTooltip
                                                            active={!!payload?.length}
                                                            payload={payload}
                                                            xAxisVar={xAxisVar}
                                                            yAxisVar={yAxisVar}
                                                            aggregation={aggregation}
                                                        />
                                                    ),
                                                }}
                                                valueFormatter={(value) => formatValueForDisplay(yAxisVar, value, aggregation, false)}
                                                barChartProps={{
                                                    margin: { top: 20, right: 5, bottom: 20, left: 5 },
                                                }}
                                                barProps={{
                                                    onClick: (data: { payload?: { timePeriod?: string } }) => {
                                                        const timePeriod = data?.payload?.timePeriod;
                                                        if (timePeriod) {
                                                            const isSelected = store.selectionsStore.selectedTimePeriods.includes(timePeriod);
                                                            if (isSelected) {
                                                                store.selectionsStore.removeSelectedTimePeriod(timePeriod);
                                                            } else {
                                                                store.selectionsStore.addSelectedTimePeriod(timePeriod);
                                                            }
                                                        }
                                                    },
                                                    style: { cursor: 'pointer' },
                                                }}
                                            />
                                        ) : (
                                            // Line Chart
                                            <LineChart
                                                h="100%"
                                                data={chartData}
                                                dataKey="timePeriod"
                                                series={series}
                                                curveType="monotone"
                                                tickLine="none"
                                                xAxisProps={{
                                                    interval: 'equidistantPreserveStart',
                                                }}
                                                strokeWidth={1.5}
                                                withLegend
                                                legendProps={{
                                                    verticalAlign: 'middle',
                                                    align: 'right',
                                                    layout: 'vertical',
                                                }}
                                                lineProps={{
                                                    // Per-point rendering for dots to allow dynamic fill based on selection
                                                    dot: (props) => {
                                                        const timePeriod = String(props?.payload?.timePeriod ?? '');
                                                        const isSelected = selectedSet.has(timePeriod);
                                                        return (
                                                            <circle
                                                                key={props?.key}
                                                                cx={props?.cx}
                                                                cy={props?.cy}
                                                                r={isSelected ? 5 : 3}
                                                                strokeWidth={0}
                                                                fill={isSelected ? smallSelectColor : (props?.fill || props?.stroke)}
                                                            />
                                                        );
                                                    },
                                                    activeDot: {
                                                        r: 5,
                                                        strokeWidth: 0,
                                                        fill: smallHoverColor,
                                                        style: { cursor: 'pointer' },
                                                        onClick: (...args: unknown[]) => {
                                                            const source = (args[1] || {}) as { payload?: Record<string, unknown> };
                                                            const timePeriod = String(source.payload?.timePeriod ?? '');
                                                            if (timePeriod) {
                                                                const isSelected = selectedSet.has(timePeriod);
                                                                if (isSelected) {
                                                                    store.selectionsStore.removeSelectedTimePeriod(timePeriod);
                                                                } else {
                                                                    store.selectionsStore.addSelectedTimePeriod(timePeriod);
                                                                }
                                                            }
                                                        },
                                                    },
                                                }}
                                                tooltipAnimationDuration={200}
                                                tooltipProps={{
                                                    content: ({ label, payload }) => (
                                                        <DashboardChartTooltip
                                                            active={!!payload?.length}
                                                            payload={payload}
                                                            xAxisVar={xAxisVar}
                                                            yAxisVar={yAxisVar}
                                                            aggregation={aggregation}
                                                        />
                                                    ),
                                                }}
                                                valueFormatter={(value) => formatValueForDisplay(yAxisVar, value, aggregation, false)}
                                                lineChartProps={{
                                                    margin: { top: 20, right: 5, bottom: 20, left: 5 },
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Flex>
                            </Card>
                        );
                    })}
                </ResponsiveGridLayout>
            </Stack>
        );
    });
}
