import { Injectable } from '@angular/core'; 
import { Metric, IAnalytics } from './metric.interface';

@Injectable()
export class AnalyticsService {
    constructor(private implementation: IAnalytics)
    {

    }

    record(metric: Metric): void{
        this.implementation.recordEvent(metric);
    }
}
