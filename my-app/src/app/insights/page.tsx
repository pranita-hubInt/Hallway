'use client';

import React, { Suspense } from 'react';
import { RefreshCw } from 'lucide-react';
import { useInsightsDashboard } from '../../hooks/useInsightsDashboard';
import { useInsightsFilters } from '../../hooks/useInsightsFilters';
import { CrmApiError } from '../../lib/crmApi';
import { FilterBar } from '../../components/insights/FilterBar';
import { PerformanceCards } from '../../components/insights/PerformanceCards';
import { KpiRow } from '../../components/insights/KpiRow';
import { SalesFunnelChart } from '../../components/insights/SalesFunnelChart';
import { LostHoldFunnel } from '../../components/insights/LostHoldFunnel';
import { LeadsOverTimeChart } from '../../components/insights/LeadsOverTimeChart';
import { ConversionTrendChart } from '../../components/insights/ConversionTrendChart';
import { StageVelocityCard } from '../../components/insights/StageVelocityCard';
import { DropReasonsChart } from '../../components/insights/DropReasonsChart';
import { RevenueDistributionCard } from '../../components/insights/RevenueDistributionCard';
import { RevenueForecastCard } from '../../components/insights/RevenueForecastCard';
import { TeamPerformanceTable } from '../../components/insights/TeamPerformanceTable';
import { CardSkeleton } from '../../components/insights/WidgetShell';

function InsightsDashboardInner() {
  const { filters, setFilters } = useInsightsFilters();
  const { dashboard, options, loading, error, reload } = useInsightsDashboard(
    filters,
    null,
    true
  );

  const passagesError =
    error instanceof CrmApiError && error.status === 501
      ? error.message
      : dashboard?.passagesAvailable === false
        ? 'Passages history is not available yet.'
        : null;

  const sectionError =
    error && !(error instanceof CrmApiError && error.status === 501) ? error.message : null;

  const applied = dashboard?.filtersApplied;

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            CRM Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live sales analytics from Hub CRM. Metrics are not recomputed in Hallway.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void reload()}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        options={options}
        isAdmin={true}
        isManager={false}
        isExecutive={false}
        onChange={setFilters}
      />

      {applied && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries({
            dateRange: applied.dateRange,
            branch: applied.branchId,
            manager: applied.salesManagerId,
            executive: applied.salesExecutiveId,
            funnel: applied.funnelMode,
            path: applied.pathFilter,
            team: applied.teamPeriod,
          })
            .filter(([, value]) => value != null && value !== '')
            .map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
              >
                {key}: {String(value)}
              </span>
            ))}
        </div>
      )}

      {sectionError && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-xs font-semibold text-rose-600">
          {sectionError}
        </div>
      )}

      {passagesError && filters.funnelMode === 'passages' && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs font-semibold text-amber-700 dark:text-amber-300">
          {passagesError}
        </div>
      )}

      <PerformanceCards data={dashboard?.performanceCards} loading={loading} />
      <KpiRow kpis={dashboard?.kpis} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SalesFunnelChart
          stages={dashboard?.salesFunnel || dashboard?.stages}
          meta={dashboard?.funnelMeta}
          loading={loading}
          error={filters.funnelMode === 'passages' ? passagesError : sectionError}
        />
        <LostHoldFunnel
          lost={dashboard?.lostFunnel}
          hold={dashboard?.holdFunnel}
          holdPathByStage={dashboard?.holdPathByStage}
          loading={loading}
          error={sectionError}
        />
        <LeadsOverTimeChart data={dashboard?.leadsOverTime} loading={loading} error={sectionError} />
        <ConversionTrendChart data={dashboard?.conversionTrend} loading={loading} error={sectionError} />
        <StageVelocityCard items={dashboard?.stageVelocity} loading={loading} error={sectionError} />
        <DropReasonsChart data={dashboard?.dropReasons} loading={loading} error={sectionError} />
        <RevenueDistributionCard
          data={dashboard?.revenueDistribution}
          loading={loading}
          error={sectionError}
        />
        <RevenueForecastCard data={dashboard?.revenueForecast} loading={loading} error={sectionError} />
      </div>

      <TeamPerformanceTable rows={dashboard?.teamPerformance} loading={loading} error={sectionError} />
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<CardSkeleton className="h-40" />}>
      <InsightsDashboardInner />
    </Suspense>
  );
}
