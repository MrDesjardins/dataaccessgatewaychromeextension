import * as chartjs from "chart.js";
import * as moment from "moment";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { ConsoleMessagesOptions } from "./ConsoleMessagesOptions";
import { ILogics, Logics } from "./Logics";
import { ConsoleOptions, DataAction, getDividerSize, getDividerTime, MessageClient, sizeConversation, Threshold } from "./Model";
export interface ConsoleMessagesProps {
    listMessages: MessageClient[];
    demoMode?: boolean;
}

export interface ConsoleMessagesState {
    isOpen: boolean;
    performance: Threshold;
    size: Threshold;
    activeMessage?: MessageClient;
}

export class ConsoleMessages extends React.Component<ConsoleMessagesProps, ConsoleMessagesState> {
    private static FONT_COLOR = "#ffe0fd";
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
                    .filter((m) => this.logics.filterConsoleMessages(m, this.state.performance, this.state.size))
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
        performanceString = this.logics.timeConversion(performance);
        if (m.payload.kind === "LogInfo") {
            if (m.payload.performanceInsight !== undefined) {
                if (m.payload.performanceInsight.dataSizeInBytes !== undefined) {
                    const sizeConverted = sizeConversation(m.payload.performanceInsight.dataSizeInBytes);
                    sizeString = sizeConverted.size.toFixed(1) + sizeConverted.unit;
                }
            }
        }
        const idUrl = this.props.demoMode ? btoa(m.payload.id) : m.payload.id;
        return <li key={i} className={lineStyles}>
            <div className="row" onClick={() => this.onLineClick(m)}>
                <div className={ConsoleMessages.CSS_TIME} title={m.incomingDateTime}>{moment(m.incomingDateTime).fromNow()}</div>
                <div className={actionStyles}>{m.payload.action}</div>
                <div className={sourceStyles}>{m.payload.source}</div>
                <div className={performanceStyles}>{performanceString}<span className="size">{sizeString}</span></div>
                <div className={ConsoleMessages.CSS_ID} style={idStyles} title={idUrl}>{idUrl}</div>
            </div>
            {this.renderActiveLine(m, i)}
        </li>;
    }
    private renderActiveLine(m: MessageClient, i: number): JSX.Element | undefined {
        let longerMs: number = 0;
        let biggerByte: number = 0;
        if (m === this.state.activeMessage) {
            let listSimilarIds: MessageClient[] = [];
            for (let iMessage = this.props.listMessages.length - 1; iMessage >= 0; iMessage--) {
                const msg = this.props.listMessages[iMessage];
                if (msg.payload.id === m.payload.id && msg.payload.action === DataAction.Use) {
                    listSimilarIds.push(msg);
                }
            }
            const labelData = listSimilarIds.map((msg) => {
                const perf = this.logics.extractPerformanceFromPayload(msg);
                const payloadSize = this.logics.extractSizeFromPayload(msg);
                if (perf > longerMs) {
                    longerMs = perf;
                }
                if (payloadSize > biggerByte) {
                    biggerByte = payloadSize;
                }
                return [
                    moment(msg.incomingDateTime).toDate(),
                    perf,
                    payloadSize,
                ];
            });

            const dividerPerformance = getDividerTime(longerMs);
            const unitPerformance: string = dividerPerformance === 1 ? "ms" : "sec";
            const biggerWithUnit = sizeConversation(biggerByte);
            let dividerSize = getDividerSize(biggerWithUnit);
            const data: ChartData<chartjs.ChartData> = {
                labels: labelData.map((arr) => arr[0].toLocaleString()),
                datasets: [
                    {
                        yAxisID: "y-axis-performance",
                        label: "Performance",
                        data: labelData.map((arr) => arr[1] as number / dividerPerformance),
                        borderColor: "#EC932F",
                        backgroundColor: "#EC932F",
                    },
                    {
                        yAxisID: "y-axis-size",
                        label: "Size",
                        data: labelData.map((arr) => arr[2] as number / dividerSize),
                        backgroundColor: "#71B37C",
                        borderColor: "#71B37C",
                    }
                ]
            };
            const options: chartjs.RadialChartOptions = {
                legend: {
                    display: true,
                    position: "left",
                    labels: {
                        fontColor: ConsoleMessages.FONT_COLOR
                    }
                },
                scales: {
                    yAxes: [{
                        id: "y-axis-performance",
                        position: "left",
                        type: "linear",
                        ticks: {
                            fontColor: ConsoleMessages.FONT_COLOR,
                            fontSize: 10,
                            beginAtZero: true,
                            callback: function (value: number, index: number) {
                                return value.toFixed(unitPerformance === "ms" ? 0 : 2) + unitPerformance;
                            }
                        }
                    },
                    {
                        id: "y-axis-size",
                        position: "right",
                        type: "linear",
                        ticks: {
                            fontColor: ConsoleMessages.FONT_COLOR,
                            fontSize: 10,
                            beginAtZero: true,
                            callback: function (value: number, index: number) {
                                return value.toFixed(2) + biggerWithUnit.unit;
                            },
                            suggestedMin: 1,
                            suggestedMax: 25
                        } as chartjs.RadialLinearScale,
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: ConsoleMessages.FONT_COLOR,
                            fontSize: 10,
                            beginAtZero: false,
                            callback: function (value: any, index: any, values: any[]): string {
                                if (index === 0 || index === values.length - 1 || index === values.length / 2) {
                                    const dated = moment(Date.parse(value));
                                    return dated.format("HH:mm:ss");
                                }
                                return "";
                            },
                            minRotation: 0,
                            maxRotation: 0
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any) {
                            if (tooltipItem.datasetIndex === 0) {
                                return Number(tooltipItem.yLabel).toFixed(unitPerformance === "ms" ? 0 : 2) + unitPerformance;
                            }
                            return Number(tooltipItem.yLabel).toFixed(2) + biggerWithUnit.unit;
                        }
                    }
                }
            };
            return <div className="line-active">
                <div className="console-chart">
                    <Bar
                        data={data}
                        height={200}
                        width={500}
                        options={options}
                    />
                </div>
            </div>;
        } else {
            return undefined;
        }
    }

    private onLineClick(m: MessageClient): void {
        if (this.state.activeMessage === m) {
            this.setState({ activeMessage: undefined });
        } else {
            this.setState({ activeMessage: m });
        }
    }
    private onHeaderClick(): void {
        const currentTableHeaderOpenState = this.state.isOpen;
        this.setState({
            isOpen: !currentTableHeaderOpenState
        });
    }
}