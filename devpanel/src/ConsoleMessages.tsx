import * as React from "react";
import { DataAction, MessageClient } from "./Model";

export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps> {
    public constructor(props: ConsoleMessagesProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <ul className="ConsoleMessages">
            {this.props.listMessages.map(
                (m: MessageClient, i: number) => {
                    const lineStyles = m.payload.action === DataAction.Use ? "line-use" : "";
                    const sourceStyles = "source " + m.payload.source;
                    const actionStyles = "action " + m.payload.action;
                    return <li key={i} className={lineStyles}>
                        <div className="time" title={m.incomingDateTime.toISOString()}>{m.incomingDateTime.fromNow()}</div>
                        <div className={actionStyles}>{m.payload.action}</div>
                        <div className={sourceStyles}>{m.payload.source}</div>
                        <div className="idurl">{m.payload.id}</div>
                    </li>;
                }
            )
            }
        </ul>;
    }
}