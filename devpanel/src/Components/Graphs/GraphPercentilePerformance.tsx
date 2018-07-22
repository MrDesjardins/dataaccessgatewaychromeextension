import percentile from "@elstats/percentile";
import * as chartjs from "chart.js";
import * as React from "react";
import { ChartData, Line } from "react-chartjs-2";
import { Statistics } from "../../BusinessLogics/Model";
import { BAR_SAVE_BACKGROUND_COLOR, BAR_USE_BACKGROUND_COLOR, FONT_COLOR, FONT_SIZE, GRAPH_HEIGHT, GRAPH_WIDTH } from "./Constants";

export interface GraphPercentilePerformanceProps {
    statistics: Statistics;
}
export class GraphPercentilePerformance extends React.Component<GraphPercentilePerformanceProps> {

    public render(): JSX.Element {
        const db5th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 5);
        const db25th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 25);
        const db50th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 50);
        const db75th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 75);
        const db95th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 95);
        const db99th = percentile(this.props.statistics.fetchMs.persistentStorageRequestsMs, 99);
        let dbArray = [db5th, db25th, db50th, db75th, db95th, db99th];
        dbArray = dbArray.map(d => { if (d === undefined) { return 0; } else { return d; } });
        const http5th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 5);
        const http25th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 25);
        const http50th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 50);
        const http75th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 75);
        const http95th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 95);
        const http99th = percentile(this.props.statistics.fetchMs.httpRequestsMs, 99);
        let httpArray = [http5th, http25th, http50th, http75th, http95th, http99th];
        httpArray = httpArray.map(d => { if (d === undefined) { return 0; } else { return d; } });
        let unit: string = "ms";
        if (http99th > 10000) {
            unit = "s";
            httpArray = httpArray.map(d => d / 1000);
            dbArray = dbArray.map(d => d / 1000);
        }

        const data: ChartData<chartjs.ChartData> = {
            labels: ["5th", "25th", "50th", "75th", "95th", "99th"],
            datasets: [
                {
                    label: "Persistent",
                    backgroundColor: BAR_SAVE_BACKGROUND_COLOR,
                    borderColor: BAR_SAVE_BACKGROUND_COLOR,
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: dbArray
                },
                {
                    label: "Http",
                    backgroundColor: BAR_USE_BACKGROUND_COLOR,
                    borderColor: BAR_USE_BACKGROUND_COLOR,
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255,99,132,1)",
                    data: httpArray
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