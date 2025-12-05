import { jsPDF } from 'jspdf';
import {
  LiftoutAnalytics,
  calculateOverallROI,
  getPerformanceGrade,
  identifyKeyInsights,
  generateRecommendations,
} from './analytics';

// ==========================================
// CSV Export Functions
// ==========================================

/**
 * Convert analytics data to CSV format
 */
export function exportAnalyticsToCSV(analytics: LiftoutAnalytics): string {
  const rows: string[][] = [];

  // Header
  rows.push(['Liftout Analytics Report']);
  rows.push(['Generated', new Date().toISOString()]);
  rows.push(['Reporting Period', `${analytics.reportingPeriod.startDate} to ${analytics.reportingPeriod.endDate}`]);
  rows.push([]);

  // Summary Metrics
  rows.push(['=== SUMMARY METRICS ===']);
  rows.push(['Metric', 'Value']);
  rows.push(['Overall ROI', `${calculateOverallROI(analytics).toFixed(1)}%`]);
  rows.push(['Performance Grade', getPerformanceGrade(analytics)]);
  rows.push(['Total Investment', formatCurrency(analytics.costAnalysis.totalInvestment)]);
  rows.push(['Total Revenue Impact', formatCurrency(analytics.businessOutcomes.revenueGrowth.totalImpact)]);
  rows.push([]);

  // Liftout Success Metrics
  rows.push(['=== LIFTOUT SUCCESS METRICS ===']);
  rows.push(['Metric', 'Value']);
  const liftouts = analytics.platformMetrics.successfulLiftouts;
  rows.push(['Total Liftouts', liftouts.total.toString()]);
  rows.push(['Completed', liftouts.completed.toString()]);
  rows.push(['In Progress', liftouts.inProgress.toString()]);
  rows.push(['Cancelled', liftouts.cancelled.toString()]);
  rows.push(['Success Rate', `${liftouts.successRate}%`]);
  rows.push(['Average Time to Complete (days)', liftouts.averageTimeToComplete.toString()]);
  rows.push([]);

  // Match Quality
  rows.push(['=== MATCH QUALITY ===']);
  rows.push(['Metric', 'Value']);
  rows.push(['Average Match Score', analytics.platformMetrics.matchQuality.averageScore.toString()]);
  rows.push([]);
  rows.push(['Score Distribution']);
  rows.push(['Range', 'Count', 'Percentage']);
  analytics.platformMetrics.matchQuality.distribution.forEach(d => {
    rows.push([d.range, d.count.toString(), `${d.percentage}%`]);
  });
  rows.push([]);

  // Time to Hire
  rows.push(['=== TIME TO HIRE ===']);
  rows.push(['Metric', 'Value']);
  const tth = analytics.platformMetrics.timeToHire;
  rows.push(['Average (days)', tth.average.toString()]);
  rows.push(['Median (days)', tth.median.toString()]);
  rows.push(['Fastest (days)', tth.fastest.toString()]);
  rows.push(['Slowest (days)', tth.slowest.toString()]);
  rows.push(['vs Industry Benchmark', `${tth.benchmarkComparison > 0 ? '+' : ''}${tth.benchmarkComparison}%`]);
  rows.push([]);
  rows.push(['Stage Breakdown']);
  rows.push(['Stage', 'Average Days', 'Benchmark Days', 'Efficiency']);
  tth.stageBreakdown.forEach(s => {
    rows.push([s.stage.replace(/_/g, ' '), s.averageDays.toString(), s.benchmarkDays.toString(), `${s.efficiency}%`]);
  });
  rows.push([]);

  // Retention Rates
  rows.push(['=== RETENTION RATES ===']);
  rows.push(['Period', 'Rate']);
  const retention = analytics.platformMetrics.retentionRates;
  rows.push(['3 Months', `${retention.month3}%`]);
  rows.push(['6 Months', `${retention.month6}%`]);
  rows.push(['12 Months', `${retention.month12}%`]);
  rows.push(['24 Months', `${retention.month24}%`]);
  rows.push(['vs Industry Average', `${retention.industryComparison > 0 ? '+' : ''}${retention.industryComparison}%`]);
  rows.push([]);

  // Client Satisfaction
  rows.push(['=== CLIENT SATISFACTION ===']);
  rows.push(['Metric', 'Score']);
  const satisfaction = analytics.platformMetrics.clientSatisfaction;
  rows.push(['Overall', satisfaction.overall.toString()]);
  rows.push(['Company Rating', satisfaction.companyRating.toString()]);
  rows.push(['Team Rating', satisfaction.teamRating.toString()]);
  rows.push(['NPS Score', satisfaction.recommendationScore.toString()]);
  rows.push([]);

  // Revenue Impact
  rows.push(['=== REVENUE IMPACT ===']);
  rows.push(['Metric', 'Value']);
  const revenue = analytics.businessOutcomes.revenueGrowth;
  rows.push(['Total Impact', formatCurrency(revenue.totalImpact)]);
  rows.push(['Quarter over Quarter Growth', `${revenue.quarterOverQuarter}%`]);
  rows.push(['Year over Year Growth', `${revenue.yearOverYear}%`]);
  rows.push(['Revenue per Liftout', formatCurrency(revenue.revenuePerLiftout)]);
  rows.push(['Projected Annual Impact', formatCurrency(revenue.projectedAnnualImpact)]);
  rows.push([]);
  rows.push(['Revenue Breakdown']);
  rows.push(['Source', 'Amount', 'Percentage', 'Growth']);
  revenue.revenueBreakdown.forEach(r => {
    rows.push([r.source, formatCurrency(r.amount), `${r.percentage}%`, `${r.growth}%`]);
  });
  rows.push([]);

  // Cost Analysis
  rows.push(['=== COST ANALYSIS ===']);
  rows.push(['Metric', 'Value']);
  const costs = analytics.costAnalysis;
  rows.push(['Total Investment', formatCurrency(costs.totalInvestment)]);
  rows.push(['Cost per Liftout', formatCurrency(costs.costPerLiftout)]);
  rows.push(['Budget Utilization', `${costs.budgetUtilization}%`]);
  rows.push([]);
  rows.push(['Cost Breakdown']);
  rows.push(['Category', 'Amount', 'Percentage', 'Trend']);
  costs.costBreakdown.forEach(c => {
    rows.push([c.category, formatCurrency(c.amount), `${c.percentage}%`, `${c.trend > 0 ? '+' : ''}${c.trend}%`]);
  });
  rows.push([]);
  rows.push(['Cost Efficiency vs Alternatives']);
  rows.push(['Alternative', 'Savings']);
  rows.push(['Traditional Hiring', `${costs.costEfficiency.vsTraditionalHiring}%`]);
  rows.push(['M&A Activity', `${costs.costEfficiency.vsMAActivity}%`]);
  rows.push(['Consulting', `${costs.costEfficiency.vsConsulting}%`]);
  rows.push([]);

  // ROI by Liftout
  rows.push(['=== ROI BY LIFTOUT ===']);
  rows.push(['Team', 'Investment', 'Returns', 'ROI', 'Payback (months)', 'Status']);
  analytics.roiAnalysis.roiByLiftout.forEach(r => {
    rows.push([
      r.teamName,
      formatCurrency(r.investment),
      formatCurrency(r.returns),
      `${r.roi}%`,
      r.paybackMonths.toString(),
      r.status,
    ]);
  });
  rows.push([]);

  // Industry Benchmarks
  rows.push(['=== INDUSTRY BENCHMARKS ===']);
  rows.push(['Metric', 'Your Value', 'Industry Avg', 'Top Quartile', 'Percentile Rank']);
  analytics.industryBenchmarks.forEach(b => {
    rows.push([
      b.metric,
      b.companyValue.toString(),
      b.industryAverage.toString(),
      b.topQuartile.toString(),
      `${b.ranking}th`,
    ]);
  });
  rows.push([]);

  // Insights
  rows.push(['=== KEY INSIGHTS ===']);
  identifyKeyInsights(analytics).forEach((insight, i) => {
    rows.push([`${i + 1}. ${insight}`]);
  });
  rows.push([]);

  // Recommendations
  rows.push(['=== RECOMMENDATIONS ===']);
  generateRecommendations(analytics).forEach((rec, i) => {
    rows.push([`${i + 1}. ${rec}`]);
  });

  // Convert to CSV string
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

/**
 * Download analytics as CSV file
 */
export function downloadAnalyticsCSV(analytics: LiftoutAnalytics, filename?: string): void {
  const csv = exportAnalyticsToCSV(analytics);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `liftout-analytics-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// PDF Export Functions
// ==========================================

/**
 * Export analytics data to PDF
 */
export async function downloadAnalyticsPDF(analytics: LiftoutAnalytics, filename?: string): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(text, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 7;
  };

  const addText = (text: string, indent: number = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    doc.text(lines, margin + indent, y);
    y += lines.length * 5;
  };

  const addMetricRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 5, y);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - margin - doc.getTextWidth(value), y);
    doc.setFont('helvetica', 'normal');
    y += 6;
  };

  const addDivider = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const checkPageBreak = (needed: number = 30) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Title Page
  addTitle('Liftout Analytics Report', 24);
  y += 10;
  addText(`Generated: ${new Date().toLocaleDateString()}`);
  addText(`Reporting Period: ${new Date(analytics.reportingPeriod.startDate).toLocaleDateString()} - ${new Date(analytics.reportingPeriod.endDate).toLocaleDateString()}`);
  y += 10;
  addDivider();

  // Executive Summary
  y += 5;
  addSubtitle('Executive Summary');
  y += 3;

  const roi = calculateOverallROI(analytics);
  const grade = getPerformanceGrade(analytics);

  addMetricRow('Overall ROI', `${roi.toFixed(1)}%`);
  addMetricRow('Performance Grade', grade);
  addMetricRow('Total Investment', formatCurrency(analytics.costAnalysis.totalInvestment));
  addMetricRow('Revenue Impact', formatCurrency(analytics.businessOutcomes.revenueGrowth.totalImpact));
  addMetricRow('Successful Liftouts', analytics.platformMetrics.successfulLiftouts.completed.toString());
  addMetricRow('Success Rate', `${analytics.platformMetrics.successfulLiftouts.successRate}%`);

  y += 5;
  addDivider();

  // Platform Metrics
  checkPageBreak(60);
  y += 5;
  addSubtitle('Platform Metrics');
  y += 3;

  addText('Liftout Performance:', 0);
  addMetricRow('  Total Liftouts', analytics.platformMetrics.successfulLiftouts.total.toString());
  addMetricRow('  Completed', analytics.platformMetrics.successfulLiftouts.completed.toString());
  addMetricRow('  In Progress', analytics.platformMetrics.successfulLiftouts.inProgress.toString());
  addMetricRow('  Avg. Time to Complete', `${analytics.platformMetrics.successfulLiftouts.averageTimeToComplete} days`);

  y += 3;
  addText('Match Quality:', 0);
  addMetricRow('  Average Score', analytics.platformMetrics.matchQuality.averageScore.toString());

  y += 3;
  addText('Retention Rates:', 0);
  addMetricRow('  3 Months', `${analytics.platformMetrics.retentionRates.month3}%`);
  addMetricRow('  6 Months', `${analytics.platformMetrics.retentionRates.month6}%`);
  addMetricRow('  12 Months', `${analytics.platformMetrics.retentionRates.month12}%`);

  y += 3;
  addText('Client Satisfaction:', 0);
  addMetricRow('  Overall Score', `${analytics.platformMetrics.clientSatisfaction.overall}/10`);
  addMetricRow('  NPS Score', analytics.platformMetrics.clientSatisfaction.recommendationScore.toString());

  y += 5;
  addDivider();

  // Business Outcomes
  checkPageBreak(70);
  y += 5;
  addSubtitle('Business Outcomes');
  y += 3;

  addText('Revenue Growth:', 0);
  addMetricRow('  Total Impact', formatCurrency(analytics.businessOutcomes.revenueGrowth.totalImpact));
  addMetricRow('  QoQ Growth', `${analytics.businessOutcomes.revenueGrowth.quarterOverQuarter}%`);
  addMetricRow('  YoY Growth', `${analytics.businessOutcomes.revenueGrowth.yearOverYear}%`);
  addMetricRow('  Revenue per Liftout', formatCurrency(analytics.businessOutcomes.revenueGrowth.revenuePerLiftout));

  y += 3;
  addText('Market Expansion:', 0);
  addMetricRow('  New Markets Entered', analytics.businessOutcomes.marketExpansion.newMarkets.toString());
  addMetricRow('  Client Base Growth', `${analytics.businessOutcomes.marketExpansion.clientBaseGrowth}%`);

  y += 3;
  addText('Team Performance:', 0);
  addMetricRow('  Productivity Gains', `${analytics.businessOutcomes.teamPerformance.productivityGains}%`);
  addMetricRow('  Innovation Index', analytics.businessOutcomes.teamPerformance.innovationIndex.toString());

  y += 5;
  addDivider();

  // Cost Analysis
  checkPageBreak(50);
  y += 5;
  addSubtitle('Cost Analysis');
  y += 3;

  addMetricRow('Total Investment', formatCurrency(analytics.costAnalysis.totalInvestment));
  addMetricRow('Cost per Liftout', formatCurrency(analytics.costAnalysis.costPerLiftout));
  addMetricRow('Budget Utilization', `${analytics.costAnalysis.budgetUtilization}%`);

  y += 3;
  addText('Cost Efficiency vs Alternatives:', 0);
  addMetricRow('  vs Traditional Hiring', `${analytics.costAnalysis.costEfficiency.vsTraditionalHiring}% savings`);
  addMetricRow('  vs M&A Activity', `${analytics.costAnalysis.costEfficiency.vsMAActivity}% savings`);
  addMetricRow('  vs Consulting', `${analytics.costAnalysis.costEfficiency.vsConsulting}% savings`);

  y += 5;
  addDivider();

  // ROI Analysis
  checkPageBreak(50);
  y += 5;
  addSubtitle('ROI Analysis');
  y += 3;

  addMetricRow('Total ROI', `${analytics.roiAnalysis.totalROI}%`);
  addMetricRow('Payback Period', `${analytics.roiAnalysis.paybackPeriod} months`);
  addMetricRow('Net Present Value', formatCurrency(analytics.roiAnalysis.netPresentValue));
  addMetricRow('Internal Rate of Return', `${analytics.roiAnalysis.internalRateOfReturn}%`);

  y += 5;
  addDivider();

  // Key Insights
  checkPageBreak(40);
  y += 5;
  addSubtitle('Key Insights');
  y += 3;

  const insights = identifyKeyInsights(analytics);
  insights.forEach((insight, i) => {
    checkPageBreak(15);
    addText(`${i + 1}. ${insight}`, 5);
    y += 2;
  });

  y += 5;
  addDivider();

  // Recommendations
  checkPageBreak(40);
  y += 5;
  addSubtitle('Recommendations');
  y += 3;

  const recommendations = generateRecommendations(analytics);
  recommendations.forEach((rec, i) => {
    checkPageBreak(15);
    addText(`${i + 1}. ${rec}`, 5);
    y += 2;
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | Liftout Analytics Report | Confidential`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(filename || `liftout-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==========================================
// Team Analytics Export
// ==========================================

export interface TeamAnalyticsData {
  teamId: string;
  teamName: string;
  period: string;
  metrics: {
    profileViews: number;
    expressionsOfInterest: number;
    applications: number;
    interviews: number;
    offers: number;
    matchScore: number;
    responseRate: number;
  };
  activity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

export function exportTeamAnalyticsToCSV(data: TeamAnalyticsData): string {
  const rows: string[][] = [];

  rows.push(['Team Analytics Report']);
  rows.push(['Team', data.teamName]);
  rows.push(['Period', data.period]);
  rows.push(['Generated', new Date().toISOString()]);
  rows.push([]);

  rows.push(['=== PERFORMANCE METRICS ===']);
  rows.push(['Metric', 'Value']);
  rows.push(['Profile Views', data.metrics.profileViews.toString()]);
  rows.push(['Expressions of Interest', data.metrics.expressionsOfInterest.toString()]);
  rows.push(['Applications', data.metrics.applications.toString()]);
  rows.push(['Interviews', data.metrics.interviews.toString()]);
  rows.push(['Offers', data.metrics.offers.toString()]);
  rows.push(['Match Score', `${data.metrics.matchScore}%`]);
  rows.push(['Response Rate', `${data.metrics.responseRate}%`]);
  rows.push([]);

  rows.push(['=== RECENT ACTIVITY ===']);
  rows.push(['Date', 'Type', 'Description']);
  data.activity.forEach(a => {
    rows.push([a.date, a.type, a.description]);
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function downloadTeamAnalyticsCSV(data: TeamAnalyticsData, filename?: string): void {
  const csv = exportTeamAnalyticsToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `team-analytics-${data.teamId}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// Utility Functions
// ==========================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
