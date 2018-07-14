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
        aggregateSuccessFetchRate: 0,
        failedFetchFull: 0,
        successfulFetchFull: 0,
        httpBytes: 0,
        memoryBytes: 0,
        persistenceStorageBytes: 0
      }
    };
    console.log("RUNENV", process.env.REACT_APP_RUNENV);
    if (process.env.REACT_APP_RUNENV === "web") {
      // Testing in the browser
      this.state = {
        listMessages: [
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url1",
              source: DataSource.MemoryCache,
              action: DataAction.Fetch,
              performanceInsight:
              {
                fetch: { startMs: 333, stopMs: 1003 },
                httpRequest: { startMs: 333, stopMs: 1000 }
              }
            },
            incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://404",
              source: DataSource.PersistentStorageCache,
              action: DataAction.Fetch,
              performanceInsight: {
                httpRequest: { startMs: 2, stopMs: 56 },
                fetch: { startMs: 0, stopMs: 60 },
              }
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogError",
              id: "http://url1",
              source: DataSource.HttpRequest,
              action: DataAction.Fetch,
              error: "This is an error!!!"
            },
            incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url1",
              source: DataSource.HttpRequest,
              action: DataAction.Fetch,
              performanceInsight: { httpRequest: { startMs: 0, stopMs: 2500 }, fetch: { startMs: 0, stopMs: 2800 }, dataSizeInBytes: 12312 }
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url1",
              source: DataSource.HttpRequest,
              action: DataAction.Use,
              performanceInsight: { fetch: { startMs: 0, stopMs: 2800 } }
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url1",
              source: DataSource.PersistentStorageCache,
              action: DataAction.Save
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url1",
              source: DataSource.MemoryCache,
              action: DataAction.Fetch
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url2",
              source: DataSource.MemoryCache,
              action: DataAction.AddFromOnGoingRequest
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
          {
            id: "",
            source: "dataaccessgateway-agent",
            payload: {
              kind: "LogInfo",
              id: "http://url3",
              source: DataSource.MemoryCache,
              action: DataAction.AddFromOnGoingRequest
            }, incomingDateTime: moment("2018-07-01 21:30:00")
          },
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
          aggregateSuccessFetchRate: 0,
          failedFetchFull: 1,
          successfulFetchFull: 9,
          httpBytes: 12_312,
          memoryBytes: 243_325_133,
          persistenceStorageBytes: 883_324
        }
      };
      setTimeout(
        () => {
          requestAnimationFrame(() => {
            const message: MessageClient = {
              id: "",
              payload: { id: "http://url1", source: DataSource.HttpRequest, action: DataAction.AddFromOnGoingRequest, kind: "LogInfo" },
              incomingDateTime: moment(),
              source: "dataaccessgateway-agent",
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
    // Stastistic with LogInfo
    if (message.payload.kind === "LogInfo") {
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
        if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
          newStatistics.httpBytes += message.payload.performanceInsight.dataSizeInBytes;
        }
      }
      if (message.payload.action === DataAction.Use && message.payload.source === DataSource.MemoryCache) {
        newStatistics.useMemoryCount++;
        if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
          newStatistics.memoryBytes += message.payload.performanceInsight.dataSizeInBytes;
        }
      }
      if (message.payload.action === DataAction.Use && message.payload.source === DataSource.PersistentStorageCache) {
        newStatistics.usePersistentCount++;
        if (message.payload.performanceInsight !== undefined && message.payload.performanceInsight.dataSizeInBytes !== undefined) {
          newStatistics.persistenceStorageBytes += message.payload.performanceInsight.dataSizeInBytes;
        }
      }

      // Aggregate statistic
      const totalUse = newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount;
      newStatistics.aggregateUse = totalUse === 0 ? 0 : (newStatistics.useMemoryCount + newStatistics.usePersistentCount) / (newStatistics.useMemoryCount + newStatistics.usePersistentCount + newStatistics.useHttpCount);

      const totalRead = newStatistics.readHttpCount + newStatistics.readMemoryCount + newStatistics.readPersisentCount;
      const totalWrite = newStatistics.saveHttpCount + newStatistics.saveMemoryCount + newStatistics.savePersistentCount;
      newStatistics.aggregateRead = totalRead + totalWrite === 0 ? 0 : totalRead / (totalRead + totalWrite);

      newStatistics.aggregateMem = newStatistics.useMemoryCount + newStatistics.usePersistentCount === 0 ? 0 : newStatistics.useMemoryCount / (newStatistics.useMemoryCount + newStatistics.usePersistentCount);

      if (message.payload.action === DataAction.Use) {
        newStatistics.successfulFetchFull++;
      }
    }
    if (message.payload.kind === "LogError") {
      if (message.payload.action === DataAction.Use || message.payload.action === DataAction.Fetch) {
        newStatistics.failedFetchFull++;
      }
    }
    const totalFetch = newStatistics.successfulFetchFull + newStatistics.failedFetchFull;
    newStatistics.aggregateSuccessFetchRate = totalFetch === 0 ? 0 : newStatistics.successfulFetchFull / totalFetch;

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
