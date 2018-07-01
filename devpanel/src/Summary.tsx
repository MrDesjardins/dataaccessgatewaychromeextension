import * as React from "react";
import { Statistics } from "./Model";

export interface SummaryProps {
    statistics: Statistics;
}

export class Summary extends React.Component<SummaryProps> {
    public constructor(props: SummaryProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="Summary">
            On-going Request: {this.props.statistics.onGoingRequestCount}
        </div>;
    }
}