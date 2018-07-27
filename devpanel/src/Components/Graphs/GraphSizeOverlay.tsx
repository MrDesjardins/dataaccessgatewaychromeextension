import * as React from "react";
import CountUp from "react-countup";
import { sizeConversation, SizeUnit, Statistics } from "../../BusinessLogics/Model";
export interface GraphSizeOverlayProps {
    statistics: Statistics;
    style: React.CSSProperties;
}

export interface GraphSizeOverlayState {
    oldSize: SizeUnit;
    newSize: SizeUnit;
}
export class GraphSizeOverlay extends React.Component<GraphSizeOverlayProps, GraphSizeOverlayState> {
    public constructor(props: GraphSizeOverlayProps) {
        super(props);
        this.state = {
            oldSize: {
                size: 0,
                unit: "B"
            },
            newSize: {
                size: 0,
                unit: "B"
            }
        };
    }
    public static getDerivedStateFromProps(
        props: GraphSizeOverlayProps,
        state: GraphSizeOverlayState
    ): GraphSizeOverlayState {
        const total =
            props.statistics.httpBytes + props.statistics.memoryBytes + props.statistics.persistenceStorageBytes;
        const sizeUnit = sizeConversation(total);
        return {
            oldSize: state.newSize,
            newSize: sizeUnit
        };
    }
    public render(): JSX.Element {
        const total =
            this.props.statistics.httpBytes +
            this.props.statistics.memoryBytes +
            this.props.statistics.persistenceStorageBytes;
        const sizeUnit = sizeConversation(total);
        return (
            <div className="highlight-number-on-graph" style={this.props.style}>
                <span className="number">
                    <CountUp start={this.state.oldSize.size.toFixed(0)} end={this.state.newSize.size.toFixed(0)} />
                </span>
                <span className="unit">{sizeUnit.unit}</span>
            </div>
        );
    }
}
