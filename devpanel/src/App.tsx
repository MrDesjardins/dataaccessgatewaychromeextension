import * as moment from "moment";
import * as React from "react";
import * as uuidv4 from "uuid/v4";
import "./App.css";
import { ILogics, Logics } from "./BusinessLogics/Logics";
import { FetchSignatureById, FetchType, Message, MessageClient, Statistics } from "./BusinessLogics/Model";
import { TestingData } from "./BusinessLogics/TestingData";
import { ActionsPanel } from "./Components/ActionsPanel/ActionsPanel";
import { ConsoleMessages } from "./Components/Console/ConsoleMessages";
import { Graph } from "./Components/Graphs/Graph";
import { Main } from "./Components/Main/Main";
import { Summary } from "./Components/Summary/Summary";
const SAVE_KEY = "state";
interface AppState {
    demoModeEnabled: boolean;
    signatureModeEnabled: boolean;
    listMessages: MessageClient[];
    statistics: Statistics;
    fetchSignatures: { [id: string]: FetchSignatureById };
}

const AppStateDefaultValue: AppState = {
    demoModeEnabled: false,
    signatureModeEnabled: false,
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
        bytesInCacheRate: 0,
        httpDeleteCount: 0,
        httpGetCount: 0,
        httpPostCount: 0,
        httpPutCount: 0,
        dateAgeMs: [],
        aggregateFetchType: {
            [FetchType.Fast]: 0,
            [FetchType.Fresh]: 0,
            [FetchType.Web]: 0,
            [FetchType.Execute]: 0,
            [FetchType.FastAndFresh]: 0
        }
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
                signatureModeEnabled: false,
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
                    const adjustedFetchHttpSignatures = { ...this.state.fetchSignatures };

                    const resultFetchHttpSignatures = this.logics.adjustFetchHttpSignatures(
                        newMessage,
                        adjustedFetchHttpSignatures[newMessage.payload.id]
                    );
                    if (resultFetchHttpSignatures !== undefined) {
                        adjustedFetchHttpSignatures[newMessage.payload.id] = resultFetchHttpSignatures;
                    }
                    const newState: AppState = {
                        demoModeEnabled: this.state.demoModeEnabled,
                        signatureModeEnabled: this.state.signatureModeEnabled,
                        listMessages: currentMessages,
                        statistics: adjustedStatistics,
                        fetchSignatures: adjustedFetchHttpSignatures
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
                <Main
                    sections={[
                        <ConsoleMessages
                            key="console"
                            demoModeEnabled={this.state.demoModeEnabled}
                            listMessages={this.state.listMessages}
                            signatures={this.state.fetchSignatures}
                        />,
                        <Graph key="graph" statistics={this.state.statistics} />
                    ]}
                />
                <ActionsPanel
                    onReset={() => this.resetState()}
                    onLoad={() => this.loadState()}
                    onSave={() => this.persistState()}
                    onChangeDemoMode={(isDemoEnabled: boolean) => {
                        this.setState({ demoModeEnabled: isDemoEnabled });
                    }}
                    onChangeSignatureMode={(isDemoEnabled: boolean) => {
                        this.setState({ signatureModeEnabled: isDemoEnabled });
                        this.port.postMessage({
                            name: "action",
                            data: {
                                id: "signature",
                                value: isDemoEnabled
                            },
                            tabId: chrome.devtools.inspectedWindow.tabId
                        });
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
