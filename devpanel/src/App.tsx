import * as moment from "moment";
import * as React from "react";
import * as uuidv4 from "uuid/v4";
import "./App.css";
import { ILogics, Logics } from "./BusinessLogics/Logics";
import { FetchSignatureById, Message, MessageClient, Statistics } from "./BusinessLogics/Model";
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
    fetchSignatures: { [id: string]: FetchSignatureById };
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
    },
    fetchSignatures: {}
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
            const list = [
                ...testingData.getListMessages(),
                ...testingData.getListMessages(),
                ...testingData.getListMessages(),
                ...testingData.getListMessages(),
                ...testingData.getListMessages(),
                ...testingData.getListMessages(),
                ...testingData.getListMessages()
            ];
            // Testing in the browser
            this.state = {
                demoModeEnabled: false,
                listMessages: list,
                statistics: testingData.getStatistics(),
                fetchSignatures: {}
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
                    const newMessage = { ...message, incomingDateTime: moment().toISOString(), uuid: uuidv4() };
                    currentMessages.unshift(newMessage);
                    const adjustedStatistics = this.logics.adjustStatistics(newMessage, this.state.statistics);
                    const adjustedFetchFootprints = { ...this.state.fetchSignatures };

                    const resultFetchFootprint = this.logics.adjustFetchSignatures(
                        newMessage,
                        adjustedFetchFootprints[newMessage.payload.id]
                    );
                    if (resultFetchFootprint !== undefined) {
                        adjustedFetchFootprints[newMessage.payload.id] = resultFetchFootprint;
                    }
                    const newState: AppState = {
                        demoModeEnabled: this.state.demoModeEnabled,
                        listMessages: currentMessages,
                        statistics: adjustedStatistics,
                        fetchSignatures: adjustedFetchFootprints
                    };
                    this.setState(newState);
                }
            });
            chrome.devtools.panels.create("Data Access Gateway", "images/dagdl32.png", "index.html");
        }
    }
    public persistState(): void {
        const state = this.state;
        chrome.storage.local.set({ [SAVE_KEY]: state });
    }
    public loadState(): void {
        chrome.storage.local.get([SAVE_KEY], result => {
            if (result !== undefined && result[SAVE_KEY] !== undefined) {
                const state = result[SAVE_KEY] as AppState;
                this.setState(state);
            }
        });
    }

    public render() {
        return (
            <div className="App">
                <Summary statistics={this.state.statistics} />
                <Graph statistics={this.state.statistics} />
                <ConsoleMessages demoModeEnabled={this.state.demoModeEnabled} listMessages={this.state.listMessages} signatures={this.state.fetchSignatures} />
                <ActionsPanel
                    onReset={() => this.resetState()}
                    onLoad={() => this.loadState()}
                    onSave={() => this.persistState()}
                    onChangeDemoMode={(isDemoEnabled: boolean) => {
                        this.setState({ demoModeEnabled: isDemoEnabled });
                    }}
                />
            </div>
        );
    }

    public resetState(): void {
        this.setState({ ...AppStateDefaultValue });
    }
}

export default App;
