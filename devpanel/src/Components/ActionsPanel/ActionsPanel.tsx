import React from "react";

export interface ActionsPanelProps {
    onReset: () => void;
    onLoad: () => void;
    onSave: () => void;
    onChangeDemoMode: (isDemoOn: boolean) => void;
    onChangeSignatureMode: (isDemoOn: boolean) => void;
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
            <span className="actionInput">
                <span>Demo:</span>
                <input
                    type="checkbox"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.props.onChangeDemoMode(event.target.checked)}
                />
            </span>
            <span className="actionInput" title="Signature are only for HttpRequest & Fetch">
                <span>Signature:</span>
                <input
                    type="checkbox"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.props.onChangeSignatureMode(event.target.checked)}
                />
            </span>
        </div>;
    }
}