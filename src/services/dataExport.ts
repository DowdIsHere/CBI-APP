import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppData, Meal, Trigger } from '../data/types';

export type ExportFormat = 'json' | 'csv';
export type ExportScope = 'all' | 'meals' | 'triggers' | 'progress';

interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Convert meals to CSV format
const mealsToCSV = (meals: Meal[]): string => {
  const headers = ['Date', 'Time', 'Meal Name', 'Items', 'Total Score', 'Warnings'];
  const rows = meals.map(meal => [
    meal.date,
    meal.time,
    meal.name,
    meal.items.map(i => i.name).join('; '),
    meal.totalScore.toString(),
    meal.items.flatMap(i => i.warnings).join('; '),
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// Convert triggers to CSV format
const triggersToCSV = (triggers: Trigger[]): string => {
  const headers = ['Name', 'Category', 'Severity'];
  const rows = triggers.map(t => [t.name, t.category, t.severity]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// Convert progress/stats to CSV format
const progressToCSV = (data: AppData): string => {
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Meals Logged', data.stats.totalMeals.toString()],
    ['Current Streak', `${data.stats.streak} days`],
    ['Today\'s Score', data.stats.todayScore.toString()],
    ['Week Average', data.stats.weekAverage.toString()],
    ['Best Day Score', data.stats.bestDay.toString()],
    ['Energy Level', `${data.stats.energyLevel}/10`],
    ['Completed Lessons', data.completedLessonIds.length.toString()],
    ['Active Triggers', data.triggers.length.toString()],
  ];

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

// Generate export data based on options
export const generateExportData = (data: AppData, options: ExportOptions): string => {
  const { format, scope, dateRange } = options;

  // Filter meals by date range if provided
  let filteredMeals = data.meals;
  if (dateRange) {
    const startStr = dateRange.start.toISOString().split('T')[0];
    const endStr = dateRange.end.toISOString().split('T')[0];
    filteredMeals = data.meals.filter(m => m.date >= startStr && m.date <= endStr);
  }

  if (format === 'json') {
    switch (scope) {
      case 'meals':
        return JSON.stringify({ meals: filteredMeals, exportDate: new Date().toISOString() }, null, 2);
      case 'triggers':
        return JSON.stringify({ triggers: data.triggers, exportDate: new Date().toISOString() }, null, 2);
      case 'progress':
        return JSON.stringify({
          stats: data.stats,
          dailyStats: data.dailyStats,
          achievements: data.achievements,
          completedLessons: data.completedLessonIds,
          exportDate: new Date().toISOString(),
        }, null, 2);
      case 'all':
      default:
        return JSON.stringify({
          ...data,
          meals: filteredMeals,
          exportDate: new Date().toISOString(),
        }, null, 2);
    }
  } else {
    // CSV format
    switch (scope) {
      case 'meals':
        return mealsToCSV(filteredMeals);
      case 'triggers':
        return triggersToCSV(data.triggers);
      case 'progress':
        return progressToCSV(data);
      case 'all':
      default:
        // For "all", combine into separate sections
        return [
          '=== MEALS ===',
          mealsToCSV(filteredMeals),
          '',
          '=== TRIGGERS ===',
          triggersToCSV(data.triggers),
          '',
          '=== PROGRESS ===',
          progressToCSV(data),
        ].join('\n');
    }
  }
};

// Get filename for export
const getExportFilename = (scope: ExportScope, format: ExportFormat): string => {
  const date = new Date().toISOString().split('T')[0];
  return `jdm-protocol-${scope}-${date}.${format}`;
};

// Export and share data
export const exportAndShare = async (
  data: AppData,
  options: ExportOptions
): Promise<{ success: boolean; error?: string }> => {
  try {
    const exportData = generateExportData(data, options);
    const filename = getExportFilename(options.scope, options.format);

    // Create file in cache directory
    const file = new File(Paths.cache, filename);
    await file.write(exportData);

    // Check if sharing is available
    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
      return { success: false, error: 'Sharing is not available on this device' };
    }

    // Share file
    await Sharing.shareAsync(file.uri, {
      mimeType: options.format === 'json' ? 'application/json' : 'text/csv',
      dialogTitle: `Export ${options.scope} data`,
    });

    return { success: true };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export data'
    };
  }
};

// Get export summary for display
export const getExportSummary = (data: AppData, scope: ExportScope): string => {
  switch (scope) {
    case 'meals':
      return `${data.meals.length} meals logged`;
    case 'triggers':
      return `${data.triggers.length} triggers configured`;
    case 'progress':
      return `${data.stats.totalMeals} meals, ${data.stats.streak} day streak`;
    case 'all':
    default:
      return `Complete data backup`;
  }
};
