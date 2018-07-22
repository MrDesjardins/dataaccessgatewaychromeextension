import * as moment from "moment";
import * as React from "react";
import "./App.css";
import { ILogics, Logics } from "./BusinessLogics/Logics";
import { Message, MessageClient, Statistics } from "./BusinessLogics/Model";
import { TestingData } from "./BusinessLogics/TestingData";
import { ActionsPanel } from "./Components/ActionsPanel/ActionsPanel";
import { ConsoleMessages } from "./Components/Console/ConsoleMessages";
import { Graph } from "./Components/Graphs/Graph";
import { Summary } from "./Components/Summary/Summary";
const SAVE_KEY = "state";
interface AppState {
  demoModeEnabled: boolean;
  listMessages: MessageClient[];
  statistics: Statistics;
}

const AppStateDefaultValue: AppState = {
  demoModeEnabled: false,
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
    fetchMs: { persistentStorageRequestsMs: [], memoryRequestsMs: [], httpRequestsMs: [] },
    bytesInCacheRate: 0
  }
};
class App extends React.Component<{}, AppState> {
  private port: chrome.runtime.Port;
  private logics: ILogics = new Logics();

  public constructor(props: {}) {
    super(props);
    this.state = {
      ...AppStateDefaultValue
    };
    console.log("RUNENV", process.env.REACT_APP_RUNENV);
    if (process.env.REACT_APP_RUNENV === "web") {
      const testingData = new TestingData();
      // Testing in the browser
      this.state = {
        demoModeEnabled: false,
        listMessages: testingData.getListMessages(),
        statistics: testingData.getStatistics()
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
        if (message.source === "dataaccessgateway-agent") {
          const currentMessages = this.state.listMessages.slice();
          currentMessages.unshift({ ...message, incomingDateTime: moment().toISOString() });
          const adjustedStatistics = this.logics.adjustStatistics(message, this.state.statistics);
          const newState: AppState = { demoModeEnabled: this.state.demoModeEnabled, listMessages: currentMessages, statistics: adjustedStatistics };
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
    chrome.storage.local.set({ [SAVE_KEY]: state });
  }
  public loadState(): void {
    chrome.storage.local.get([SAVE_KEY], (result) => {
      if (result !== undefined && result[SAVE_KEY] !== undefined) {
        const state = result[SAVE_KEY] as AppState;
        this.setState(state);
      }
    });
  }

  public render() {
    return (
      <div className="App">
        <Summary
          statistics={this.state.statistics}
        />
        <Graph
          statistics={this.state.statistics}
        />
        <ConsoleMessages
          demoModeEnabled={this.state.demoModeEnabled}
          listMessages={this.state.listMessages}
        />
        <ActionsPanel
          onReset={() => this.resetState()}
          onLoad={() => this.loadState()}
          onSave={() => this.persistState()}
          onChangeDemoMode={(isDemoEnabled: boolean) => { this.setState({ demoModeEnabled: isDemoEnabled }); }}
        />
      </div>
    );
  }

  public resetState(): void {
    this.setState({ ...AppStateDefaultValue });
  }
}

export default App;
