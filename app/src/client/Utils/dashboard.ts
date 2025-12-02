export const formatValueForDisplay = (
    yAxisVar: string,
    value: number,
    aggregation: string,
    compact: boolean = false
): string => {
    if (value === undefined || value === null) return '';

    // Simple formatting for now, can be expanded based on yAxisVar
    if (yAxisVar === 'body_fat') {
        return `${value.toFixed(1)}%`;
    }

    if (yAxisVar === 'total_weight' || yAxisVar === 'muscle_mass') {
        return `${value.toFixed(1)} lbs`;
    }

    return value.toLocaleString();
};
