import { DataAction, DataSource, MessageClient } from "./Model";

export interface ILogics {
    extractPerformanceFromPayload(m: MessageClient): number;
    timeConversion(ms: number): string;
}
export class Logics implements ILogics {
    public extractPerformanceFromPayload(m: MessageClient): number {
        let performance: number = 0;
        if (m.payload.kind === "LogInfo") {
            if (m.payload.performanceInsight !== undefined) {
                const c = m.payload.performanceInsight;
                if (m.payload.action === DataAction.Use) {
                    if (c.fetch.stopMs !== undefined) {
                        performance = (c.fetch.stopMs - c.fetch.startMs);
                    }
                } else if (m.payload.action === DataAction.Fetch) {
                    if (m.payload.source === DataSource.HttpRequest) {
                        if (c.httpRequest !== undefined) {
                            if (c.httpRequest.stopMs !== undefined) {
                                performance = (c.httpRequest.stopMs - c.httpRequest.startMs);
                            }
                        }
                    } else if (m.payload.source === DataSource.MemoryCache) {
                        if (c.memoryCache !== undefined) {
                            if (c.memoryCache.stopMs !== undefined) {
                                performance = (c.memoryCache.stopMs - c.memoryCache.startMs);
                            }
                        }
                    } else if (m.payload.source === DataSource.PersistentStorageCache) {
                        if (c.persistentStorageCache !== undefined) {
                            if (c.persistentStorageCache.stopMs !== undefined) {
                                performance = (c.persistentStorageCache.stopMs - c.persistentStorageCache.startMs);
                            }
                        }
                    }
                }
            }
        }
        return performance;
    }

    public timeConversion(ms: number): string {
        if (ms === 0) {
            return "";
        }
        const seconds = (ms / 1000);
        const minutes = (ms / (1000 * 60));
        const hours = (ms / (1000 * 60 * 60));
        const days = (ms / (1000 * 60 * 60 * 24));
        if (seconds < 1) {
            return ms.toFixed(0) + "ms";
        } else if (seconds < 60) {
            return seconds.toFixed(2) + "s";
        } else if (minutes < 60) {
            return minutes.toFixed(2) + "m";
        } else if (hours < 24) {
            return hours.toFixed(1) + "h";
        } else {
            return days.toFixed(1) + "d";
        }
    }
}