import React from "react";

export interface ActionsPanelProps {
    onReset: () => void;
    onLoad: () => void;
    onSave: () => void;
}

export class ActionsPanel extends React.Component<ActionsPanelProps> {
    public constructor(props: ActionsPanelProps) {
        super(props);
    }
    public render(): JSX.Element {
        return <div className="ActionsPanel">
            <button onClick={() => this.props.onReset()}>Reset</button>
            <button onClick={() => this.props.onLoad()}>Load</button>
            <button onClick={() => this.props.onSave()}>Save</button>
        </div>;
    }
}