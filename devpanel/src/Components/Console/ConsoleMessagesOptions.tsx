import React from "react";
import { ConsoleMessageOptionsModel, DataAction, DataSource, Sign } from "../../BusinessLogics/Model";

export interface ConsoleMessagesOptionsProps extends ConsoleMessageOptionsModel {
    isOpen: boolean;
    onChangeOptions: (consoleOptions: Partial<ConsoleMessageOptionsModel>) => void;
}

export class ConsoleMessagesOptions extends React.Component<ConsoleMessagesOptionsProps> {
    public constructor(props: ConsoleMessagesOptionsProps) {
        super(props);
    }
    public render(): JSX.Element | undefined {
        const classOptions =
            "console-options " + (this.props.isOpen ? "console-options-open" : "console-options-close");
        return (
            <div className={classOptions}>
                <div>
                    <label>Performance threshold:</label>
                    <select
                        onChange={e => this.onPerformanceThresholdSignChange(e)}
                        value={this.props.performance.sign}
                    >
                        <option value="gt">Greater</option>
                        <option value="lt">Smaller</option>
                    </select>
                    <input
                        type="textbox"
                        className="numericInput"
                        value={this.props.performance.value}
                        onChange={e => this.onPerformanceThresholdChange(e)}
                    />
                    <span className="unit">ms</span>
                </div>
                <div>
                    <label>Payload size threshold:</label>
                    <select onChange={e => this.onSizeThresholdSignChange(e)} value={this.props.size.sign}>
                        <option value="gt">Greater</option>
                        <option value="lt">Smaller</option>
                    </select>
                    <input
                        type="textbox"
                        className="numericInput"
                        value={this.props.size.value}
                        onChange={e => this.onSizeThresholdChange(e)}
                    />
                    <span className="unit">bytes</span>
                </div>
                <div>
                    <label>Action:</label>
                    <select onChange={e => this.onActionChange(e)} value={this.props.action}>
                        <option value="">None</option>
                        <option value={DataAction.AddFromOnGoingRequest}>AddFromOnGoingRequest</option>
                        <option value={DataAction.RemoveFromOnGoingRequest}>RemoveFromOnGoingRequest</option>
                        <option value={DataAction.WaitingOnGoingRequest}>WaitingOnGoingRequest</option>
                        <option value={DataAction.Delete}>Delete</option>
                        <option value={DataAction.Fetch}>Fetch</option>
                        <option value={DataAction.Save}>Save</option>
                        <option value={DataAction.System}>System</option>
                        <option value={DataAction.Use}>Use</option>
                    </select>
                </div>
                <div>
                    <label>Source:</label>
                    <select onChange={e => this.onSourceChange(e)} value={this.props.source}>
                        <option value="">None</option>
                        <option value={DataSource.HttpRequest}>HTTP</option>
                        <option value={DataSource.MemoryCache}>Memory</option>
                        <option value={DataSource.PersistentStorageCache}>Persistence</option>
                        <option value={DataSource.System}>System</option>
                    </select>
                </div>
                <div>
                    <label>Trim from URL:</label>
                    <input
                        type="textbox"
                        className="numericInput"
                        value={this.props.charTrimmedFromUrl}
                        onChange={e => this.onCharTrimmedFromUrlChange(e)}
                    />
                    <span className="unit">chars</span>
                </div>
            </div>
        );
    }

    private onCharTrimmedFromUrlChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        const valueTyped = value === "" ? 0 : isNaN(valueNumber) ? 0 : valueNumber;
        this.setState({
            charTrimmedFromUrl: valueTyped
        });
        this.props.onChangeOptions({
            charTrimmedFromUrl: valueTyped
        });
    }
    private onPerformanceThresholdSignChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.currentTarget.value as Sign;
        this.props.onChangeOptions({ performance: { value: this.props.performance.value, sign: value } });
    }
    private onPerformanceThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        const valueTyped = value === "" ? "" : isNaN(valueNumber) ? "" : valueNumber;
        this.props.onChangeOptions({ performance: { value: valueTyped, sign: this.props.performance.sign } });
    }
    private onSizeThresholdSignChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.currentTarget.value as Sign;
        this.props.onChangeOptions({ size: { value: this.props.size.value, sign: value } });
    }
    private onActionChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        let value = e.currentTarget.value as DataAction | undefined;
        if (e.currentTarget.value === "") {
            value = undefined;
        }
        this.props.onChangeOptions({ action: value });
    }
    private onSizeThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        const valueTyped = value === "" ? "" : isNaN(valueNumber) ? "" : valueNumber;
        this.props.onChangeOptions({ size: { value: valueTyped, sign: this.props.size.sign } });
    }
    private onSourceChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        let value = e.currentTarget.value as DataSource | undefined;
        if (e.currentTarget.value === "") {
            value = undefined;
        }
        this.props.onChangeOptions({ source: value });
    }
}
