import React from "react";
import { ConsoleOptions, Sign, Threshold } from "./Model";

export interface ConsoleMessagesOptionsProps {
    isOpen: boolean;
    performance: Threshold;
    size: Threshold;
    onChangeOptions: (consoleOptions: Partial<ConsoleOptions>) => void;
}

export interface ConsoleMessagesOptionsState {
    levenshteinThreshold: number | undefined;
}

export class ConsoleMessagesOptions extends React.Component<ConsoleMessagesOptionsProps, ConsoleMessagesOptionsState> {
    public constructor(props: ConsoleMessagesOptionsProps) {
        super(props);
        this.setState({ levenshteinThreshold: undefined });
    }
    public render(): JSX.Element | undefined {
        const classOptions = "console-options " + (this.props.isOpen ? "console-options-open" : "console-options-close");
        return <div className={classOptions}>
            <div>
                <label>Performance threshold:</label>
                <select onChange={(e) => this.onPerformanceThresholdSignChange(e)}>
                    <option value="gt" selected={this.props.performance.sign === "gt"}>Greater</option>
                    <option value="lt" selected={this.props.performance.sign === "lt"}>Smaller</option>
                </select>
                <input
                    type="textbox"
                    className="numericInput"
                    value={this.props.performance.value}
                    onChange={(e) => this.onPerformanceThresholdChange(e)}
                />
                <span className="unit">
                    ms
                    </span>
            </div>
            <div>
                <label>Payload size threshold:</label>
                <select onChange={(e) => this.onSizeThresholdSignChange(e)}>
                    <option value="gt" selected={this.props.size.sign === "gt"}>Greater</option>
                    <option value="lt" selected={this.props.size.sign === "lt"}>Smaller</option>
                </select>
                <input
                    type="textbox"
                    className="numericInput"
                    value={this.props.size.value}
                    onChange={(e) => this.onSizeThresholdChange(e)}
                />
                <span className="unit">
                    bytes
                    </span>
            </div>
        </div>;
    }
    private onPerformanceThresholdSignChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.currentTarget.value as Sign;
        this.props.onChangeOptions({ performance: { value: this.props.performance.value, sign: value } });
    }
    private onPerformanceThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        const valueTyped = value === "" ? "" : (isNaN(valueNumber) ? "" : valueNumber);
        this.props.onChangeOptions({ performance: { value: valueTyped, sign: this.props.performance.sign } });
    }
    private onSizeThresholdSignChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const value = e.currentTarget.value as Sign;
        this.props.onChangeOptions({ size: { value: this.props.size.value, sign: value } });
    }
    private onSizeThresholdChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.currentTarget.value;
        const valueNumber = Number(value);
        const valueTyped = value === "" ? "" : (isNaN(valueNumber) ? "" : valueNumber);
        this.props.onChangeOptions({ size: { value: valueTyped, sign: this.props.size.sign } });
    }
}