import * as moment from "moment";
import * as React from "react";
import { DataAction, DataSource, MessageClient, sizeConversation } from "./Model";
export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
    demoMode?: boolean;
}

export interface ConsoleMessagesState {
    isOpen: boolean;
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps, ConsoleMessagesState> {
    private static CSS_TIME = "time";
    private static CSS_SOURCE = "source";
    private static CSS_ACTION = "action";
    private static CSS_PERFORMANCE = "performance";
    private static CSS_ID = "idurl";
    public constructor(props: ConsoleMessagesProps) {
        super(props);
        this.state = {
            isOpen: false
        };
    }
    public render(): JSX.Element {
        const idStyles = this.props.demoMode ? { filter: "blur(2px)" } : {};
        const tableHeaderClass = `ConsoleMessage-header ${this.state.isOpen ? "ConsoleMessage-header-open" : ""}`;
        return <div className="ConsoleMessages">
            <ul className={tableHeaderClass} onClick={() => { this.onHeaderClick(); }}>
                {<li key="tableheader" className="tableheader">
                    <div className={ConsoleMessages.CSS_TIME}>Time</div>
                    <div className={ConsoleMessages.CSS_SOURCE}>Source</div>
                    <div className={ConsoleMessages.CSS_ACTION}>Action</div>
                    <div className={ConsoleMessages.CSS_PERFORMANCE}>Perf</div>
                    <div className={ConsoleMessages.CSS_ID}>Id/Url</div>
                </li>}
                {this.renderConsoleOptions()}
            </ul>
            <ul className="ConsoleMessage-items">
                {this.props.listMessages.map(
                    (m: MessageClient, i: number) => {
                        const lineStyles = m.payload.kind === "LogInfo" ? (m.payload.action === DataAction.Use ? "line-use" : "") : "line-error";
                        const sourceStyles = `${ConsoleMessages.CSS_SOURCE} ${m.payload.source}`;
                        const actionStyles = `${ConsoleMessages.CSS_ACTION} ${m.payload.action}`;
                        const performanceStyles = `${ConsoleMessages.CSS_PERFORMANCE} ${m.payload.source}`;
                        let performance = 0;
                        let performanceString = "";
                        let sizeString = "";
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

                            performanceString = this.timeConversion(performance);
                            if (m.payload.performanceInsight !== undefined) {
                                if (m.payload.performanceInsight.dataSizeInBytes !== undefined) {
                                    const sizeConverted = sizeConversation(m.payload.performanceInsight.dataSizeInBytes);
                                    sizeString = sizeConverted.size.toFixed(1) + sizeConverted.unit;
                                }
                            }
                        }
                        const idUrl = this.props.demoMode ? btoa(m.payload.id) : m.payload.id;
                        return <li key={i} className={lineStyles}>
                            <div className={ConsoleMessages.CSS_TIME} title={m.incomingDateTime}>{moment(m.incomingDateTime).fromNow()}</div>
                            <div className={actionStyles}>{m.payload.action}</div>
                            <div className={sourceStyles}>{m.payload.source}</div>
                            <div className={performanceStyles}>{performanceString}<span className="size">{sizeString}</span></div>
                            <div className={ConsoleMessages.CSS_ID} style={idStyles} title={idUrl}>{idUrl}</div>
                        </li>;
                    }
                )
                }
            </ul>
        </div>;
    }

    private onHeaderClick(): void {
        const currentTableHeaderOpenState = this.state.isOpen;
        this.setState({
            isOpen: !currentTableHeaderOpenState
        });
    }
    private renderConsoleOptions(): JSX.Element | undefined {
        if (this.state.isOpen) {
            return <div>Options</div>;
        } else {
            return undefined;
        }
    }
    private timeConversion(ms: number): string {
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