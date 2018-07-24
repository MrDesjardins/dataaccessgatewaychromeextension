import * as chartjs from "chart.js";
import * as Levenshtein from "fast-levenshtein";
import * as moment from "moment";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { ILogics, Logics } from "../../BusinessLogics/Logics";
import { getDividerSize, getDividerTime, MessageClient, sizeConversation } from "../../BusinessLogics/Model";
import { FONT_COLOR } from "../Graphs/Constants";

export interface ConsoleMessagesLineDetailsProps {
    message: MessageClient;
    listMessages: MessageClient[];
    isDemoModeEnabled: boolean | undefined;
}
export interface ConsoleMessagesLineDetailsState {
    levenshteinThreshold: number;
}
export class ConsoleMessagesLineDetails extends React.Component<ConsoleMessagesLineDetailsProps, ConsoleMessagesLineDetailsState> {
    private logics: ILogics = new Logics(); // To inject later
    constructor(props: ConsoleMessagesLineDetailsProps) {
        super(props);
        this.state = {
            levenshteinThreshold: 0
        };
    }

    public render(): JSX.Element | undefined {
        let longerMs: number = 0;
        let biggerByte: number = 0;

        let listSimilarIds: MessageClient[] = [];
        for (let iMessage = this.props.listMessages.length - 1; iMessage >= 0; iMessage--) {
            const msg = this.props.listMessages[iMessage];
            let isSimilarURL = false;
            if (this.state.levenshteinThreshold === 0) {
                isSimilarURL = msg.payload.url === this.props.message.payload.url;
            } else {
                const lv = Levenshtein.get(msg.payload.url, this.props.message.payload.url);
                isSimilarURL = lv <= this.state.levenshteinThreshold;
            }
            if (isSimilarURL && msg.payload.action === this.props.message.payload.action) {
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
                    borderColor: "#ac77f1",
                    backgroundColor: "#ac77f1",
                },
                {
                    yAxisID: "y-axis-size",
                    label: "Size",
                    data: labelData.map((arr) => arr[2] as number / dividerSize),
                    backgroundColor: "#8477f1",
                    borderColor: "#8477f1",
                }
            ]
        };
        const options: chartjs.RadialChartOptions = {
            legend: {
                display: true,
                position: "left",
                labels: {
                    fontColor: FONT_COLOR
                }
            },
            scales: {
                yAxes: [{
                    id: "y-axis-performance",
                    position: "left",
                    type: "linear",
                    ticks: {
                        fontColor: FONT_COLOR,
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
                        fontColor: FONT_COLOR,
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
                        fontColor: FONT_COLOR,
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
                        let perf: string;
                        if (tooltipItem.datasetIndex === 0) {
                            perf = Number(tooltipItem.yLabel).toFixed(unitPerformance === "ms" ? 0 : 2) + unitPerformance;
                        } else {
                            perf = Number(tooltipItem.yLabel).toFixed(2) + biggerWithUnit.unit;
                        }
                        return perf;
                    }
                }
            }
        };
        const levenshteinValue = this.state.levenshteinThreshold;
        const c = new Set(listSimilarIds.map(d => d.payload.url));
        const uniq = [...Array.from(c)];
        const classCompareLine = `compareLine ${this.props.isDemoModeEnabled ? "demo-mode" : ""}`;
        return <div className="ConsoleMessagesLineDetails">
            <div className="console-chart-and-options">
                <div className="console-chart">
                    <Bar
                        data={data}
                        height={200}
                        width={500}
                        options={options}
                    />
                </div>
                <div className="console-chart-options">
                    <label htmlFor="sliderLevenshtein">Levenshtein Threshold on Id:</label>
                    <input
                        id="sliderLevenshtein"
                        type="range"
                        min="0"
                        max="100"
                        value={levenshteinValue}
                        className="slider"
                        onChange={(m) => this.onLevenshteinThresholdChange(m)}
                    />
                    <span className="levenshteinValue">{this.state.levenshteinThreshold}</span>
                </div>
            </div>
            <div className="console-chart-listMessageComparedAgainst">
                <h3>Url Compared Against</h3>
                <ul>
                    {uniq.map((m, index) => {
                        const url = this.props.isDemoModeEnabled ? btoa(m) : m;
                        return <li className={classCompareLine} key={index} title={url}>{url}</li>;
                    })}
                </ul>
            </div>
        </div>;

    }
    private onLevenshteinThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        this.setState(
            {
                levenshteinThreshold: valueNumber
            });
    }
}