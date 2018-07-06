import * as chartjs from "chart.js";
import * as React from "react";
import { Bar, ChartData } from "react-chartjs-2";
import { Statistics } from "./Model";
export interface GraphProps {
    statistics: Statistics;
}

export class Graph extends React.Component<GraphProps> {
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
        return <div className="Graph">
            <Bar
                data={data}
                height={250}
                width={600}
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
            />
        </div>;
    }
}