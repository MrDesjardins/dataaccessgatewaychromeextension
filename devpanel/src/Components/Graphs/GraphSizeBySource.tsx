import * as chartjs from "chart.js";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { getDividerSize, sizeConversation, Statistics, Unit } from "../../BusinessLogics/Model";
import { BAR_HOVER_BACKGROUND_COLOR, BAR_HOVER_BORDER_COLOR, BAR_READ_BACKGROUND_COLOR, BAR_SAVE_BACKGROUND_COLOR, BAR_USE_BACKGROUND_COLOR, FONT_COLOR, FONT_SIZE, GRAPH_HEIGHT, GRAPH_WIDTH } from "./Constants";
export interface GraphSizeBySourceProps {
    statistics: Statistics;
}
export class GraphSizeBySource extends React.Component<GraphSizeBySourceProps> {

    public render(): JSX.Element {
        const unitWithData = this.getDataWithBiggerUnit();
        const unit = unitWithData.unit;
        const data: ChartData<chartjs.ChartData> = {
            labels: ["Mem " + unit, "DB " + unit, "Http " + unit],
            datasets: [
                {
                    backgroundColor: [
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR
                    ],
                    borderColor: [
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: BAR_HOVER_BACKGROUND_COLOR,
                    hoverBorderColor: BAR_HOVER_BORDER_COLOR,
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
            height={GRAPH_HEIGHT}
            width={GRAPH_WIDTH}
            options={{
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: FONT_COLOR,
                            fontSize: FONT_SIZE,
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
                            fontColor: FONT_COLOR,
                            fontSize: FONT_SIZE,
                            beginAtZero: false
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any) {
                            return Number(tooltipItem.yLabel).toFixed(2) + unit;
                        }
                    }
                }
            }
            }
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
        let divider = getDividerSize(biggerWithUnit);
        return {
            unit: biggerWithUnit.unit,
            memory: this.props.statistics.memoryBytes / divider,
            db: this.props.statistics.persistenceStorageBytes / divider,
            http: this.props.statistics.httpBytes / divider
        };
    }
}