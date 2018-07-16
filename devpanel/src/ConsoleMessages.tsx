import * as moment from "moment";
import * as React from "react";
import { DataAction, DataSource, MessageClient, sizeConversation } from "./Model";
export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
    demoMode?: boolean;
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps> {
    public constructor(props: ConsoleMessagesProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <ul className="ConsoleMessages">
            {this.props.listMessages.map(
                (m: MessageClient, i: number) => {
                    const lineStyles = m.payload.kind === "LogInfo" ? (m.payload.action === DataAction.Use ? "line-use" : "") : "line-error";
                    const sourceStyles = "source " + m.payload.source;
                    const actionStyles = "action " + m.payload.action;
                    const performanceStyles = "performance " + m.payload.source;
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
                    const idStyles = this.props.demoMode ? { filter: "blur(2px)" } : {};
                    return <li key={i} className={lineStyles}>
                        <div className="time" title={m.incomingDateTime}>{moment(m.incomingDateTime).fromNow()}</div>
                        <div className={actionStyles}>{m.payload.action}</div>
                        <div className={sourceStyles}>{m.payload.source}</div>
                        <div className={performanceStyles}>{performanceString}<span className="size">{sizeString}</span></div>
                        <div className="idurl" style={idStyles} title={idUrl}>{idUrl}</div>
                    </li>;
                }
            )
            }
        </ul>;
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