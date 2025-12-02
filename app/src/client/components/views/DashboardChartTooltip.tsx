import { Paper, Text, Group } from '@mantine/core';
import { formatValueForDisplay } from '../../Utils/dashboard';

interface DashboardChartTooltipProps {
    active?: boolean;
    payload?: readonly any[];
    xAxisVar?: string;
    yAxisVar: string;
    aggregation: string;
}

export function DashboardChartTooltip({
    active,
    payload,
    xAxisVar,
    yAxisVar,
    aggregation,
}: DashboardChartTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;
    const value = data[yAxisVar];

    return (
        <Paper px="md" py="sm" withBorder shadow="md" radius="md">
            <Text fw={500} mb={5}>
                {data.timePeriod}
            </Text>
            <Group justify="space-between" gap="xl">
                <Text size="sm" c="dimmed">
                    {yAxisVar}
                </Text>
                <Text size="sm" fw={500}>
                    {formatValueForDisplay(yAxisVar, value, aggregation)}
                </Text>
            </Group>
        </Paper>
    );
}
