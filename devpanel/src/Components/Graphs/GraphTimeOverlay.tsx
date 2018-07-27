import * as React from "react";
import { CSSProperties } from "react";
import CountUp from "react-countup";
export interface GraphTimeOverlayProps {
    time: number;
    style: CSSProperties;
}

export interface GraphTimeOverlayState {
    oldTime: number;
    newTime: number;
}
export class GraphTimeOverlay extends React.Component<GraphTimeOverlayProps, GraphTimeOverlayState> {
    public constructor(props: GraphTimeOverlayProps) {
        super(props);
        this.state = {
            oldTime: 0,
            newTime: 0
        };
    }
    public static getDerivedStateFromProps(
        props: GraphTimeOverlayProps,
        state: GraphTimeOverlayState
    ): GraphTimeOverlayState {
        return {
            oldTime: state.newTime,
            newTime: props.time
        };
    }
    public render(): JSX.Element {
        const style = {
            ...this.props.style
        };
        return (
            <div className="highlight-number-on-graph" style={style}>
                <span className="number">
                    <CountUp
                        start={(this.state.oldTime / 1000).toFixed(2)}
                        end={(this.state.newTime / 1000).toFixed(2)}
                    />
                </span>
                <span className="unit">sec</span>
            </div>
        );
    }
}
