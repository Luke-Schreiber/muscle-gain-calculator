import { makeAutoObservable, observable } from 'mobx';
import {
    DashboardChartConfig,
    Layout,
    dashboardYAxisOptions,
} from '../Types/application';
import { RootStore } from './RootStore';

export class DashboardStore {
    _rootStore: RootStore;
    _chartConfigs: DashboardChartConfig[] = [];
    _chartData: Record<string, any[]> = {};

    // Initialize store with the root store
    constructor(rootStore: RootStore) {
        this._rootStore = rootStore;
        makeAutoObservable(this, { _chartData: observable.ref });

        // Initialize with default chart
        this.setChartConfig('0', {
            chartId: '0',
            yAxisVar: 'total_weight',
            xAxisVar: 'month',
            aggregation: 'avg',
            chartType: 'line',
        });
    }

    // Chart Layouts
    _chartLayouts: { [key: string]: Layout[] } = {
        main: [
            {
                i: '0', x: 0, y: 0, w: 2, h: 1, maxH: 2,
            },
        ],
    };

    get chartLayouts() {
        return this._chartLayouts;
    }

    set chartLayouts(input: { [key: string]: Layout[] }) {
        this._chartLayouts = input;
    }

    get chartConfigs() {
        return this._chartConfigs;
    }

    get chartData() {
        return this._chartData;
    }

    // Chart management ----------------------------------------------------------
    /**
     * Initializes the dashboard with default chart configurations.
     */
    setChartConfig(chartId: string, input: DashboardChartConfig) {
        const existingConfig = this._chartConfigs.find((c) => c.chartId === chartId);
        const refreshData = !existingConfig || input.yAxisVar !== existingConfig.yAxisVar || input.xAxisVar !== existingConfig.xAxisVar || input.aggregation !== existingConfig.aggregation;

        if (existingConfig) {
            this._chartConfigs = this._chartConfigs.map((config) => {
                if (config.chartId === chartId) {
                    return { ...config, ...input };
                }
                return config;
            });
        } else {
            this._chartConfigs.push(input);
        }

        if (refreshData) {
            this.computeChartData(input);
        }
    }

    /**
     * Removes chart from the dashboard by ID.
     */
    removeChart(chartId: string) {
        this._chartConfigs = this._chartConfigs.filter((config) => config.chartId !== chartId);
        this._chartLayouts.main = this._chartLayouts.main.filter((layout) => layout.i !== chartId);
        if (this._chartLayouts.sm) {
            this._chartLayouts.sm = this._chartLayouts.sm.filter((layout) => layout.i !== chartId);
        }
    }

    /**
     * Generates dummy data for the chart
     */
    computeChartData(config: DashboardChartConfig) {
        const key = `${config.aggregation}_${config.yAxisVar}_${config.xAxisVar}`;

        // Generate 12 months of dummy data
        const data = Array.from({ length: 12 }, (_, i) => {
            const month = new Date();
            month.setMonth(month.getMonth() - (11 - i));
            const timePeriod = month.toLocaleString('default', { month: 'short', year: 'numeric' });

            let value = 0;
            if (config.yAxisVar === 'total_weight') {
                value = 180 + Math.random() * 10 - 5; // Random weight around 180
            } else if (config.yAxisVar === 'muscle_mass') {
                value = 150 + Math.random() * 5; // Random muscle mass around 150
            } else if (config.yAxisVar === 'body_fat') {
                value = 15 + Math.random() * 2; // Random body fat around 15%
            }

            return {
                timePeriod,
                [config.yAxisVar]: value,
            };
        });

        this._chartData = {
            ...this._chartData,
            [key]: data,
        };
    }
}
