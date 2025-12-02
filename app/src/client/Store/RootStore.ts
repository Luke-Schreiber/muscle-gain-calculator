import { makeAutoObservable } from 'mobx';
import { DashboardStore } from './DashboardStore';

// Mock SelectionsStore for now as it is referenced in DashboardView
class SelectionsStore {
    selectedTimePeriods: string[] = [];
    selectedVisitNos: number[] = []; // For Shell compatibility

    constructor() {
        makeAutoObservable(this);
    }

    addSelectedTimePeriod(period: string) {
        this.selectedTimePeriods.push(period);
    }

    removeSelectedTimePeriod(period: string) {
        this.selectedTimePeriods = this.selectedTimePeriods.filter(p => p !== period);
    }
}

// Mock FiltersStore for Shell compatibility
class FiltersStore {
    showFilterHistograms: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    resetAllFilters() {
        console.log('Reset all filters');
    }
}

export class RootStore {
    dashboardStore: DashboardStore;
    selectionsStore: SelectionsStore;
    filtersStore: FiltersStore;

    constructor() {
        this.dashboardStore = new DashboardStore(this);
        this.selectionsStore = new SelectionsStore();
        this.filtersStore = new FiltersStore();
        makeAutoObservable(this);
    }
}
