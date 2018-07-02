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
            <div className="on-going-request">
                <div className="on-going-request-value">{this.props.statistics.onGoingRequestCount}</div>
                <div className="on-going-request-label"> On-going Request</div>
            </div>
        </div>;
    }
}