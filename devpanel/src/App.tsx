import * as React from "react";
import "./App.css";
import logo from "./logo.svg";
export interface LogInfo {
  id: string;
  action: string;
  source: string;
}
export interface Message {
  id: string;
  payload: LogInfo;
}
interface AppState {
  listMessages: Message[];
}
class App extends React.Component<{}, AppState> {
  private port: chrome.runtime.Port;
  public constructor() {
    super({});
    this.state = {
      listMessages: []
    };
    this.port = chrome.runtime.connect({
      name: "panel"
    });

    this.port.postMessage({
      name: "init",
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    this.port.onMessage.addListener((message: Message) => {
      const currentMessages = this.state.listMessages.slice();
      currentMessages.push(message);
      this.setState({ listMessages: currentMessages });
    });
    chrome.devtools.panels.create(
      "Data Access Gateway",
      "images/dagdl32.png",
      "index.html"
    );
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul className="App-intro">
          {this.state.listMessages.map((m: Message, i: number) => <li key={i}>{m.payload.id + "," + m.payload.action + "," + m.payload.source}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
