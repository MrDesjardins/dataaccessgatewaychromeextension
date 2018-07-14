import * as React from "react";
import CountUp from "react-countup";
import { Statistics } from "./Model";
export interface SummaryProps {
    statistics: Statistics;
}

export interface SummaryState {
    oldOnGoingRequestCount: number;
    newOnGoingRequestCount: number;
    oldAggregateUse: number;
    newAggregateUse: number;
    oldAggregateRead: number;
    newAggregateRead: number;
    oldAggregateMem: number;
    newAggregateMem: number;
    oldAggregateSuccessfulFetchRate: number;
    newAggregateSuccessFetchRate: number;
}
export class Summary extends React.Component<SummaryProps, SummaryState> {
    public constructor(props: SummaryProps) {
        super(props);
        this.state = {
            oldOnGoingRequestCount: 0,
            newOnGoingRequestCount: 0,
            oldAggregateUse: 0,
            newAggregateUse: 0,
            oldAggregateRead: 0,
            newAggregateRead: 0,
            oldAggregateMem: 0,
            newAggregateMem: 0,
            oldAggregateSuccessfulFetchRate: 0,
            newAggregateSuccessFetchRate: 0
        };
    }
    public static getDerivedStateFromProps(props: SummaryProps, state: SummaryState): SummaryState {
        return {
            newOnGoingRequestCount: props.statistics.onGoingRequestCount,
            oldOnGoingRequestCount: state.newOnGoingRequestCount,
            newAggregateUse: props.statistics.aggregateUse,
            oldAggregateUse: state.newAggregateUse,
            newAggregateRead: props.statistics.aggregateRead,
            oldAggregateRead: state.newAggregateRead,
            newAggregateMem: props.statistics.aggregateMem,
            oldAggregateMem: state.newAggregateMem,
            newAggregateSuccessFetchRate: props.statistics.aggregateSuccessFetchRate,
            oldAggregateSuccessfulFetchRate: state.newAggregateSuccessFetchRate,
        };
    }

    public render(): JSX.Element {
        return <div className="Summary">
            <div className="summary-box on-going-request">
                <div className="summary-box-value"><CountUp start={this.state.oldOnGoingRequestCount} end={this.state.newOnGoingRequestCount} /></div>
                <div className="summary-box-label">On-going Request</div>
            </div>
            <div className="summary-box use">
                <div className="summary-box-value"><CountUp start={this.state.oldAggregateUse * 100} end={this.state.newAggregateUse * 100} /></div>
                <div className="summary-box-label">% Use Cache vs Http</div>
            </div>
            <div className="summary-box use">
                <div className="summary-box-value"><CountUp start={this.state.oldAggregateMem * 100} end={this.state.newAggregateMem * 100} /></div>
                <div className="summary-box-label">% Use Memory vs DB</div>
            </div>
            <div className="summary-box use">
                <div className="summary-box-value"><CountUp start={this.state.oldAggregateRead * 100} end={this.state.newAggregateRead * 100} /></div>
                <div className="summary-box-label">% Read vs Write</div>
            </div>
            <div className="summary-box use">
                <div className="summary-box-value"><CountUp start={this.state.oldAggregateSuccessfulFetchRate * 100} end={this.state.newAggregateSuccessFetchRate * 100} /></div>
                <div className="summary-box-label">% Fetch Success</div>
            </div>
        </div>;
    }
}