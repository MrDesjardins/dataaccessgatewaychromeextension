import percentile from "@elstats/percentile";
import * as chartjs from "chart.js";
import * as React from "react";
import { ChartData, Line } from "react-chartjs-2";
import { Statistics } from "../../BusinessLogics/Model";
import { FONT_COLOR, FONT_SIZE, GRAPH_HEIGHT, GRAPH_WIDTH, PERSISTENCE_BACKGROUND_COLOR } from "./Constants";

export interface GraphPercentileDateAgeProps {
    statistics: Statistics;
}
export class GraphPercentileDateAge extends React.Component<GraphPercentileDateAgeProps> {

    public render(): JSX.Element {
        const values = this.props.statistics.dateAgeMs;
        const db5th =  percentile(values, 5);
        const db25th = percentile(values, 25);
        const db50th = percentile(values, 50);
        const db75th = percentile(values, 75);
        const db95th = percentile(values, 95);
        const db99th = percentile(values, 99);
        let dbArray = [db5th, db25th, db50th, db75th, db95th, db99th];
        dbArray = dbArray.map(d => { if (d === undefined) { return 0; } else { return d; } });
        let unit: string = "ms";
        if (db99th >= 1000) {
            unit = "s";
            dbArray = dbArray.map(d => d / 1000);
        }
        if (db99th >= 60) {
            unit = "min";
            dbArray = dbArray.map(d => d / 60);
        }
        const data: ChartData<chartjs.ChartData> = {
            labels: ["5th", "25th", "50th", "75th", "95th", "99th"],
            datasets: [
                {
                    label: "Data Age",
                    backgroundColor: PERSISTENCE_BACKGROUND_COLOR,
                    borderColor: PERSISTENCE_BACKGROUND_COLOR,
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: dbArray
                }
            ]
        };
        return <Line
            height={GRAPH_HEIGHT}
            width={GRAPH_WIDTH}
            data={data}
            options={{
                legend: {
                    labels: {
                        fontColor: FONT_COLOR,
                        fontSize: FONT_SIZE,
                    }
                },
                maintainAspectRatio: false,
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: FONT_COLOR,
                            fontSize: FONT_SIZE,
                            beginAtZero: false,
                            callback: function (value: number, index: number) {
                                return value.toFixed(0) + unit;
                            },
                        }
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
                            return Number(tooltipItem.yLabel).toFixed(unit === "ms" ? 0 : 2) + unit;
                        }
                    }
                }
            }}
        />;
    }
}