export interface LogInfo {
    id: string;
    action: string;
    source: string;
}
export interface Message {
    id: string;
    payload: LogInfo;
}