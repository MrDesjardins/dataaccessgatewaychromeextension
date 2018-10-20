import * as chartjs from "chart.js";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { Statistics } from "../../BusinessLogics/Model";
import { BAR_HOVER_BACKGROUND_COLOR, BAR_HOVER_BORDER_COLOR, FONT_COLOR, FONT_SIZE, GRAPH_HEIGHT, GRAPH_WIDTH, HTTP_BACKGROUND_COLOR, MEMORY_BACKGROUND_COLOR, PERSISTENCE_BACKGROUND_COLOR } from "./Constants";
export interface GraphFetchSourceProps {
    statistics: Statistics;
}
export class GraphFetchSource extends React.Component<GraphFetchSourceProps> {
    public render(): JSX.Element {
        const fetchTypes = Object.keys(this.props.statistics.aggregateFetchType);
        const data: ChartData<chartjs.ChartData> = {
            labels: fetchTypes,
            datasets: [
                {
                    backgroundColor: [
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR,
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR,
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR
                    ],
                    borderColor: [
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR,
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR,
                        MEMORY_BACKGROUND_COLOR,
                        PERSISTENCE_BACKGROUND_COLOR,
                        HTTP_BACKGROUND_COLOR
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: BAR_HOVER_BACKGROUND_COLOR,
                    hoverBorderColor: BAR_HOVER_BORDER_COLOR,
                    data: fetchTypes.map((key: string) => {
                        return this.props.statistics.aggregateFetchType[key];
                    })
                }
            ]
        };
        return (
            <Bar
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
                        yAxes: [
                            {
                                ticks: {
                                    fontColor: FONT_COLOR,
                                    fontSize: 14,
                                    beginAtZero: false
                                }
                            }
                        ],
                        xAxes: [
                            {
                                ticks: {
                                    fontColor: FONT_COLOR,
                                    fontSize: FONT_SIZE,
                                    beginAtZero: false,
                                    autoSkip: false,
                                    maxRotation: 30,
                                    minRotation: 30
                                }
                            }
                        ]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem: any) {
                                return Number(tooltipItem.yLabel).toFixed(0) + " requests";
                            }
                        }
                    }
                }}
            />
        );
    }
}
