/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../../types';
import { Log, LogCreate } from '../../../interfaces/Log';
import { ResponseObject, CollectionResponseObject } from '../../../interfaces/ResponseObject';

// State interface
export interface LogState {
    isFetchingLogs: boolean;
    isFetchingLog: boolean;
    isPatchingLinkRunToLog: boolean;
    isCreatingLog: boolean;
    logs: Log[];
    count: number;
    current: Log | null;
    logToBeCreated: LogCreate | null;
}

// Action types
export enum ActionTypes {
    FETCH_LOGS_REQUEST = 'jiskefet/log/FETCH_LOGS_LOG_REQUEST',
    FETCH_LOGS_SUCCESS = 'jiskefet/log/FETCH_LOGS_LOG_SUCCESS',
    FETCH_LOG_REQUEST = 'jiskefet/log/FETCH_LOG_REQUEST',
    FETCH_LOG_SUCCESS = 'jiskefet/log/FETCH_LOG_SUCCESS',
    LINK_RUN_TO_LOG_REQUEST = 'jiskefet/log/LINK_RUN_TO_LOG_REQUEST',
    LINK_RUN_TO_LOG_SUCCESS = 'jiskefet/log/LINK_RUN_TO_LOG_SUCCESS',
    CREATE_LOG_REQUEST = 'jiskefet/log/CREATE_LOG_REQUEST',
    CREATE_LOG_SUCCESS = 'jiskefet/log/CREATE_LOG_SUCCESS',
    SET_LOG_TO_BE_CREATED = 'jiskefet/log/SET_LOG_TO_BE_CREATED',
    CLEAR_LOG_TO_BE_CREATED = 'jiskefet/log/CLEAR_LOG_TO_BE_CREATED',
}

// Action interfaces
export interface FetchLogsByLogRequestAction extends Action {
    type: ActionTypes.FETCH_LOGS_REQUEST;
}

export interface FetchLogsByLogSuccessAction extends Action {
    type: ActionTypes.FETCH_LOGS_SUCCESS;
    payload: CollectionResponseObject<Log>;
}

export interface FetchLogRequestAction extends Action {
    type: ActionTypes.FETCH_LOG_REQUEST;
}

export interface FetchLogSuccessAction extends Action {
    type: ActionTypes.FETCH_LOG_SUCCESS;
    payload: ResponseObject<Log>;
}

export interface LinkLogToLogRequestAction extends Action {
    type: ActionTypes.LINK_RUN_TO_LOG_REQUEST;
}

export interface LinkLogToLogSuccesAction extends Action {
    type: ActionTypes.LINK_RUN_TO_LOG_SUCCESS;
}

export interface CreateLogRequestAction extends Action {
    type: ActionTypes.CREATE_LOG_REQUEST;
}

export interface CreateLogSuccessAction extends Action {
    type: ActionTypes.CREATE_LOG_SUCCESS;
}

export interface SetLogToBeCreatedAction extends Action {
    type: ActionTypes.SET_LOG_TO_BE_CREATED;
    payload: LogCreate;
}

export interface ClearLogToBeCreatedAction extends Action {
    type: ActionTypes.CLEAR_LOG_TO_BE_CREATED;
}

// Combine actions into single type
export type LogAction =
    | FetchLogsByLogRequestAction
    | FetchLogsByLogSuccessAction
    | FetchLogRequestAction
    | FetchLogSuccessAction
    | LinkLogToLogRequestAction
    | LinkLogToLogSuccesAction
    | CreateLogRequestAction
    | CreateLogSuccessAction
    | SetLogToBeCreatedAction
    | ClearLogToBeCreatedAction;

// Shorthand type for ThunkAction
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, LogAction>;
