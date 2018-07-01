import * as React from "react";
import { Bar } from "react-chartjs-2";
import { Statistics } from "./Model";
export interface GraphProps {
    statistics: Statistics;
}

export class Graph extends React.Component<GraphProps> {
    public constructor(props: GraphProps) {
        super(props);
    }
    public render(): JSX.Element {
        const data = {
            labels: ["Mem Read", "Mem Write", "Mem Use", "Db Read", "Db Write", "Db Use", "Http Read", "Http Write", "Http Use"],
            datasets: [
                {
                    label: "Data Access Source",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
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
                width={500}
                height={200}
                options={{
                    maintainAspectRatio: false
                }}
            />
        </div>;
    }
}