// The dashboard responses are very bespoke aggregations.
// We can just pass them through directly from the service as they are shaped perfectly there.
const mapDashboardKPIs = (kpis) => kpis;
const mapDashboardAnalytics = (analytics) => analytics;

module.exports = { mapDashboardKPIs, mapDashboardAnalytics };
