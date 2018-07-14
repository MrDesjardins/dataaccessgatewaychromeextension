import * as chartjs from "chart.js";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { sizeConversation, Statistics, Unit } from "./Model";
export interface GraphProps {
    statistics: Statistics;
}

export class Graph extends React.Component<GraphProps> {
    private static GRAPH_HEIGHT = 250;
    private static GRAPH_WIDTH = 400;
    private static FONT_COLOR = "#ffe0fd";
    private static BAR_HOVER_BACKGROUND_COLOR = "rgba(245, 89, 255, 0.5)";
    private static BAR_HOVER_BORDER_COLOR = "rgba(245, 89, 255, 1)";

    private static BAR_USE_BACKGROUND_COLOR = "rgba(67, 233, 130, 0.5)";
    private static BAR_SAVE_BACKGROUND_COLOR = "rgba(55, 160, 255, 0.5)";
    private static BAR_READ_BACKGROUND_COLOR = "rgba(247, 77, 255, 0.5)";
    public constructor(props: GraphProps) {
        super(props);
    }
    public render(): JSX.Element {

        return <div className="Graph">
            <div className="IndividualGraph">
                {this.renderCountBySourceAndAction()}
            </div>
            <div className="IndividualGraph">
                {this.renderSizeGraphBySource()}
            </div>
        </div>;
    }

    public renderCountBySourceAndAction(): JSX.Element {
        const data: ChartData<chartjs.ChartData> = {
            labels: ["Mem Read", "Mem Write", "Mem Use", "Db Read", "Db Write", "Db Use", "Http Read", "Http Write", "Http Use"],
            datasets: [
                {
                    backgroundColor: [
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderColor: [
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: Graph.BAR_HOVER_BACKGROUND_COLOR,
                    hoverBorderColor: Graph.BAR_HOVER_BORDER_COLOR,
                    data: [
                        this.props.statistics.readMemoryCount,
                        this.props.statistics.saveMemoryCount,
                        this.props.statistics.useMemoryCount,
                        this.props.statistics.readPersisentCount,
                        this.props.statistics.savePersistentCount,
                        this.props.statistics.usePersistentCount,
                        this.props.statistics.readHttpCount,
                        this.props.statistics.saveHttpCount,
                        this.props.statistics.useHttpCount,
                    ]
                }
            ]
        };
        return <Bar
            data={data}
            height={Graph.GRAPH_HEIGHT}
            width={Graph.GRAPH_WIDTH}
            options={{
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: Graph.FONT_COLOR,
                            fontSize: 18,
                            beginAtZero: false
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: Graph.FONT_COLOR,
                            fontSize: 14,
                            beginAtZero: false
                        }
                    }]
                }
            }}
        />;
    }
    public getDataWithBiggerUnit(): { memory: number, db: number, http: number, unit: Unit } {
        let bigger = this.props.statistics.memoryBytes;
        if (this.props.statistics.persistenceStorageBytes > bigger) {
            bigger = this.props.statistics.persistenceStorageBytes;
        }
        if (this.props.statistics.httpBytes > bigger) {
            bigger = this.props.statistics.httpBytes;
        }
        const biggerWithUnit = sizeConversation(bigger);
        let divider = 1;
        if (biggerWithUnit.unit === "KB") {
            divider = 1024;
        } else if (biggerWithUnit.unit === "MB") {
            divider = 1024 * 1024;
        } else if (biggerWithUnit.unit === "TB") {
            divider = 1024 * 1024 * 1024;
        }
        return {
            unit: biggerWithUnit.unit,
            memory: this.props.statistics.memoryBytes / divider,
            db: this.props.statistics.persistenceStorageBytes / divider,
            http: this.props.statistics.httpBytes / divider
        };
    }
    public renderSizeGraphBySource(): JSX.Element {
        const unitWithData = this.getDataWithBiggerUnit();
        const unit = unitWithData.unit;
        const data: ChartData<chartjs.ChartData> = {
            labels: ["Mem " + unit, "DB " + unit, "Http " + unit],
            datasets: [
                {
                    backgroundColor: [
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR
                    ],
                    borderColor: [
                        Graph.BAR_READ_BACKGROUND_COLOR,
                        Graph.BAR_SAVE_BACKGROUND_COLOR,
                        Graph.BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: Graph.BAR_HOVER_BACKGROUND_COLOR,
                    hoverBorderColor: Graph.BAR_HOVER_BORDER_COLOR,
                    data: [
                        unitWithData.memory,
                        unitWithData.db,
                        unitWithData.http
                    ]
                }
            ]
        };
        return <Bar
            data={data}
            height={Graph.GRAPH_HEIGHT}
            width={Graph.GRAPH_WIDTH}
            options={{
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: Graph.FONT_COLOR,
                            fontSize: 18,
                            beginAtZero: false,
                            min: 0,
                            max: 1024,
                            callback: function (value: number, index: number) {
                                return value.toFixed(0) + unit;
                            }
                        },
                        afterBuildTicks: function (pckBarChart: any) {
                            pckBarChart.ticks = [];
                            pckBarChart.ticks.push(0);
                            pckBarChart.ticks.push(256);
                            pckBarChart.ticks.push(1024);
                        },
                        type: "logarithmic"
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: Graph.FONT_COLOR,
                            fontSize: 14,
                            beginAtZero: false
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any) {
                            return Number(tooltipItem.yLabel).toFixed(0) + unit;
                        }
                    }
                }
            }}
        />;
    }
}