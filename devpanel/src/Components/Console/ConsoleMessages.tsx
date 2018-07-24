import * as React from "react";
import { ILogics, Logics } from "../../BusinessLogics/Logics";
import { ConsoleMessageOptionsModel, CSS_ACTION, CSS_PERFORMANCE, CSS_SOURCE, CSS_TIME, CSS_URL, MessageClient } from "../../BusinessLogics/Model";
import { ConsoleMessagesLine } from "./ConsoleMessagesLine";
import { ConsoleMessagesOptions } from "./ConsoleMessagesOptions";
export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
    demoModeEnabled?: boolean;
}

export interface ConsoleMessagesState {
    isConsoleHeaderOpen: boolean;
    consoleMessageOptions: ConsoleMessageOptionsModel;
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps, ConsoleMessagesState> {
    private logics: ILogics = new Logics(); // To inject later
    public constructor(props: ConsoleMessagesProps) {
        super(props);
        this.state = {
            isConsoleHeaderOpen: false,
            consoleMessageOptions: {
                performance: {
                    value: "",
                    sign: "gt"
                },
                size: {
                    value: "",
                    sign: "gt"
                }
            }
        };
    }
    public render(): JSX.Element {
        const tableHeaderClass = `ConsoleMessage-header ${this.state.isConsoleHeaderOpen ? "ConsoleMessage-header-open" : ""}`;
        return <div className="ConsoleMessages">
            <ul className={tableHeaderClass}>
                {<li key="tableheader" className="tableheader" onClick={() => { this.onHeaderClick(); }}>
                    <div className={CSS_TIME}>Time</div>
                    <div className={CSS_SOURCE}>Source</div>
                    <div className={CSS_ACTION}>Action</div>
                    <div className={CSS_PERFORMANCE}>Perf</div>
                    <div className={CSS_URL}>Url</div>
                </li>}
                <ConsoleMessagesOptions
                    isOpen={this.state.isConsoleHeaderOpen}
                    performance={this.state.consoleMessageOptions.performance}
                    size={this.state.consoleMessageOptions.size}
                    onChangeOptions={(p) => this.onConsoleMessagesOptionsChange(p)}
                />
            </ul>
            <ul className="ConsoleMessage-items">
                {this.props.listMessages
                    .filter((m) => this.logics.filterConsoleMessages(m, this.state.consoleMessageOptions.performance, this.state.consoleMessageOptions.size))
                    .map((m: MessageClient) => <ConsoleMessagesLine
                        key={this.logics.getMessageKey(m)}
                        message={m}
                        listMessages={this.props.listMessages}
                        demoModeEnabled={this.props.demoModeEnabled}
                    />)
                }
            </ul>
        </div>;
    }

    private onConsoleMessagesOptionsChange(options: Partial<ConsoleMessageOptionsModel>): void {
        if (options.performance !== undefined) {
            const existingState = { ...this.state };
            existingState.consoleMessageOptions.performance = options.performance;
            this.setState({ consoleMessageOptions: existingState.consoleMessageOptions });
        }
        if (options.size !== undefined) {
            const existingState = { ...this.state };
            existingState.consoleMessageOptions.size = options.size;
            this.setState({ consoleMessageOptions: existingState.consoleMessageOptions });
        }
    }

    private onHeaderClick(): void {
        const currentTableHeaderOpenState = this.state.isConsoleHeaderOpen;
        this.setState({
            isConsoleHeaderOpen: !currentTableHeaderOpenState
        });
    }
}