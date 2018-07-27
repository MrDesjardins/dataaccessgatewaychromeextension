import * as moment from "moment";
import * as React from "react";
import { ILogics, Logics } from "../../BusinessLogics/Logics";
import { CSS_ACTION, CSS_PERFORMANCE, CSS_SOURCE, CSS_TIME, CSS_URL, DataAction, FetchSignatureById, MessageClient, sizeConversation } from "../../BusinessLogics/Model";
import { ConsoleMessagesLineDetails } from "./ConsoleMessagesLineDetails";
export interface ConsoleMessagesLineProps {
    message: MessageClient;
    demoModeEnabled?: boolean;
    listMessages: MessageClient[];
    style: React.CSSProperties;
    onClick: (message: MessageClient, isOpen: boolean) => void;
    isOpen: boolean;
    charTrimmedFromUrl: number;
    signatures: { [id: string]: FetchSignatureById };
}
export class ConsoleMessagesLine extends React.Component<ConsoleMessagesLineProps> {
    private logics: ILogics = new Logics();
    public constructor(props: ConsoleMessagesLineProps) {
        super(props);
        this.state = { activeMessage: undefined };
    }

    public render(): JSX.Element {
        const m = this.props.message;
        const lineStyles =
            m.payload.kind === "LogInfo" ? (m.payload.action === DataAction.Use ? "line-use" : "") : "line-error";
        const sourceStyles = `${CSS_SOURCE} ${m.payload.source}`;
        const actionStyles = `${CSS_ACTION} ${m.payload.action}`;
        const performanceStyles = `${CSS_PERFORMANCE} ${m.payload.source}`;
        const idStyles = `${CSS_URL} ${this.props.demoModeEnabled ? "demo-mode" : ""}`;
        let performance = 0;
        let performanceString = "";
        let sizeString = "";
        performance = this.logics.extractPerformanceFromPayload(m);
        performanceString = this.logics.timeConversion(performance);
        if (m.payload.kind === "LogInfo") {
            if (m.payload.performanceInsight !== undefined) {
                if (m.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    const sizeConverted = sizeConversation(m.payload.performanceInsight.dataSizeInBytes);
                    sizeString = sizeConverted.size.toFixed(1) + sizeConverted.unit;
                }
            }
        }
        const url = this.props.demoModeEnabled ? btoa(m.payload.url) : m.payload.url;
        const rowStyles = "row" + (this.props.isOpen ? " active-row" : "");

        return (
            <li key={m.uuid} className={lineStyles} style={this.props.style}>
                <div className={rowStyles} onClick={() => this.onLineClick(m)}>
                    <div className={CSS_TIME} title={m.incomingDateTime}>
                        <span>{moment(m.incomingDateTime).fromNow()}</span>
                    </div>
                    <div className={actionStyles}>
                        <span>{m.payload.action}</span>
                    </div>
                    <div className={sourceStyles}>
                        <span>{m.payload.source}</span>
                    </div>
                    <div className={performanceStyles}>
                        <span>{performanceString}</span>
                        <span className="size">{sizeString}</span>
                    </div>
                    <div className={idStyles} title={url}>
                        <span>{url === undefined ? "" : url.substring(this.props.charTrimmedFromUrl)}</span>
                    </div>
                </div>
                {this.renderActiveLine(m)}
            </li>
        );
    }

    private renderActiveLine(m: MessageClient): JSX.Element | undefined {
        if (this.props.isOpen) {
            return (
                <ConsoleMessagesLineDetails
                    message={m}
                    listMessages={this.props.listMessages}
                    isDemoModeEnabled={this.props.demoModeEnabled}
                    charTrimmedFromUrl={this.props.charTrimmedFromUrl}
                    signature={this.props.signatures[m.payload.id]}
                />
            );
        } else {
            return undefined;
        }
    }

    private onLineClick(m: MessageClient): void {
        const active = this.props.isOpen;
        if (active) {
            this.setState({ activeMessage: undefined });
        } else {
            this.setState({ activeMessage: m });
        }
        this.props.onClick(m, !active);
    }
}
