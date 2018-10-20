import React from "react";
export interface MainProps {
    sections: JSX.Element[];
}
export interface MainState {
    activeSection: number;
}
export class Main extends React.Component<MainProps, MainState> {
    public constructor(props: MainProps) {
        super(props);
        this.state = {
            activeSection: 0
        };
    }
    public render(): JSX.Element {
        return (
            <div className="Main">
                <div className="Main-menu">
                    <span
                        className={"menu-button " + (this.state.activeSection === 0 ? "active-menu-button" : "")}
                        onClick={() => this.onClickMenu(0)}
                    >
                        Console
                    </span>
                    <span
                        className={"menu-button " + (this.state.activeSection === 1 ? "active-menu-button" : "")}
                        onClick={() => this.onClickMenu(1)}
                    >
                        Metric Graphs
                    </span>
                </div>
                <div className="Main-content">
                    {this.props.sections.map((comp, index) => {
                        if (index === this.state.activeSection) {
                            return comp;
                        }
                        return undefined;
                    })}
                </div>
            </div>
        );
    }

    public onClickMenu(index: number): void {
        this.setState({ activeSection: index });
    }
}
