// Copyright (c) Microsoft. All rights reserved.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Constants } from '../../../Constants';
import { AlertType } from '../../../libs/models/AlertType';
import { TokenUsage } from '../../../libs/models/TokenUsage';
import { ActiveUserInfo, Alert, AppState, FeatureKeys, initialState } from './AppState';

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAlerts: (state: AppState, action: PayloadAction<Alert[]>) => {
            state.alerts = action.payload;
        },
        addAlert: (state: AppState, action: PayloadAction<Alert>) => {
            if (state.alerts.length === 3) {
                state.alerts.shift();
            }
            state.alerts.push(action.payload);
        },
        removeAlert: (state: AppState, action: PayloadAction<number>) => {
            state.alerts.splice(action.payload, 1);
        },
        setActiveUserInfo: (state: AppState, action: PayloadAction<ActiveUserInfo>) => {
            state.activeUserInfo = action.payload;
        },
        updateTokenUsage: (state: AppState, action: PayloadAction<TokenUsage>) => {
            Object.entries(action.payload).forEach(([key, value]) => {
                action.payload[key] = getTotalTokenUsage(state.tokenUsage[key], value);
            });
            state.tokenUsage = action.payload;
        },
        // This sets the feature flag based on end user input
        toggleFeatureFlag: (state: AppState, action: PayloadAction<FeatureKeys>) => {
            const feature = state.features[action.payload];
            state.features = {
                ...state.features,
                [action.payload]: {
                    ...feature,
                    enabled: !feature.enabled,
                },
            };
        },
        // This controls feature availability based on the state of backend
        toggleFeatureState: (
            state: AppState,
            action: PayloadAction<{
                feature: FeatureKeys;
                deactivate: boolean;
                enable: boolean;
            }>,
        ) => {
            const feature = state.features[action.payload.feature];
            state.features = {
                ...state.features,
                [action.payload.feature]: {
                    ...feature,
                    enabled: action.payload.deactivate ? false : action.payload.enable,
                    inactive: action.payload.deactivate,
                },
            };
        },
        setMemoriesStoreType: (state: AppState, action: PayloadAction<string>) => {
            const storeType = action.payload;
            if (storeType in Constants.MemoriesStoreTypes) {
                state.memoriesStoreType = action.payload;
            } else {
                state.memoriesStoreType = Constants.MemoriesStoreTypes.Unknown;

                const supportedStoreTypes = Object.values(Constants.MemoriesStoreTypes).join(', ');
                const errorMessage = `Unknown memory store type: ${storeType}. Supported types are: ${supportedStoreTypes}.`;
                appSlice.caseReducers.addAlert(state, {
                    type: 'addAlert',
                    payload: { message: errorMessage, type: AlertType.Error },
                });
            }
        },
    },
});

export const {
    addAlert,
    removeAlert,
    setAlerts,
    setActiveUserInfo,
    toggleFeatureFlag,
    toggleFeatureState,
    updateTokenUsage,
    setMemoriesStoreType,
} = appSlice.actions;

export default appSlice.reducer;

const getTotalTokenUsage = (previousSum?: number, current?: number) => {
    if (previousSum === undefined) {
        return current;
    }
    if (current === undefined) {
        return previousSum;
    }

    return previousSum + current;
};
