export interface Metric {
    eventName : string;
    scope: string;
}

export interface IAnalytics{
    recordEvent(metric: Metric): void;
}
