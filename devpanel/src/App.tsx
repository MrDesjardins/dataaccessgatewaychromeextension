import * as moment from "moment";
import * as React from "react";
import { ActionsPanel } from "./ActionsPanel";
import "./App.css";
import { ConsoleMessages } from "./ConsoleMessages";
import { Graph } from "./Graph";
import { DataAction, DataSource, Message, MessageClient, Statistics } from "./Model";
import { Summary } from "./Summary";
interface AppState {
  listMessages: MessageClient[];
  statistics: Statistics;
}

const AppStateDefaultValue: AppState = {
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
    persistenceStorageBytes: 0,
    fetchMs: { persistentStorageRequestsMs: [], memoryRequestsMs: [], httpRequestsMs: [] }
  }
};
class App extends React.Component<{}, AppState> {
  private port: chrome.runtime.Port;

  public constructor(props: {}) {
    super(props);
    this.state = {
      ...AppStateDefaultValue
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
              // tslint:disable-next-line:max-line-length
              id: "http://longurl/?ipType=ipv4&start=0&limit=250&sortField=prefix&sortOrder=asc__00000000-0000-0000-0000-0cc47a6c74de_00000000-0000-0000-0000-0cc47a6c6d6c_00000000-0000-0000-0000-0cc47a6c6a54_00000000-0000-0000-0000-0cc47a6c87ca_00000000-0000-0000-0000-0cc47a69945c_00000000-0000-0000-0000-0cc47a69944e_00000000-0000-0000-0000-0cc47a6c87d8_00000000-0000-0000-0000-0cc47a6b184e_00000000-0000-0000-0000-0cc47a69a1a2_00000000-0000-0000-0000-0cc47a6b1738_00000000-0000-0000-0000-0cc47a6c87d4_00000000-0000-0000-0000-0cc47a6c87a2_00000000-0000-0000-0000-0cc47a699424_00000000-0000-0000-0000-0cc47a69a1a0_00000000-0000-0000-0000-0cc47a6c87dc_00000000-0000-0000-0000-0cc47a6b1736_00000000-0000-0000-0000-0cc47a6c87d0_00000000-0000-0000-0000-0cc47a6c87da_00000000-0000-0000-0000-0cc47a6b17ca_00000000-0000-0000-0000-0cc47a6c702e_00000000-0000-0000-0000-0cc47a6c6db4_00000000-0000-0000-0000-0cc47a6a1aae_00000000-0000-0000-0000-0cc47a6c7468_00000000-0000-0000-0000-0cc47a6c74e8_00000000-0000-0000-0000-0cc47a6c6ce6_00000000-0000-0000-0000-0cc47aa921be_00000000-0000-0000-0000-0cc47a699164_00000000-0000-0000-0000-0cc47a6c7d82_00000000-0000-0000-0000-0cc47aa9221a_00000000-0000-0000-0000-0cc47a6c7900_00000000-0000-0000-0000-0cc47aa91b2e_00000000-0000-0000-0000-0cc47aa921d2_00000000-0000-0000-0000-0cc47aa921c2_00000000-0000-0000-0000-0cc47aa92152_00000000-0000-0000-0000-0cc47aa921cc_00000000-0000-0000-0000-0cc47aa92256_00000000-0000-0000-0000-0cc47a6c3960_00000000-0000-0000-0000-0cc47a6c6a5c_00000000-0000-0000-0000-0cc47a6d1068_00000000-0000-0000-0000-0cc47a6c71cc_00000000-0000-0000-0000-0cc47a6c7520_00000000-0000-0000-0000-0cc47aa97ea6_00000000-0000-0000-0000-0cc47aa97f16_00000000-0000-0000-0000-0cc47aa91ca4_00000000-0000-0000-0000-0cc47aa91ca0_00000000-0000-0000-0000-0cc47aa97ef4_00000000-0000-0000-0000-0cc47aa97e6e_00000000-0000-0000-0000-0cc47aa97eae_00000000-0000-0000-0000-0cc47aa97eb4_00000000-0000-0000-0000-0cc47a6c6cea_00000000-0000-0000-0000-0cc47a6c7466_00000000-0000-0000-0000-0cc47a6c6ad2_00000000-0000-0000-0000-0cc47aa97f50_00000000-0000-0000-0000-0cc47aa97e78_00000000-0000-0000-0000-0cc47aa98034_00000000-0000-0000-0000-0cc47aa92052_00000000-0000-0000-0000-0cc47aa97e60_00000000-0000-0000-0000-0cc47aa98032_00000000-0000-0000-0000-0cc47a6bc9a4_00000000-0000-0000-0000-0cc47aa9215a_00000000-0000-0000-0000-0cc47aa97e72_00000000-0000-0000-0000-0cc47a6c6cee_00000000-0000-0000-0000-0cc47a6c7516_00000000-0000-0000-0000-0cc47a6c74a8_00000000-0000-0000-0000-0cc47a6c71ca_00000000-0000-0000-0000-0cc47aa87dd8_00000000-0000-0000-0000-0cc47a6c6cd2_00000000-0000-0000-0000-0cc47a6d0f14_00000000-0000-0000-0000-0cc47a6c6f9e_00000000-0000-0000-0000-0cc47a6c9c14_00000000-0000-0000-0000-0cc47a6bcc62_00000000-0000-0000-0000-0cc47aa92260_00000000-0000-0000-0000-0cc47aa99588_00000000-0000-0000-0000-0cc47aa97ecc_00000000-0000-0000-0000-0cc47aa97e54_00000000-0000-0000-0000-0cc47aa9220c_00000000-0000-0000-0000-0cc47aa97e74_00000000-0000-0000-0000-0cc47aa97ce6_00000000-0000-0000-0000-0cc47aa99586_00000000-0000-0000-0000-0cc47aa97e62_00000000-0000-0000-0000-",
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
              id: "http://error",
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
          persistenceStorageBytes: 883_324,
          fetchMs: { persistentStorageRequestsMs: [1, 2, 3, 4, 5, 20, 50, 80, 90, 99, 100], memoryRequestsMs: [100, 50, 200, 125], httpRequestsMs: [150, 4000, 6000] }
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
          const newState: AppState = { listMessages: currentMessages, statistics: adjustedStatistics };
          this.setState(newState);
        }
      });
      chrome.devtools.panels.create(
        "Data Access Gateway",
        "images/dagdl32.png",
        "index.html"
      );
    }
  }
  public persistState(): void {
    const state = this.state;
    console.log("Saving");
    chrome.storage.local.set({ state: state }, () => {
      console.log("Saved");
    });
  }
  public loadState(): void {
    console.log("Loading");
    chrome.storage.local.get(["state"], (result) => {
      console.log("Loaded", result);
      if (result !== undefined && result.state !== undefined) {
        this.setState(result.state);
      }
    });
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
      // Performance Percentile
      if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.HttpRequest) {
        if (message.payload.performanceInsight !== undefined
          && message.payload.performanceInsight.httpRequest !== undefined
          && message.payload.performanceInsight.httpRequest.stopMs !== undefined) {
          newStatistics.fetchMs.httpRequestsMs.push(message.payload.performanceInsight.httpRequest.stopMs - message.payload.performanceInsight.httpRequest.startMs);
        }
      }
      if (message.payload.action === DataAction.Fetch && message.payload.source === DataSource.PersistentStorageCache) {
        if (message.payload.performanceInsight !== undefined
          && message.payload.performanceInsight.persistentStorageCache !== undefined
          && message.payload.performanceInsight.persistentStorageCache.stopMs !== undefined) {
          newStatistics.fetchMs.persistentStorageRequestsMs.push(message.payload.performanceInsight.persistentStorageCache.stopMs - message.payload.performanceInsight.persistentStorageCache.startMs);
        }
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
        <ConsoleMessages demoMode={false} listMessages={this.state.listMessages} />
        <ActionsPanel
          onReset={() => this.resetState()}
          onLoad={() => this.loadState()}
          onSave={() => this.persistState()}
        />
      </div>
    );
  }

  public resetState(): void {
    this.setState({ ...AppStateDefaultValue });
  }
}

export default App;
