import * as React from "react";
import { CSSProperties } from "react";
import CountUp from "react-countup";
export interface GraphTimeOverlayProps {
    time: number;
    number: number;
    differentSignature: number;
    style: CSSProperties;
}

export interface GraphTimeOverlayState {
    oldTime: number;
    newTime: number;
    oldNumber: number;
    newNumber: number;
    olddifferentSignature: number;
    newdifferentSignature: number;
}
export class GraphTimeOverlay extends React.Component<GraphTimeOverlayProps, GraphTimeOverlayState> {
    public constructor(props: GraphTimeOverlayProps) {
        super(props);
        this.state = {
            oldTime: 0,
            newTime: 0,
            oldNumber: 0,
            newNumber: 0,
            olddifferentSignature: 0,
            newdifferentSignature: 0
        };
    }
    public static getDerivedStateFromProps(
        props: GraphTimeOverlayProps,
        state: GraphTimeOverlayState
    ): GraphTimeOverlayState {
        return {
            oldTime: state.newTime,
            newTime: props.time,
            oldNumber: state.newNumber,
            newNumber: props.number,
            olddifferentSignature: state.newdifferentSignature,
            newdifferentSignature: props.differentSignature
        };
    }
    public render(): JSX.Element {
        const style = {
            ...this.props.style
        };
        return (
            <div className="highlight-number-on-graph" style={style}>
                <div className="line1">
                    <span className="number">
                        <CountUp
                            start={(this.state.oldTime / 1000).toFixed(2)}
                            end={(this.state.newTime / 1000).toFixed(2)}
                        />
                    </span>
                    <span className="unit">sec</span>
                </div>
                <div className="line2">
                    <span className="number">
                        <CountUp start={this.state.olddifferentSignature} end={this.state.newdifferentSignature} />
                    </span>
                    <span className="unit" title="signatures changed in all the request for this URL">signatures</span>
                    <span className="separator">/</span>
                    <span className="number">
                        <CountUp start={this.state.oldNumber} end={this.state.newNumber} />
                    </span>
                    <span className="unit" title="HTTP requests for this URL">requests</span>
                </div>
            </div>
        );
    }
}
