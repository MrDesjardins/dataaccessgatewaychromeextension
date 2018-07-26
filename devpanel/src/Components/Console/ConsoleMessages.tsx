import * as React from "react";
import { AutoSizer, Index, List, ListRowProps } from "react-virtualized";
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
    filteredData: MessageClient[];
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps, ConsoleMessagesState> {
    static logics: ILogics = new Logics(); // To inject later
    private openMessages: { [key: string]: string } = {};
    private list: List | null = null;
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
                },
                charTrimmedFromUrl: 0,
                action: undefined
            },
            filteredData: []
        };
    }

    public static getDerivedStateFromProps(
        props: ConsoleMessagesProps,
        state: ConsoleMessagesState
    ): ConsoleMessagesState {
        const allData = props.listMessages.filter(m =>
            ConsoleMessages.logics.filterConsoleMessages(
                m,
                state.consoleMessageOptions
            )
        );
        return {
            ...state,
            filteredData: allData
        };
    }
    public render(): JSX.Element {
        const tableHeaderClass = `ConsoleMessage-header ${
            this.state.isConsoleHeaderOpen ? "ConsoleMessage-header-open" : ""
        }`;
        return (
            <div className="ConsoleMessages">
                <ul className={tableHeaderClass}>
                    {
                        <li
                            key="tableheader"
                            className="tableheader"
                            onClick={() => {
                                this.onHeaderClick();
                            }}
                        >
                            <div className={CSS_TIME}>Time</div>
                            <div className={CSS_SOURCE}>Action</div>
                            <div className={CSS_ACTION}>Source</div>
                            <div className={CSS_PERFORMANCE}>Perf</div>
                            <div className={CSS_URL}>Url</div>
                        </li>
                    }
                    <ConsoleMessagesOptions
                        isOpen={this.state.isConsoleHeaderOpen}
                        performance={this.state.consoleMessageOptions.performance}
                        size={this.state.consoleMessageOptions.size}
                        action={this.state.consoleMessageOptions.action}
                        charTrimmedFromUrl={this.state.consoleMessageOptions.charTrimmedFromUrl}
                        onChangeOptions={p => this.onConsoleMessagesOptionsChange(p)}
                    />
                </ul>
                <ul className="ConsoleMessage-items">
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                ref={r => (this.list = r)}
                                className="ConsoleMessage-virtual-list"
                                height={height}
                                rowCount={this.state.filteredData.length}
                                rowHeight={p => this.calculateRowHeight(p)}
                                rowRenderer={p => this.renderRow(p)}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                </ul>
            </div>
        );
    }

    private calculateRowHeight(params: Index): number {
        return this.openMessages[this.state.filteredData[params.index].uuid] === undefined ? 18 : 300;
    }
    private renderRow(props: ListRowProps): React.ReactNode {
        const index = props.index;
        const m = this.state.filteredData[index];
        return (
            <ConsoleMessagesLine
                key={m.uuid}
                style={props.style}
                message={m}
                listMessages={this.props.listMessages}
                demoModeEnabled={this.props.demoModeEnabled}
                onClick={(msg, o) => this.lineOnClick(msg, o)}
                isOpen={this.openMessages[m.uuid] !== undefined}
                charTrimmedFromUrl={this.state.consoleMessageOptions.charTrimmedFromUrl}
            />
        );
    }

    private lineOnClick(msg: MessageClient, isOpen: boolean): void {
        const unique = msg.uuid;
        if (isOpen) {
            this.openMessages[unique] = unique;
        } else {
            delete this.openMessages[unique];
        }
        if (this.list !== null) {
            this.list.recomputeRowHeights();
            // this.list.forceUpdate();
        }
    }
    private onConsoleMessagesOptionsChange(options: Partial<ConsoleMessageOptionsModel>): void {
        const existingState = { ...this.state };
        existingState.consoleMessageOptions = { ...this.state.consoleMessageOptions, ...options };
        this.setState(existingState);
    }

    private onHeaderClick(): void {
        const currentTableHeaderOpenState = this.state.isConsoleHeaderOpen;
        this.setState({
            isConsoleHeaderOpen: !currentTableHeaderOpenState
        });
    }
}
