import {
    ReactNode, useContext, useMemo, useState,
} from 'react';
import PricingPage from '../../payment/PricingPage';
import { useDisclosure } from '@mantine/hooks';
import {
    AppShell, Group, Tabs, ActionIcon, Title, Flex, Container, Menu, Box, Text, Tooltip,
    Modal,
    Button,
    Stack,
    Badge,
} from '@mantine/core';
import {
    IconDatabase, IconBook,
    IconArrowNarrowLeftDashed,
    IconArrowNarrowRightDashed, IconDeviceFloppy,
    IconCamera, IconLogout, IconUser, IconMenu,
    IconRestore, type IconProps,
    IconChartBar,
    IconClipboardList,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import classes from './Shell.module.css';

// Mock Store and Theme Constants for now
const Store = {
    filtersStore: {
        resetAllFilters: () => console.log('Reset filters'),
        showFilterHistograms: false,
    },
    selectionsStore: {
        selectedVisitNos: [1, 2, 3],
    },
};

const useThemeConstants = () => ({
    toolbarWidth: 60,
    iconStroke: 1.5,
});

// Placeholder Views
const DashboardView = () => <div className="p-4">Dashboard Content</div>;
const WorkoutsView = () => <div className="p-4">Workouts Content</div>;
const NutritionView = () => <div className="p-4">Nutrition Content</div>;
const SettingsView = () => <div className="p-4">Settings Content</div>;

// Dummy FilterPanel and SelectedVisitsPanel
const FilterPanel = () => <div>Filter Panel Content</div>;
const SelectedVisitsPanel = () => <div>Selected Visits Content</div>;

// FilterIcon wrapper
const FilterIcon = (props: IconProps) => <IconChartBar {...props} />;

/** *
 * Shell component that provides the main layout for the application.
 * Includes a header toolbar (Intelvia), left toolbar, and main content area.
 */
export function Shell({ children }: { children?: ReactNode }) {
    const store = Store; // Mocked context
    const navigate = useNavigate();
    const location = useLocation();

    // View tabs -----------------
    const TABS = [
        {
            key: 'Dashboard',
            content: <DashboardView />,
        },
        {
            key: 'Workouts', // Renamed from Providers
            content: <WorkoutsView />,
        },
        {
            key: 'Nutrition', // Renamed from Explore
            content: <NutritionView />,
        },
        {
            key: 'Pricing',
            content: <PricingPage />, // Handled by navigation
        },
    ];
    // Default tab shown initial load
    const defaultTab = TABS[0].key;

    // Active tab in the view tabs
    const [activeTab, setActiveTab] = useState<string>(defaultTab);

    // Reset to defaults modal ----------------------
    const [resetModalOpened, setResetModalOpened] = useState(false);
    const handleConfirmReset = () => {
        // Reset filters (add other reset logic as needed)
        store.filtersStore.resetAllFilters();
        setResetModalOpened(false);
    };

    // Toolbar & Left Panel states ----------------------
    // Width of the header toolbar & left toolbar
    const { toolbarWidth, iconStroke } = useThemeConstants();

    // Width of the navbar when left toolbar is open
    const LEFT_PANEL_WIDTH = 6 * toolbarWidth;

    // Open and close the left toolbar, burger toggle visible on hover.
    const [activeLeftPanel, setActiveLeftPanel] = useState<number | null>(null);
    const [navbarOpened, setNavbarOpened] = useState(false);
    const navbarWidth = useMemo(() => (activeLeftPanel === null ? toolbarWidth : LEFT_PANEL_WIDTH), [activeLeftPanel, LEFT_PANEL_WIDTH, toolbarWidth]);

    // Toolbar icons ----------------------
    // Left toolbar icons
    const leftToolbarIcons: { icon: React.ComponentType<IconProps>; label: string; content: ReactNode; actionButtons?: ReactNode[]; disabled?: boolean }[] = [
        {
            icon: FilterIcon,
            label: 'Filter Panel',
            content: <FilterPanel />,
            actionButtons: [
                <ActionIcon key="reset-filters" aria-label="Reset all filters" onClick={() => { store.filtersStore.resetAllFilters(); }} className={classes.leftToolbarIcon}>
                    <IconRestore stroke={iconStroke} size={21} />
                </ActionIcon>,
                <ActionIcon key="toggle-filter-histograms" aria-label="Toggle filter historgrams" onClick={() => { store.filtersStore.showFilterHistograms = !store.filtersStore.showFilterHistograms; }} data-active={store.filtersStore.showFilterHistograms} className={classes.leftToolbarIcon}>
                    <IconChartBar stroke={iconStroke} />
                </ActionIcon>,
            ],
        },
        {
            icon: IconClipboardList,
            label: 'Selected Visits',
            content: <SelectedVisitsPanel />,
            actionButtons: [
                <Badge key="selected-visits-badge" variant="light" size="sm">
                    {store.selectionsStore.selectedVisitNos.length}
                    {' '}
                    Visits
                </Badge>,

            ],
        },
        {
            icon: IconDatabase,
            label: 'Database',
            content: <Text>Database content</Text>,
            disabled: true,
        },
        {
            icon: IconBook,
            label: 'Learn',
            content: <Text>Learning content</Text>,
            disabled: true,
        },
    ];

    // Header toolbar icons
    const headerIcons: { icon: React.ComponentType<IconProps>; label: string }[] = [
        { icon: IconArrowNarrowLeftDashed, label: 'Back' },
        { icon: IconArrowNarrowRightDashed, label: 'Forward' },
        { icon: IconDeviceFloppy, label: 'Save' },
        { icon: IconCamera, label: 'Camera' },
    ];

    const handleTabChange = (value: string | null) => {
        if (!value) return;
        // Directly set the active tab for all values, including Pricing, to display content within the Shell.
        setActiveTab(value);
    };

    return (
        <AppShell
            header={{ height: toolbarWidth }}
            navbar={{
                width: 350,
                breakpoint: 0,
                collapsed: { desktop: !navbarOpened },
                withBorder: true,
            }}
            padding="xs"
        >
            {/** Header Toolbar */}
            <AppShell.Header withBorder>
                <Group justify="space-between" h="100%" px="md">
                    <Group>
                        {/** Left Toolbar Toggle Burger Icon */}
                        <Flex justify="center" w={toolbarWidth}>
                            <ActionIcon aria-label="Toggle Left Toolbar" variant="subtle" color="gray">
                                <IconMenu onClick={() => setNavbarOpened(!navbarOpened)} stroke={iconStroke} />
                            </ActionIcon>
                        </Flex>
                        {/** App Title */}
                        <Title order={3} pl="xs">Muscle Gain Calculator</Title>
                        {/** View Tabs */}
                        <Tabs
                            variant="outline"
                            value={activeTab}
                            onChange={handleTabChange}
                            radius="md"
                            defaultValue={defaultTab}
                            pl="xs"
                            visibleFrom="sm"
                        >
                            {/** Render each tab in tabs list */}
                            <Tabs.List h={toolbarWidth} style={{ paddingTop: 10 }}>
                                {Object.values(TABS).map((tab) => (
                                    <Tabs.Tab key={tab.key} value={tab.key}>{tab.key}</Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs>
                    </Group>
                    {/** Header Icons, right-aligned */}
                    <Group gap="sm">
                        {headerIcons.map(({ icon: Icon, label }) => (
                            <Tooltip
                                key={label}
                                label={label}
                            >
                                <ActionIcon aria-label={label} variant="subtle" color="gray">
                                    <Icon stroke={iconStroke} />
                                </ActionIcon>
                            </Tooltip>
                        ))}
                        {/** Header Icon - User Menu */}
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Tooltip
                                    key="User"
                                    label="User"
                                >
                                    <ActionIcon aria-label="User" variant="subtle" color="gray">
                                        <IconUser stroke={iconStroke} />
                                    </ActionIcon>
                                </Tooltip>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>User</Menu.Label>
                                <Menu.Item
                                    leftSection={<IconRestore size={14} />}
                                    onClick={() => setResetModalOpened(true)}
                                >
                                    Reset to defaults
                                </Menu.Item>
                                <Menu.Item leftSection={<IconLogout size={14} />}>
                                    Log out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>
            {/** Main Area */}
            <AppShell.Main>
                <Container fluid mt="xs">
                    {/** Display content of active tab */}
                    {TABS.map((tab) => (
                        <Box
                            key={tab.key}
                            style={{ display: activeTab === tab.key ? 'block' : 'none' }}
                        >
                            {tab.content}
                        </Box>
                    ))}
                    {/* Also render children if any, e.g. from Outlet */}
                    {children}
                </Container>
            </AppShell.Main>

            <AppShell.Navbar withBorder>Navbar</AppShell.Navbar>
            {/** Reset to Defaults Modal */}
            <Modal
                opened={resetModalOpened}
                onClose={() => setResetModalOpened(false)}
                title="Are you sure you want to reset?"
                centered
            >
                <Stack gap="md">
                    <Text size="sm">
                        This action will reset to Intelvia&apos;s default state.
                        <br />
                        All custom charts and filters will be removed.
                    </Text>
                    <Group justify="flex-end" mt="xs">
                        <Button variant="default" onClick={() => setResetModalOpened(false)}>Cancel</Button>
                        <Button color="red" onClick={handleConfirmReset}>Reset</Button>
                    </Group>
                </Stack>
            </Modal>
        </AppShell>
    );
}
