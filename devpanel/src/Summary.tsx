import * as React from "react";
import { Statistics } from "./Model";
import CountUp from "react-countup";
export interface SummaryProps {
    statistics: Statistics;
}

export interface SummaryState {
    old: number;
    new: number;
}
export class Summary extends React.Component<SummaryProps, SummaryState> {
    public constructor(props: SummaryProps) {
        super(props);
        this.state = { old: 0, new: 0 };
    }
    public static getDerivedStateFromProps(props: SummaryProps, state: SummaryState): SummaryState {
        return {
            new: props.statistics.onGoingRequestCount,
            old: state.new
        };
    }

    public render(): JSX.Element {
        return <div className="Summary">
            <div className="on-going-request">
                <div className="on-going-request-value"><CountUp start={this.state.old} end={this.state.new} /></div>
                <div className="on-going-request-label"> On-going Request</div>
            </div>
        </div>;
    }
}