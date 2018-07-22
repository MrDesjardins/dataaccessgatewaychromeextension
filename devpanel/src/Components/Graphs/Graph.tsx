import * as React from "react";
import { Statistics } from "../../BusinessLogics/Model";
import { GraphCountBySourceAndAction } from "./GraphCountBySourceAndAction";
import { GraphPercentilePerformance } from "./GraphPercentilePerformance";
import { GraphSizeBySource } from "./GraphSizeBySource";
export interface GraphProps {
    statistics: Statistics;
}

export class Graph extends React.Component<GraphProps> {

    public constructor(props: GraphProps) {
        super(props);
    }
    public render(): JSX.Element {

        return <div className="Graph">
            <div className="IndividualGraph">
                <GraphCountBySourceAndAction statistics={this.props.statistics} />
            </div>
            <div className="IndividualGraph">
                <GraphSizeBySource statistics={this.props.statistics} />
            </div>
            <div className="IndividualGraph">
                <GraphPercentilePerformance statistics={this.props.statistics} />
            </div>
        </div>;
    }
}