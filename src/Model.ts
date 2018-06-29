interface LogInfo {
    id: string;
    action: string;
    source: string;
}
interface Message {
    id: string;
    payload: LogInfo;
}