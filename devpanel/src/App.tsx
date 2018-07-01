import * as React from "react";
import "./App.css";
import logo from "./logo.svg";
import { DataAction, DataSource, Message } from "./Model";

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
    console.log(process.env.REACT_APP_RUNENV);
    if (process.env.REACT_APP_RUNENV === "web") {
      // Testing in the browser
      this.state = {
        listMessages: [
          { id: "", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch } },
          { id: "", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Fetch } },
          { id: "", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Fetch } },
          { id: "", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Use } },
          { id: "", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Save } },
          { id: "", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch } },
          { id: "", payload: { id: "http://url2", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest } },
          { id: "", payload: { id: "http://url3", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest } },
        ]
      };
    } else {
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
