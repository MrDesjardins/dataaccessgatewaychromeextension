import * as moment from "moment";
import * as React from "react";
import { ConsoleMessagesOptions } from "./ConsoleMessagesOptions";
import { ILogics, Logics } from "./Logics";
import { ConsoleOptions, DataAction, MessageClient, sizeConversation, Threshold } from "./Model";
export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
    demoMode?: boolean;
}

export interface ConsoleMessagesState {
    isOpen: boolean;
    performance: Threshold;
    size: Threshold;
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps, ConsoleMessagesState> {
    private static CSS_TIME = "time";
    private static CSS_SOURCE = "source";
    private static CSS_ACTION = "action";
    private static CSS_PERFORMANCE = "performance";
    private static CSS_ID = "idurl";
    private logics: ILogics = new Logics(); // To inject later
    public constructor(props: ConsoleMessagesProps) {
        super(props);
        this.state = {
            isOpen: false,
            performance: {
                value: "",
                sign: "gt"
            },
            size: {
                value: "",
                sign: "gt"
            }
        };
    }
    public render(): JSX.Element {
        const tableHeaderClass = `ConsoleMessage-header ${this.state.isOpen ? "ConsoleMessage-header-open" : ""}`;
        return <div className="ConsoleMessages">
            <ul className={tableHeaderClass}>
                {<li key="tableheader" className="tableheader" onClick={() => { this.onHeaderClick(); }}>
                    <div className={ConsoleMessages.CSS_TIME}>Time</div>
                    <div className={ConsoleMessages.CSS_SOURCE}>Source</div>
                    <div className={ConsoleMessages.CSS_ACTION}>Action</div>
                    <div className={ConsoleMessages.CSS_PERFORMANCE}>Perf</div>
                    <div className={ConsoleMessages.CSS_ID}>Id/Url</div>
                </li>}
                <ConsoleMessagesOptions
                    isOpen={this.state.isOpen}
                    performance={this.state.performance}
                    size={this.state.size}
                    onChangeOptions={(p) => this.onConsoleMessagesOptionsChange(p)}
                />
            </ul>
            <ul className="ConsoleMessage-items">
                {this.props.listMessages
                    .filter((m) => this.filterConsoleMessages(m))
                    .map((m: MessageClient, i: number) => this.renderOneLineConsole(m, i))
                }
            </ul>
        </div>;
    }

    private onConsoleMessagesOptionsChange(options: Partial<ConsoleOptions>): void {
        if (options.performance !== undefined) {
            this.setState({ performance: options.performance });
        }
        if (options.size !== undefined) {
            this.setState({ size: options.size });
        }
    }
    private renderOneLineConsole(m: MessageClient, i: number): JSX.Element {
        const idStyles = this.props.demoMode ? { filter: "blur(2px)" } : {};
        const lineStyles = m.payload.kind === "LogInfo" ? (m.payload.action === DataAction.Use ? "line-use" : "") : "line-error";
        const sourceStyles = `${ConsoleMessages.CSS_SOURCE} ${m.payload.source}`;
        const actionStyles = `${ConsoleMessages.CSS_ACTION} ${m.payload.action}`;
        const performanceStyles = `${ConsoleMessages.CSS_PERFORMANCE} ${m.payload.source}`;
        let performance = 0;
        let performanceString = "";
        let sizeString = "";
        performance = this.logics.extractPerformanceFromPayload(m);
        if (m.payload.kind === "LogInfo") {
            performanceString = this.logics.timeConversion(performance);
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

    private filterConsoleMessages(m: MessageClient): boolean {
        if (this.state.performance.value !== "") {
            const performance = this.logics.extractPerformanceFromPayload(m);
            if (performance !== 0 && this.state.performance.value !== 0) { // If the payload has data, and something in the input
                if (this.state.performance.sign === "gt" && performance < this.state.performance.value) {
                    return false;
                }
                if (this.state.performance.sign === "lt" && performance > this.state.performance.value) {
                    return false;
                }
            }
        }
        if (this.state.size.value !== "") {
            const size = this.extractSizeFromPayload(m);
            if (this.state.size.sign === "gt" && size < this.state.size.value) {
                return false;
            }
            if (this.state.size.sign === "lt" && size > this.state.size.value) {
                return false;
            }
        }

        return true;

    }
    private extractSizeFromPayload(m: MessageClient): number {
        let size: number = 0;
        if (m.payload.kind === "LogInfo") {
            if (m.payload.performanceInsight !== undefined) {
                if (m.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    size = m.payload.performanceInsight.dataSizeInBytes;
                }
            }
        }
        return size;
    }

    private onHeaderClick(): void {
        const currentTableHeaderOpenState = this.state.isOpen;
        this.setState({
            isOpen: !currentTableHeaderOpenState
        });
    }
}