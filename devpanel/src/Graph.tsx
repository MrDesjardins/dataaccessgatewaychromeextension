import * as React from "react";
import { Statistics } from "./Model";

export interface GraphProps {
    statistics: Statistics;
}

export class Graph extends React.Component<GraphProps> {
    public constructor(props: GraphProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="Graph">
            Graph Here
        </div>;
    }
}