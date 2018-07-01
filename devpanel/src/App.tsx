import * as React from "react";
import "./App.css";
import { DataAction, DataSource, Message, Statistics } from "./Model";

interface AppState {
  listMessages: Message[];
  statistics: Statistics;
}
class App extends React.Component<{}, AppState> {
  private port: chrome.runtime.Port;
  public constructor(props: {}) {
    super(props);
    this.state = {
      listMessages: [],
      statistics: {
        onGoingRequestCount: 0,
        readHttpCount: 0,
        saveHttpCount: 0,
        useHttpCount: 0,
        readMemoryCount: 0,
        saveMemoryCount: 0,
        useMemoryCount: 0,
        readPersisentCount: 0,
        savePersistentCount: 0,
        usePersistentCount: 0,
      }
    };
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
        ],
        statistics: {
          onGoingRequestCount: 2,
          readHttpCount: 1,
          saveHttpCount: 1,
          useHttpCount: 1,
          readMemoryCount: 1,
          saveMemoryCount: 1,
          useMemoryCount: 0,
          readPersisentCount: 1,
          savePersistentCount: 1,
          usePersistentCount: 0,
        }
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
        const adjustedStatistics = this.adjustStatistics(message, this.state.statistics);
        this.setState({ listMessages: currentMessages, statistics: adjustedStatistics });
      });
      chrome.devtools.panels.create(
        "Data Access Gateway",
        "images/dagdl32.png",
        "index.html"
      );
    }
  }
  public adjustStatistics(message: Message, currentStatistics: Statistics): Statistics {
    const newStatistics = { ...currentStatistics };
    if (message.payload.action === DataAction.AddFromOnGoingRequest) {
      newStatistics.onGoingRequestCount++;
    }
    if (message.payload.action === DataAction.RemoveFromOnGoingRequest) {
      newStatistics.onGoingRequestCount--;
    }
    if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.HttpRequest) {
      newStatistics.readHttpCount++;
    }
    if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.MemoryCache) {
      newStatistics.readMemoryCount++;
    }
    if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.PersistentStorageCache) {
      newStatistics.readPersisentCount++;
    }
    if (message.payload.action === DataAction.Save && message.payload.source === DataSource.HttpRequest) {
      newStatistics.saveHttpCount++;
    }
    if (message.payload.action === DataAction.Save && message.payload.source === DataSource.MemoryCache) {
      newStatistics.saveMemoryCount++;
    }
    if (message.payload.action === DataAction.Save && message.payload.source === DataSource.PersistentStorageCache) {
      newStatistics.savePersistentCount++;
    }
    if (message.payload.action === DataAction.Use && message.payload.source === DataSource.HttpRequest) {
      newStatistics.useHttpCount++;
    }
    if (message.payload.action === DataAction.Use && message.payload.source === DataSource.MemoryCache) {
      newStatistics.useMemoryCount++;
    }
    if (message.payload.action === DataAction.Use && message.payload.source === DataSource.PersistentStorageCache) {
      newStatistics.usePersistentCount++;
    }
    return newStatistics;
  }
  public render() {
    return (
      <div className="App">
        <div className="Header">
          On-going Request: {this.state.statistics.onGoingRequestCount}
        </div>
        <div className="Graph">
          Graph here
        </div>
        <ul className="Console">
          {this.state.listMessages.map((m: Message, i: number) => <li key={i}>{m.payload.id + "," + m.payload.action + "," + m.payload.source}</li>)}
        </ul>
      </div>
    );
  }
}

export default App;
