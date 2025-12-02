export interface Cost {
    value: number;
    currency: string;
}

export interface DashboardChartConfig {
    chartId: string;
    yAxisVar: string;
    xAxisVar: string;
    aggregation: string;
    chartType: 'line' | 'bar';
}

export interface DashboardStatConfig {
    id: string;
    label: string;
    value: string | number;
    change?: number;
}

export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    maxH?: number;
}

export const dashboardYAxisOptions = [
    {
        value: 'total_weight',
        label: {
            base: 'Body Composition',
            sum: 'Body Composition',
            avg: 'Body Composition',
        },
        units: {
            sum: 'lbs',
        },
    },
    {
        value: 'muscle_mass',
        label: {
            base: 'Muscle Mass',
            sum: 'Total Muscle Mass',
            avg: 'Average Muscle Mass',
        },
        units: {
            sum: 'lbs',
        },
    },
    {
        value: 'body_fat',
        label: {
            base: 'Body Fat %',
            sum: 'Total Body Fat %',
            avg: 'Average Body Fat %',
        },
        units: {
            sum: '%',
        },
    },
];

export const AGGREGATION_OPTIONS = {
    sum: { label: 'Sum' },
    avg: { label: 'Average' },
};

export const dashboardXAxisOptions = [
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
];

export const chartColors = [
    '#228be6', // blue.6
    '#12b886', // teal.6
    '#fa5252', // red.6
    '#fab005', // yellow.6
    '#7950f2', // violet.6
    '#e64980', // pink.6
    '#be4bdb', // grape.6
    '#fd7e14', // orange.6
];
