import * as React from "react";
import "./App.css";
import { ConsoleMessages } from "./ConsoleMessages";
import { Graph } from "./Graph";
import { DataAction, DataSource, Message, Statistics, MessageClient } from "./Model";
import { Summary } from "./Summary";
import * as moment from "moment";
interface AppState {
  listMessages: MessageClient[];
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
          { id: "", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Use }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Save }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url2", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", payload: { id: "http://url3", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest }, incomingDateTime: moment("2018-07-01 21:30:00") },
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
        currentMessages.unshift({ ...message, incomingDateTime: moment() });
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
        <Summary statistics={this.state.statistics} />
        <Graph statistics={this.state.statistics} />
        <ConsoleMessages listMessages={this.state.listMessages} />
      </div>
    );
  }
}

export default App;
