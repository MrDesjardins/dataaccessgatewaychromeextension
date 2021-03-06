import * as React from "react";
import CountUp from "react-countup";
import { Statistics } from "../../BusinessLogics/Model";
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
    oldBytesInCacheRate: number;
    newBytesInCacheRate: number;
    oldHttpGet: number;
    newHttpGet: number;
    oldHttpPost: number;
    newHttpPost: number;
    oldHttpPut: number;
    newHttpPut: number;
    oldHttpDelete: number;
    newHttpDelete: number;
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
            newAggregateSuccessFetchRate: 0,
            oldBytesInCacheRate: 0,
            newBytesInCacheRate: 0,
            oldHttpGet: 0,
            newHttpGet: 0,
            oldHttpPost: 0,
            newHttpPost: 0,
            oldHttpPut: 0,
            newHttpPut: 0,
            oldHttpDelete: 0,
            newHttpDelete: 0
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
            newBytesInCacheRate: props.statistics.bytesInCacheRate,
            oldBytesInCacheRate: state.newBytesInCacheRate,
            oldHttpGet: state.newHttpGet,
            newHttpGet: props.statistics.httpGetCount,
            oldHttpPost: state.newHttpPost,
            newHttpPost: props.statistics.httpPostCount,
            oldHttpPut: state.newHttpPut,
            newHttpPut: props.statistics.httpPutCount,
            oldHttpDelete: state.newHttpDelete,
            newHttpDelete: props.statistics.httpDeleteCount
        };
    }

    public render(): JSX.Element {
        return (
            <div className="Summary">
                <div className="summary-box on-going-request">
                    <div className="summary-box-value">
                        <CountUp start={this.state.oldOnGoingRequestCount} end={this.state.newOnGoingRequestCount} />
                    </div>
                    <div className="summary-box-label">On-going Request</div>
                </div>
                <div className="summary-box-dual use">
                    <div className="summary-box-dual-row">
                        <div className="summary-box-value">
                            <CountUp start={this.state.oldAggregateUse * 100} end={this.state.newAggregateUse * 100} />
                        </div>
                        <div className="summary-box-label">% Used From Cache vs Http</div>
                    </div>
                    <div className="summary-box-dual-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldBytesInCacheRate * 100}
                                end={this.state.newBytesInCacheRate * 100}
                            />
                        </div>
                        <div className="summary-box-label">% Used Bytes Cache vs Http</div>
                    </div>
                </div>
                <div className="summary-box-dual use">
                    <div className="summary-box-dual-row">
                        <div className="summary-box-value">
                            <CountUp start={this.state.oldAggregateMem * 100} end={this.state.newAggregateMem * 100} />
                        </div>
                        <div className="summary-box-label">% Used Data From Memory vs DB</div>
                    </div>
                    <div className="summary-box-dual-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldAggregateRead * 100}
                                end={this.state.newAggregateRead * 100}
                            />
                        </div>
                        <div className="summary-box-label">% Ops Read vs Write</div>
                    </div>
                </div>
                <div className="summary-box-four use" title="HTTP Fetch with action 'USE'">
                    <div className="summary-box-four-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldHttpGet}
                                end={this.state.newHttpGet}
                                separator=" "
                            />
                        </div>
                        <div className="summary-box-label" style={this.getPercentage(this.state.newHttpGet)}>
                            Get
                        </div>
                    </div>
                    <div className="summary-box-four-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldHttpPost}
                                end={this.state.newHttpPost}
                                separator=" "
                            />
                        </div>
                        <div className="summary-box-label" style={this.getPercentage(this.state.newHttpPost)}>
                            Post
                        </div>
                    </div>
                    <div className="summary-box-four-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldHttpPut}
                                end={this.state.newHttpPut}
                                separator=" "
                            />
                        </div>
                        <div className="summary-box-label" style={this.getPercentage(this.state.newHttpPut)}>
                            Put
                        </div>
                    </div>
                    <div className="summary-box-four-row">
                        <div className="summary-box-value">
                            <CountUp
                                start={this.state.oldHttpDelete}
                                end={this.state.newHttpDelete}
                                separator=" "
                            />
                        </div>
                        <div className="summary-box-label" style={this.getPercentage(this.state.newHttpDelete)}>
                            Delete
                        </div>
                    </div>
                </div>
                <div className="summary-box use">
                    <div className="summary-box-value">
                        <CountUp
                            start={this.state.oldAggregateSuccessfulFetchRate * 100}
                            end={this.state.newAggregateSuccessFetchRate * 100}
                        />
                    </div>
                    <div className="summary-box-label">% Http Fetch Success</div>
                </div>
            </div>
        );
    }

    private getPercentage(numb: number): React.CSSProperties {
        const total =
            this.props.statistics.httpDeleteCount +
            this.props.statistics.httpGetCount +
            this.props.statistics.httpPostCount +
            this.props.statistics.httpPutCount;
        const percentage = total === 0 ? 0 : Math.ceil((numb / total) * 100);
        return {
            background: `linear-gradient(to right, rgb(216, 81, 170) 0%, rgb(48, 49, 82) ${percentage}%,rgba(0,0,0,0) ${percentage}%,rgba(0,0,0,0) 100%)`
        };
    }
}
