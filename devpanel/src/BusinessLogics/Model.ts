export enum DataSource {
    HttpRequest = "HttpRequest",
    MemoryCache = "MemoryCache",
    PersistentStorageCache = "PersistentStorageCache",
    System = "System"
}

export enum HttpMethod {
    NONE = "NONE",
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    PATCH = "PATCH"
}
export enum DataAction {
    Save = "Save",
    Fetch = "Fetch",
    Use = "Use",
    Delete = "Delete",
    WaitingOnGoingRequest = "WaitingOnGoingRequest",
    AddFromOnGoingRequest = "AddFromOnGoingRequest",
    RemoveFromOnGoingRequest = "RemoveFromOnGoingRequest",
    System = "System"
}
export enum FetchType {
    Fast = "Fast",
    Fresh = "Fresh",
    Web = "Web",
    FastAndFresh = "FastAndWeb",
    Execute = "Execute",
    FastAndFreshObject = "FastAndFreshObject"
}
export interface PerformanceTimeMarker {
    startMs: number;
    stopMs?: number;
    elapsedMs?: number;
}
export interface PerformanceRequestInsight {
    fetch: PerformanceTimeMarker;
    memoryCache?: PerformanceTimeMarker;
    persistentStorageCache?: PerformanceTimeMarker;
    httpRequest?: PerformanceTimeMarker;
    dataSizeInBytes?: number;
}
export interface LogBase {
    source: DataSource;
    action: DataAction;
    id: string;
    url: string;
    performanceInsight?: PerformanceRequestInsight;
    fetchType: FetchType | undefined;
    httpMethod: HttpMethod;
}
export interface LogError extends LogBase {
    kind: "LogError";
    error: any;
}
export interface LogInfo extends LogBase {
    kind: "LogInfo";
    dataSignature: string | undefined;
    dataAgeMs: number | undefined;
    useIsIntermediate?: boolean | undefined;
}
export interface Message {
    id: string;
    source: string;
    payload: LogInfo | LogError;
}
export interface MessageClient extends Message {
    incomingDateTime: string; // IsoString
    uuid: string;
}

export interface FetchPerformances {
    persistentStorageRequestsMs: number[];
    httpRequestsMs: number[];
    memoryRequestsMs: number[];
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
    fetchMs: FetchPerformances;

    bytesInCacheRate: number;

    httpGetCount: number;
    httpPostCount: number;
    httpPutCount: number;
    httpDeleteCount: number;
    dateAgeMs: number[];
    aggregateFetchType: { [index: string]: number }; // Index is the enum of the FetchType
}
export interface ConsoleMessageOptionsModel {
    performance: Threshold;
    size: Threshold;
    charTrimmedFromUrl: number;
    action: DataAction | undefined;
    source: DataSource | undefined;
    httpMethod: HttpMethod | undefined;
}
export type Unit = "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB";
export interface SizeUnit {
    size: number;
    unit: Unit;
}
export function sizeConversation(bytes: number): SizeUnit {
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

export function getDividerSize(data: SizeUnit): number {
    let divider = 1;
    if (data.unit === "KB") {
        divider = 1024;
    } else if (data.unit === "MB") {
        divider = 1024 * 1024;
    } else if (data.unit === "TB") {
        divider = 1024 * 1024 * 1024;
    }
    return divider;
}

export function getDividerTime(numberMs: number): number {
    if (numberMs < 10000) {
        return 1; // Stay in millisecond
    }
    return 1000; // Seconds
}
export type Sign = "gt" | "lt";

export interface Threshold {
    value: "" | number;
    sign: Sign;
}

export interface MemorySizesByType {
    memory: number;
    db: number;
    http: number;
    unit: Unit;
}

export const CSS_TIME = "time";
export const CSS_SOURCE = "source";
export const CSS_ACTION = "action";
export const CSS_HTTPMETHOD = "httpmethod";
export const CSS_PERFORMANCE = "performance";
export const CSS_URL = "idurl";

export interface Signature {
    lastTime: string;
    responseSignature: string;
}
export interface FetchSignatureByIdStatistics {
    numberOfFetch: number; // Number of fetch for this particular ID
    numberOfSignatureChange: number; // Does not contain the 1st one since we need the delta
    averageDeltaMsBetweenSignatureChange: number; // Milliseconds
}
export interface FetchSignatureById {
    id: string;
    url: string;
    lastResponse: Signature;
    statistics: FetchSignatureByIdStatistics;
}
