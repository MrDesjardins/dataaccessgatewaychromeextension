import * as React from "react";
import { Message } from "./Model";

export interface ConsoleMessagesProps {
    listMessages: Message[];
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps> {
    public constructor(props: ConsoleMessagesProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <ul className="ConsoleMessages">
            {this.props.listMessages.map(
                (m: Message, i: number) =>
                    <li key={i}>{m.payload.id + "," + m.payload.action + "," + m.payload.source}</li>)}
        </ul>;
    }
}