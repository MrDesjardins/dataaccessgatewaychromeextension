import { DataAction, DataSource, Message, MessageClient, Statistics, Threshold } from "./Model";

export interface ILogics {
    extractPerformanceFromPayload(m: MessageClient): number;
    timeConversion(ms: number): string;
    filterConsoleMessages(m: MessageClient, performance: Threshold, size: Threshold): boolean;
    extractSizeFromPayload(m: MessageClient): number;
    adjustStatistics(message: Message, currentStatistics: Statistics): Statistics;
    getMessageKey(message: MessageClient): string;
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

    public filterConsoleMessages(m: MessageClient, performance: Threshold, size: Threshold): boolean {
        if (performance.value !== "") {
            const performanceMs = this.extractPerformanceFromPayload(m);
            if (performanceMs === 0) {
                return false;
            }
            if (performance.value !== 0) { // If the payload has data, and something in the input
                if (performance.sign === "gt" && performanceMs < performance.value) {
                    return false;
                }
                if (performance.sign === "lt" && performanceMs > performance.value) {
                    return false;
                }
            }
        }
        if (size.value !== "") {
            const sizeBytes = this.extractSizeFromPayload(m);
            if (sizeBytes === 0) {
                return false;
            }
            if (size.sign === "gt" && sizeBytes < size.value) {
                return false;
            }
            if (size.sign === "lt" && sizeBytes > size.value) {
                return false;
            }
        }

        return true;

    }
    public extractSizeFromPayload(m: MessageClient): number {
        let size: number = 0;
        if (m.payload.kind === "LogInfo") {
            if (m.payload.performanceInsight !== undefined) {
                if (m.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    size = m.payload.performanceInsight.dataSizeInBytes;
                }
            }
        }
        return size;
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

    public adjustStatistics(message: Message, currentStatistics: Statistics): Statistics {
        const newStatistics = { ...currentStatistics };

        if (!message.payload) {
            console.warn("Payload was undefined. Here is the message:", message);
            return newStatistics;
        }
        // Stastistic with LogInfo
        if (message.payload.kind === "LogInfo") {
            if (message.payload.action === DataAction.AddFromOnGoingRequest) {
                newStatistics.onGoingRequestCount++;
            }
            if (message.payload.action === DataAction.RemoveFromOnGoingRequest) {
                newStatistics.onGoingRequestCount--;
            }
            if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.HttpRequest) {
                newStatistics.readHttpCount++;
            }
            if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.MemoryCache) {
                newStatistics.readMemoryCount++;
            }
            if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.PersistentStorageCache) {
                newStatistics.readPersisentCount++;
            }
            if (message.payload.action === DataAction.Save && message.payload.source === DataSource.HttpRequest) {
                newStatistics.saveHttpCount++;
            }
            if (message.payload.action === DataAction.Save && message.payload.source === DataSource.MemoryCache) {
                newStatistics.saveMemoryCount++;
            }
            if (message.payload.action === DataAction.Save && message.payload.source === DataSource.PersistentStorageCache) {
                newStatistics.savePersistentCount++;
            }
            if (message.payload.action === DataAction.Use && message.payload.source === DataSource.HttpRequest) {
                newStatistics.useHttpCount++;
                if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    newStatistics.httpBytes += message.payload.performanceInsight.dataSizeInBytes;
                }
            }
            if (message.payload.action === DataAction.Use && message.payload.source === DataSource.MemoryCache) {
                newStatistics.useMemoryCount++;
                if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    newStatistics.memoryBytes += message.payload.performanceInsight.dataSizeInBytes;
                }
            }
            if (message.payload.action === DataAction.Use && message.payload.source === DataSource.PersistentStorageCache) {
                newStatistics.usePersistentCount++;
                if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    newStatistics.persistenceStorageBytes += message.payload.performanceInsight.dataSizeInBytes;
                }
            }

            // Aggregate statistic
            const totalUse = newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount;
            newStatistics.aggregateUse = totalUse === 0 ? 0 : (newStatistics.useMemoryCount + newStatistics.usePersistentCount) / (newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount);

            const totalRead = newStatistics.readHttpCount + newStatistics.readMemoryCount + newStatistics.readPersisentCount;
            const totalWrite = newStatistics.saveHttpCount + newStatistics.saveMemoryCount + newStatistics.savePersistentCount;
            newStatistics.aggregateRead = totalRead + totalWrite === 0 ? 0 : totalRead / (totalRead + totalWrite);

            newStatistics.aggregateMem = newStatistics.useMemoryCount + newStatistics.usePersistentCount === 0 ? 0 : newStatistics.useMemoryCount / (newStatistics.useMemoryCount + newStatistics.usePersistentCount);

            if (message.payload.action === DataAction.Use || message.payload.action === DataAction.Fetch) {
                newStatistics.successfulFetchFull++;
            }
            // Performance Percentile
            if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.HttpRequest) {
                if (message.payload.performanceInsight !== undefined
                    && message.payload.performanceInsight.httpRequest !== undefined
                    && message.payload.performanceInsight.httpRequest.stopMs !== undefined) {
                    newStatistics.fetchMs.httpRequestsMs.push(message.payload.performanceInsight.httpRequest.stopMs - message.payload.performanceInsight.httpRequest.startMs);
                }
            }
            if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.PersistentStorageCache) {
                if (message.payload.performanceInsight !== undefined
                    && message.payload.performanceInsight.persistentStorageCache !== undefined
                    && message.payload.performanceInsight.persistentStorageCache.stopMs !== undefined) {
                    newStatistics.fetchMs.persistentStorageRequestsMs.push(message.payload.performanceInsight.persistentStorageCache.stopMs - message.payload.performanceInsight.persistentStorageCache.startMs);
                }
            }

            // Bytes used are coming from where?
            if (message.payload.action === DataAction.Use) {
                const totalBytes = newStatistics.httpBytes + newStatistics.memoryBytes + newStatistics.persistenceStorageBytes;
                if (totalBytes > 0) {
                    newStatistics.bytesInCacheRate = (newStatistics.memoryBytes + newStatistics.persistenceStorageBytes) / totalBytes;
                } else {
                    newStatistics.bytesInCacheRate = 0;
                }
            }

        }
        if (message.payload.kind === "LogError") {
            if (message.payload.action === DataAction.Use || message.payload.action === DataAction.Fetch) {
                newStatistics.failedFetchFull++;
            }
        }
        const totalFetch = newStatistics.successfulFetchFull + newStatistics.failedFetchFull;
        newStatistics.aggregateSuccessFetchRate = totalFetch === 0 ? 0 : newStatistics.successfulFetchFull / totalFetch;

        return newStatistics;
    }

    public getMessageKey(message: MessageClient): string {
        return `${message.incomingDateTime}_
        ${encodeURI(message.payload.id)}_
        ${encodeURI(JSON.stringify(message.payload.performanceInsight))}_
        ${encodeURI(message.payload.action)}_
        ${encodeURI(message.payload.source)}`;
    }
}