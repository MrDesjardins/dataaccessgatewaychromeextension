
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
export interface LogInfo {
    id: string;
    action: DataAction;
    source: DataSource;
}
export interface Message {
    id: string;
    payload: LogInfo;
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

}