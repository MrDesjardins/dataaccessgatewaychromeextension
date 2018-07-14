import { Moment } from "moment";
export enum DataSource {
    HttpRequest = "HttpRequest",
    MemoryCache = "MemoryCache",
    PersistentStorageCache = "PersistentStorageCache",
    System = "System",
}
export enum DataAction {
    Save = "Save",
    Fetch = "Fetch",
    Use = "Use",
    Delete = "Delete",
    WaitingOnGoingRequest = "WaitingOnGoingRequest",
    AddFromOnGoingRequest = "AddFromOnGoingRequest",
    RemoveFromOnGoingRequest = "RemoveFromOnGoingRequest",
    System = "System",
}
export interface PerformanceTimeMarker {
    startMs: number;
    stopMs?: number;
}
export interface PerformanceRequestInsight {
    fetch: PerformanceTimeMarker;
    memoryCache?: PerformanceTimeMarker;
    persistentStorageCache?: PerformanceTimeMarker;
    httpRequest?: PerformanceTimeMarker;
    dataSizeInBytes?: number;
}
export interface LogError {
    kind: "LogError";
    id: string;
    action: DataAction;
    source: DataSource;
    error: any;
}
export interface LogInfo {
    kind: "LogInfo";
    id: string;
    action: DataAction;
    source: DataSource;
    performanceInsight?: PerformanceRequestInsight;
}
export interface Message {
    id: string;
    source: string;
    payload: LogInfo | LogError;
}
export interface MessageClient extends Message {
    incomingDateTime: Moment;
}
export interface Statistics {
    onGoingRequestCount: number;

    readHttpCount: number;
    saveHttpCount: number;
    useHttpCount: number;

    readMemoryCount: number;
    saveMemoryCount: number;
    useMemoryCount: number;

    readPersisentCount: number;
    savePersistentCount: number;
    usePersistentCount: number;

    aggregateUse: number;
    aggregateRead: number;
    aggregateMem: number;

    successfulFetchFull: number;
    failedFetchFull: number;
    aggregateSuccessFetchRate: number;

    memoryBytes: number;
    persistenceStorageBytes: number;
    httpBytes: number;
}

export type Unit = "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB";
export function sizeConversation(bytes: number): { size: number, unit: Unit } {
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) {
        return { size: bytes, unit: "B" };
    }
    const units: Unit[] = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return { size: bytes, unit: units[u] };
}