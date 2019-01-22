/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import Spinner from '../atoms/Spinner';
import HttpErrorAlert from '../atoms/HttpErrorAlert';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import RunTabs from '../constants/RunTabs';
import Tabs from '../atoms/TabContainer';
import Modal from '../atoms/Modal';
import LinkLogToRun from '../atoms/LinkLogToRun';
import SuccessMessage from '../atoms/SuccessMessage';
import { formatDateField } from '../utility/DateUtil';
import { store } from '../redux/configureStore';
import { fetchRun } from '../redux/ducks/run/operations';
import { selectIsFetchingRun, selectIsPatchingLinkLogToRun, selectCurrentRun } from '../redux/ducks/run/selectors';

import Card from '../atoms/Card';

interface Attrs {
    runNumber: number;
}

type Vnode = m.Vnode<Attrs, Run>;
type VnodeDOM = m.VnodeDOM<Attrs, Run>;

export default class Run extends MithrilTsxComponent<Attrs> {
    oninit(vnode: VnodeDOM) {
        store.dispatch(fetchRun(vnode.attrs.runNumber));
    }

    linkingButton(addExistingRunId: string, runNumber: number) {
        return (
            <div class="row justify-content-end">
                <button
                    type="button"
                    class="btn btn-success btn-sm mr-1"
                    onclick={() => m.route.set(
                        `/logs/create/runs/${runNumber}`
                    )}
                >
                    Add new log to run
                </button>
                <button
                    type="button"
                    class="btn btn-primary btn-sm mr-1"
                    data-toggle="modal"
                    data-target={`#${addExistingRunId}`}
                >
                    Link existing log
                </button>
            </div>
        );
    }

    view(vnode: Vnode) {
        const addExistingRunId = 'add-existing-run';
        const state = store.getState();
        const currentRun = selectCurrentRun(state);
        const isFetchingRun = selectIsFetchingRun(state);
        const isPatchingLinkLogToRun = selectIsPatchingLinkLogToRun(state);
        return (
            <div class="container-fluid">
                <Spinner
                    isLoading={isFetchingRun || isPatchingLinkLogToRun}
                >
                    <SuccessMessage />
                    <HttpErrorAlert>
                        <div class="row">
                            <div class="col-md-12 mx-auto">
                                <Card
                                    className={'shadow-sm bg-light'}
                                    headerTitle={'Run'}
                                    headerContent={
                                        this.linkingButton(addExistingRunId, vnode.attrs.runNumber)
                                    }
                                    footerContent={(
                                        <Tabs
                                            tabs={RunTabs}
                                            entity={currentRun || undefined}
                                        />
                                    )}
                                >
                                    <div class="row">
                                        <div class="col-md-6">
                                            <dl class="row">
                                                <dt class="col-sm-6">Run id</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.runNumber : ''}
                                                </dd>
                                                <dt class="col-sm-6">Time O&sup2; start</dt>
                                                <dd class="col-sm-6">
                                                    {formatDateField(currentRun ? currentRun.timeO2Start : '')}
                                                </dd>
                                                <dt class="col-sm-6">Time O&sup2; end</dt>
                                                <dd class="col-sm-6">
                                                    {formatDateField(currentRun ? currentRun.timeO2End : '')}
                                                </dd>
                                                <dt class="col-sm-6">Time TRG start</dt>
                                                <dd class="col-sm-6">
                                                    {formatDateField(currentRun ? currentRun.timeTrgStart : '')}
                                                </dd>
                                                <dt class="col-sm-6">Time TRG end</dt>
                                                <dd class="col-sm-6">
                                                    {formatDateField(currentRun ? currentRun.timeTrgEnd : '')}
                                                </dd>
                                                <dt class="col-sm-6">Run type</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.runType : ''}
                                                </dd>
                                                <dt class="col-sm-6">Run quality</dt>
                                                <dd class="col-sm-6">
                                                    <span class="badge badge-warning">
                                                        {currentRun ? currentRun.runQuality : ''}
                                                    </span>
                                                </dd>
                                            </dl>
                                        </div>
                                        <div class="col-md-6">
                                            <dl class="row">
                                                <dt class="col-sm-6">Number of detectors</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.nDetectors : ''}
                                                </dd>
                                                <dt class="col-sm-6">Number of FLP's</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.nFlps : ''}
                                                </dd>
                                                <dt class="col-sm-6">Number of EPN's</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.nEpns : ''}
                                                </dd>
                                                <dt class="col-sm-6">Number of timeframes</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.nTimeframes : ''}
                                                </dd>
                                                <dt class="col-sm-6">Number of sub-timeframes</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.nSubtimeframes : ''}
                                                </dd>
                                                <dt class="col-sm-6">Bytes read out</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.bytesReadOut : ''}
                                                </dd>
                                                <dt class="col-sm-6">Bytes timeframe builder</dt>
                                                <dd class="col-sm-6">
                                                    {currentRun ? currentRun.bytesTimeframeBuilder : ''}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </HttpErrorAlert >
                </Spinner >
                <Modal id={addExistingRunId} title="Link existing log">
                    <LinkLogToRun runNumber={vnode.attrs.runNumber} />
                </Modal>
            </div >
        );
    }
}