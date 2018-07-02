import * as React from "react";
import { MessageClient } from "./Model";

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
                (m: MessageClient, i: number) =>
                    <li key={i}>
                        <div className="time" title={m.incomingDateTime.toISOString()}>{m.incomingDateTime.fromNow()}</div>
                        <div className="action">{m.payload.action}</div>
                        <div className="source">{m.payload.source}</div>
                        <div className="idurl">{m.payload.id}</div>
                    </li>)}
        </ul>;
    }
}