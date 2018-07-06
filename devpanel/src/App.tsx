import * as moment from "moment";
import * as React from "react";
import "./App.css";
import { ConsoleMessages } from "./ConsoleMessages";
import { Graph } from "./Graph";
import { DataAction, DataSource, Message, MessageClient, Statistics } from "./Model";
import { Summary } from "./Summary";
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
        aggregateUse: 0,
        aggregateRead: 0,
        aggregateMem: 0,
      }
    };
    console.log("RUNENV", process.env.REACT_APP_RUNENV);
    if (process.env.REACT_APP_RUNENV === "web") {
      // Testing in the browser
      this.state = {
        listMessages: [
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.Use }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.PersistentStorageCache, action: DataAction.Save }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url1", source: DataSource.MemoryCache, action: DataAction.Fetch }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url2", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest }, incomingDateTime: moment("2018-07-01 21:30:00") },
          { id: "", source: "dataaccessgateway-agent", payload: { id: "http://url3", source: DataSource.MemoryCache, action: DataAction.AddFromOnGoingRequest }, incomingDateTime: moment("2018-07-01 21:30:00") },
        ],
        statistics: {
          onGoingRequestCount: 2,
          readHttpCount: 31,
          saveHttpCount: 12,
          useHttpCount: 52,
          readMemoryCount: 1,
          saveMemoryCount: 1,
          useMemoryCount: 10,
          readPersisentCount: 1,
          savePersistentCount: 1,
          usePersistentCount: 62,
          aggregateUse: 0,
          aggregateRead: 0,
          aggregateMem: 0,
        }
      };
      setTimeout(
        () => {
          requestAnimationFrame(() => {
            const message = {
              id: "",
              payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.AddFromOnGoingRequest },
              incomingDateTime: moment(),
              source: "dataaccessgateway-agent"
            };
            const currentMessages = this.state.listMessages.slice();
            currentMessages.unshift({ ...message });
            const adjustedStatistics = this.adjustStatistics(message, this.state.statistics);
            this.setState({ listMessages: currentMessages, statistics: adjustedStatistics });
          });
        },
        1000);
    } else {
      this.port = chrome.runtime.connect({
        name: "panel"
      });

      this.port.postMessage({
        name: "init",
        tabId: chrome.devtools.inspectedWindow.tabId
      });
      this.port.onMessage.addListener((message: Message) => {
        if (message.source === "dataaccessgateway-agent") {
          const currentMessages = this.state.listMessages.slice();
          currentMessages.unshift({ ...message, incomingDateTime: moment() });
          const adjustedStatistics = this.adjustStatistics(message, this.state.statistics);
          this.setState({ listMessages: currentMessages, statistics: adjustedStatistics });
        }
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
    if (!message.payload) {
      console.warn("Payload was undefined. Here is the message:", message);
      return newStatistics;
    }
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

    // Aggregate statistic
    const totalUse = newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount;
    newStatistics.aggregateUse = totalUse === 0 ? 0 : (newStatistics.useMemoryCount + newStatistics.usePersistentCount) / (newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount);

    const totalRead = newStatistics.readHttpCount + newStatistics.readMemoryCount + newStatistics.readPersisentCount;
    const totalWrite = newStatistics.saveHttpCount + newStatistics.saveMemoryCount + newStatistics.savePersistentCount;
    newStatistics.aggregateRead = totalRead + totalWrite === 0 ? 0 : totalRead / (totalRead + totalWrite);

    newStatistics.aggregateMem = newStatistics.useMemoryCount + newStatistics.usePersistentCount === 0 ? 0 : newStatistics.useMemoryCount / (newStatistics.useMemoryCount + newStatistics.usePersistentCount);

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
