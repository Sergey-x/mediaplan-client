import { useEffect, useState } from "react";
import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";

export interface UseApiCallInterface<ResultDataType> {
    loading: boolean;
    error: boolean;
    success: boolean;
    default: boolean;
    data: ResultDataType;
    setData: (value: ResultDataType) => void;
    resetApiCallStatus: () => void;
}

export default function useApiCall<ResultDataType>(
    apiCall: () => Promise<ResultDataType>,
    defaultValue: ResultDataType,
    recallDeps: any[] = [],
    callCondition: boolean | undefined = undefined
): UseApiCallInterface<ResultDataType> {
    const [loadingStatus, setLoadingStatus] = useState<FetchStatusStrings>(FetchStatusEnum.FETCHING);
    const [data, setData] = useState<ResultDataType>(defaultValue);

    function resetApiCallStatus() {
        setLoadingStatus(FetchStatusEnum.IDLE);
    }

    useEffect(() => {
        if (callCondition === undefined || callCondition) {
            apiCall()
                .then((data: ResultDataType) => {
                    setData(data);
                    setLoadingStatus(FetchStatusEnum.SUCCESS);
                })
                .catch(() => {
                    setLoadingStatus(FetchStatusEnum.ERROR);
                })
                .finally(() => {});
        }
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [...recallDeps]);

    return {
        error: loadingStatus === FetchStatusEnum.ERROR,
        success: loadingStatus === FetchStatusEnum.SUCCESS,
        loading: loadingStatus === FetchStatusEnum.FETCHING,
        default: loadingStatus === FetchStatusEnum.IDLE,
        data,
        setData,
        resetApiCallStatus,
    };
}
