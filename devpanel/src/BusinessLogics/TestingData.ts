import * as moment from "moment";
import * as uuidv4 from "uuid/v4";
import { DataAction, DataSource, FetchType, HttpMethod, MessageClient, Statistics } from "./Model";
// tslint:disable:max-line-length
export class TestingData {
    public getListMessages(): MessageClient[] {
        return [
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.MemoryCache,
                    action: DataAction.Fetch,
                    performanceInsight: {
                        fetch: { startMs: 333, stopMs: 1003, elapsedMs: 700 },
                        httpRequest: { startMs: 333, stopMs: 1000, elapsedMs: 700 }
                    },
                    dataSignature: "SignatureUrl1",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.POST,
                    dataAgeMs: 0
                },
                incomingDateTime: moment("2018-07-01 21:30:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id:
                        "***ID***http://longurl/?ipType=ipv4&start=0&limit=250&sortField=prefix&sortOrder=asc__00000000-0000-0000-0000-0cc47a6c74de_00000000-0000-0000-0000-0cc47a6c6d6c_00000000-0000-0000-0000-0cc47a6c6a54_00000000-0000-0000-0000-0cc47a6c87ca_00000000-0000-0000-0000-0cc47a69945c_00000000-0000-0000-0000-0cc47a69944e_00000000-0000-0000-0000-0cc47a6c87d8_00000000-0000-0000-0000-0cc47a6b184e_00000000-0000-0000-0000-0cc47a69a1a2_00000000-0000-0000-0000-0cc47a6b1738_00000000-0000-0000-0000-0cc47a6c87d4_00000000-0000-0000-0000-0cc47a6c87a2_00000000-0000-0000-0000-0cc47a699424_00000000-0000-0000-0000-0cc47a69a1a0_00000000-0000-0000-0000-0cc47a6c87dc_00000000-0000-0000-0000-0cc47a6b1736_00000000-0000-0000-0000-0cc47a6c87d0_00000000-0000-0000-0000-0cc47a6c87da_00000000-0000-0000-0000-0cc47a6b17ca_00000000-0000-0000-0000-0cc47a6c702e_00000000-0000-0000-0000-0cc47a6c6db4_00000000-0000-0000-0000-0cc47a6a1aae_00000000-0000-0000-0000-0cc47a6c7468_00000000-0000-0000-0000-0cc47a6c74e8_00000000-0000-0000-0000-0cc47a6c6ce6_00000000-0000-0000-0000-0cc47aa921be_00000000-0000-0000-0000-0cc47a699164_00000000-0000-0000-0000-0cc47a6c7d82_00000000-0000-0000-0000-0cc47aa9221a_00000000-0000-0000-0000-0cc47a6c7900_00000000-0000-0000-0000-0cc47aa91b2e_00000000-0000-0000-0000-0cc47aa921d2_00000000-0000-0000-0000-0cc47aa921c2_00000000-0000-0000-0000-0cc47aa92152_00000000-0000-0000-0000-0cc47aa921cc_00000000-0000-0000-0000-0cc47aa92256_00000000-0000-0000-0000-0cc47a6c3960_00000000-0000-0000-0000-0cc47a6c6a5c_00000000-0000-0000-0000-0cc47a6d1068_00000000-0000-0000-0000-0cc47a6c71cc_00000000-0000-0000-0000-0cc47a6c7520_00000000-0000-0000-0000-0cc47aa97ea6_00000000-0000-0000-0000-0cc47aa97f16_00000000-0000-0000-0000-0cc47aa91ca4_00000000-0000-0000-0000-0cc47aa91ca0_00000000-0000-0000-0000-0cc47aa97ef4_00000000-0000-0000-0000-0cc47aa97e6e_00000000-0000-0000-0000-0cc47aa97eae_00000000-0000-0000-0000-0cc47aa97eb4_00000000-0000-0000-0000-0cc47a6c6cea_00000000-0000-0000-0000-0cc47a6c7466_00000000-0000-0000-0000-0cc47a6c6ad2_00000000-0000-0000-0000-0cc47aa97f50_00000000-0000-0000-0000-0cc47aa97e78_00000000-0000-0000-0000-0cc47aa98034_00000000-0000-0000-0000-0cc47aa92052_00000000-0000-0000-0000-0cc47aa97e60_00000000-0000-0000-0000-0cc47aa98032_00000000-0000-0000-0000-0cc47a6bc9a4_00000000-0000-0000-0000-0cc47aa9215a_00000000-0000-0000-0000-0cc47aa97e72_00000000-0000-0000-0000-0cc47a6c6cee_00000000-0000-0000-0000-0cc47a6c7516_00000000-0000-0000-0000-0cc47a6c74a8_00000000-0000-0000-0000-0cc47a6c71ca_00000000-0000-0000-0000-0cc47aa87dd8_00000000-0000-0000-0000-0cc47a6c6cd2_00000000-0000-0000-0000-0cc47a6d0f14_00000000-0000-0000-0000-0cc47a6c6f9e_00000000-0000-0000-0000-0cc47a6c9c14_00000000-0000-0000-0000-0cc47a6bcc62_00000000-0000-0000-0000-0cc47aa92260_00000000-0000-0000-0000-0cc47aa99588_00000000-0000-0000-0000-0cc47aa97ecc_00000000-0000-0000-0000-0cc47aa97e54_00000000-0000-0000-0000-0cc47aa9220c_00000000-0000-0000-0000-0cc47aa97e74_00000000-0000-0000-0000-0cc47aa97ce6_00000000-0000-0000-0000-0cc47aa99586_00000000-0000-0000-0000-0cc47aa97e62_00000000-0000-0000-0000-",
                    url:
                        "http://longurl/?ipType=ipv4&start=0&limit=250&sortField=prefix&sortOrder=asc__00000000-0000-0000-0000-0cc47a6c74de_00000000-0000-0000-0000-0cc47a6c6d6c_00000000-0000-0000-0000-0cc47a6c6a54_00000000-0000-0000-0000-0cc47a6c87ca_00000000-0000-0000-0000-0cc47a69945c_00000000-0000-0000-0000-0cc47a69944e_00000000-0000-0000-0000-0cc47a6c87d8_00000000-0000-0000-0000-0cc47a6b184e_00000000-0000-0000-0000-0cc47a69a1a2_00000000-0000-0000-0000-0cc47a6b1738_00000000-0000-0000-0000-0cc47a6c87d4_00000000-0000-0000-0000-0cc47a6c87a2_00000000-0000-0000-0000-0cc47a699424_00000000-0000-0000-0000-0cc47a69a1a0_00000000-0000-0000-0000-0cc47a6c87dc_00000000-0000-0000-0000-0cc47a6b1736_00000000-0000-0000-0000-0cc47a6c87d0_00000000-0000-0000-0000-0cc47a6c87da_00000000-0000-0000-0000-0cc47a6b17ca_00000000-0000-0000-0000-0cc47a6c702e_00000000-0000-0000-0000-0cc47a6c6db4_00000000-0000-0000-0000-0cc47a6a1aae_00000000-0000-0000-0000-0cc47a6c7468_00000000-0000-0000-0000-0cc47a6c74e8_00000000-0000-0000-0000-0cc47a6c6ce6_00000000-0000-0000-0000-0cc47aa921be_00000000-0000-0000-0000-0cc47a699164_00000000-0000-0000-0000-0cc47a6c7d82_00000000-0000-0000-0000-0cc47aa9221a_00000000-0000-0000-0000-0cc47a6c7900_00000000-0000-0000-0000-0cc47aa91b2e_00000000-0000-0000-0000-0cc47aa921d2_00000000-0000-0000-0000-0cc47aa921c2_00000000-0000-0000-0000-0cc47aa92152_00000000-0000-0000-0000-0cc47aa921cc_00000000-0000-0000-0000-0cc47aa92256_00000000-0000-0000-0000-0cc47a6c3960_00000000-0000-0000-0000-0cc47a6c6a5c_00000000-0000-0000-0000-0cc47a6d1068_00000000-0000-0000-0000-0cc47a6c71cc_00000000-0000-0000-0000-0cc47a6c7520_00000000-0000-0000-0000-0cc47aa97ea6_00000000-0000-0000-0000-0cc47aa97f16_00000000-0000-0000-0000-0cc47aa91ca4_00000000-0000-0000-0000-0cc47aa91ca0_00000000-0000-0000-0000-0cc47aa97ef4_00000000-0000-0000-0000-0cc47aa97e6e_00000000-0000-0000-0000-0cc47aa97eae_00000000-0000-0000-0000-0cc47aa97eb4_00000000-0000-0000-0000-0cc47a6c6cea_00000000-0000-0000-0000-0cc47a6c7466_00000000-0000-0000-0000-0cc47a6c6ad2_00000000-0000-0000-0000-0cc47aa97f50_00000000-0000-0000-0000-0cc47aa97e78_00000000-0000-0000-0000-0cc47aa98034_00000000-0000-0000-0000-0cc47aa92052_00000000-0000-0000-0000-0cc47aa97e60_00000000-0000-0000-0000-0cc47aa98032_00000000-0000-0000-0000-0cc47a6bc9a4_00000000-0000-0000-0000-0cc47aa9215a_00000000-0000-0000-0000-0cc47aa97e72_00000000-0000-0000-0000-0cc47a6c6cee_00000000-0000-0000-0000-0cc47a6c7516_00000000-0000-0000-0000-0cc47a6c74a8_00000000-0000-0000-0000-0cc47a6c71ca_00000000-0000-0000-0000-0cc47aa87dd8_00000000-0000-0000-0000-0cc47a6c6cd2_00000000-0000-0000-0000-0cc47a6d0f14_00000000-0000-0000-0000-0cc47a6c6f9e_00000000-0000-0000-0000-0cc47a6c9c14_00000000-0000-0000-0000-0cc47a6bcc62_00000000-0000-0000-0000-0cc47aa92260_00000000-0000-0000-0000-0cc47aa99588_00000000-0000-0000-0000-0cc47aa97ecc_00000000-0000-0000-0000-0cc47aa97e54_00000000-0000-0000-0000-0cc47aa9220c_00000000-0000-0000-0000-0cc47aa97e74_00000000-0000-0000-0000-0cc47aa97ce6_00000000-0000-0000-0000-0cc47aa99586_00000000-0000-0000-0000-0cc47aa97e62_00000000-0000-0000-0000-",
                    source: DataSource.PersistentStorageCache,
                    action: DataAction.Fetch,
                    performanceInsight: {
                        httpRequest: { startMs: 2, stopMs: 56, elapsedMs: 50 },
                        fetch: { startMs: 0, stopMs: 60, elapsedMs: 60 }
                    },
                    dataSignature: "SignatureUrlLong",
                    fetchType: FetchType.Fresh,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 1000
                },
                incomingDateTime: moment("2018-07-01 21:31:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogError",
                    id: "***ID***http://error",
                    url: "http://error",
                    source: DataSource.HttpRequest,
                    action: DataAction.Fetch,
                    error: "",
                    fetchType: FetchType.Web,
                    httpMethod: HttpMethod.PUT
                },
                incomingDateTime: moment("2018-07-01 21:31:10").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.HttpRequest,
                    action: DataAction.Fetch,
                    performanceInsight: {
                        httpRequest: { startMs: 0, stopMs: 2500, elapsedMs: 2500 },
                        fetch: { startMs: 0, stopMs: 2800, elapsedMs: 2800 },
                        dataSizeInBytes: 12312
                    },
                    dataSignature: "SignatureUrl1",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.DELETE,
                    dataAgeMs: undefined
                },
                incomingDateTime: moment("2018-07-01 21:32:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.HttpRequest,
                    action: DataAction.Use,
                    performanceInsight: { fetch: { startMs: 0, stopMs: 2800, elapsedMs: 2800 }, dataSizeInBytes: 12345 },
                    dataSignature: "SignatureUrl1_v2",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 41000
                },
                incomingDateTime: moment("2018-07-01 21:35:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url2",
                    url: "http://url2",
                    source: DataSource.HttpRequest,
                    action: DataAction.Use,
                    performanceInsight: { fetch: { startMs: 0, stopMs: 2300, elapsedMs: 2300 }, dataSizeInBytes: 12345 },
                    dataSignature: "SignatureUrl2",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 55000
                },
                incomingDateTime: moment("2018-07-01 21:35:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.HttpRequest,
                    action: DataAction.Use,
                    performanceInsight: { fetch: { startMs: 500, stopMs: 45000, elapsedMs: 44500 }, dataSizeInBytes: 50345 },
                    dataSignature: "SignatureUrl1_v3",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 12312
                },
                incomingDateTime: moment("2018-07-01 21:35:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.PersistentStorageCache,
                    action: DataAction.Save,
                    dataSignature: "SignatureUrl1_v3",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 4000
                },
                incomingDateTime: moment("2018-07-01 21:35:45").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url1",
                    url: "http://url1",
                    source: DataSource.MemoryCache,
                    action: DataAction.Fetch,
                    dataSignature: "SignatureUrl1_v4",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 4000
                },
                incomingDateTime: moment("2018-07-01 21:38:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url2",
                    url: "http://url2",
                    source: DataSource.MemoryCache,
                    action: DataAction.AddFromOnGoingRequest,
                    dataSignature: "SignatureUrl2_v2",
                    fetchType: FetchType.Fast,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 55000
                },
                incomingDateTime: moment("2018-07-01 21:39:00").toISOString(),
                uuid: uuidv4()
            },
            {
                id: "",
                source: "dataaccessgateway-agent",
                payload: {
                    kind: "LogInfo",
                    id: "***ID***http://url3",
                    url: "http://url3",
                    source: DataSource.MemoryCache,
                    action: DataAction.AddFromOnGoingRequest,
                    dataSignature: "SignatureUrl1",
                    fetchType: FetchType.Web,
                    httpMethod: HttpMethod.GET,
                    dataAgeMs: 2000
                },
                incomingDateTime: moment("2018-07-01 21:39:10").toISOString(),
                uuid: uuidv4()
            }
        ];
    }

    public getStatistics(): Statistics {
        return {
            bytesInCacheRate: 0.23,
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
            fetchMs: {
                persistentStorageRequestsMs: [1, 2, 3, 4, 5, 20, 50, 80, 90, 99, 100],
                memoryRequestsMs: [100, 50, 200, 125],
                httpRequestsMs: [150, 4000, 6000]
            },
            httpDeleteCount: 12,
            httpGetCount: 1231,
            httpPostCount: 333,
            httpPutCount: 0,
            dateAgeMs: [
                50000,
                65000,
                34000,
                123123000,
                56777,
                43333,
                678999,
                123123,
                500000,
                2500330,
                500600,
                0,
                0,
                60000,
                345000
            ],
            aggregateFetchType: {
                [FetchType.Fast]: 100,
                [FetchType.Fresh]: 312,
                [FetchType.Web]: 2,
                [FetchType.Execute]: 23,
                [FetchType.FastAndFresh]: 123,
                [FetchType.FastAndFreshObject]: 47
            }
        };
    }
}
