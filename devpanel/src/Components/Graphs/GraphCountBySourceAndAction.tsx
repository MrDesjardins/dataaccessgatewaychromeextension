import * as chartjs from "chart.js";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { Statistics } from "../../BusinessLogics/Model";
import { BAR_HOVER_BACKGROUND_COLOR, BAR_HOVER_BORDER_COLOR, BAR_READ_BACKGROUND_COLOR, BAR_SAVE_BACKGROUND_COLOR, BAR_USE_BACKGROUND_COLOR, FONT_COLOR, FONT_SIZE, GRAPH_HEIGHT, GRAPH_WIDTH } from "./Constants";
export interface GraphCountBySourceAndActionProps {
    statistics: Statistics;
}
export class GraphCountBySourceAndAction extends React.Component<GraphCountBySourceAndActionProps> {

    public render(): JSX.Element {
        const data: ChartData<chartjs.ChartData> = {
            labels: ["Mem Read", "Mem Write", "Mem Use", "Db Read", "Db Write", "Db Use", "Http Read", "Http Write", "Http Use"],
            datasets: [
                {
                    backgroundColor: [
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderColor: [
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                        BAR_READ_BACKGROUND_COLOR,
                        BAR_SAVE_BACKGROUND_COLOR,
                        BAR_USE_BACKGROUND_COLOR,
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: BAR_HOVER_BACKGROUND_COLOR,
                    hoverBorderColor: BAR_HOVER_BORDER_COLOR,
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
            height={GRAPH_HEIGHT}
            width={GRAPH_WIDTH}
            options={{
                legend: {
                    display: false,

                },
                maintainAspectRatio: false,
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: FONT_COLOR,
                            fontSize: 14,
                            beginAtZero: false
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: FONT_COLOR,
                            fontSize: FONT_SIZE,
                            beginAtZero: false,
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem: any) {
                            return Number(tooltipItem.yLabel).toFixed(0) + " calls";
                        }
                    }
                }
            }}
        />;
    }
}