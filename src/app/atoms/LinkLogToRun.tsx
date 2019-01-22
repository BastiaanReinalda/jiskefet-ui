/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import * as _ from 'lodash';
import LinkLogToRunColumns from '../constants/LinkLogToRunColumns';
import { store } from '../redux/configureStore';
import { fetchLogs } from '../redux/ducks/log/operations';
import { linkLogToRun, fetchRun } from '../redux/ducks/run/operations';
import { selectUserLogs } from '../redux/ducks/user/selectors';
import Table from '../molecules/Table';

interface Attrs {
    /**
     * The run number of the run to be linked to a log.
     */
    runNumber: number;
}

type Vnode = m.Vnode<Attrs, LinkLogToRun>;

/**
 * Component enables linking logs to runs.
 */
export default class LinkLogToRun extends MithrilTsxComponent<Attrs> {
    oninit() {
        store.dispatch(fetchLogs());
    }

    /**
     * Link a log to a run by calling a PATCH api call.
     * Fetch the updated run afterwards.
     */
    linkLogToRun = (logId: number, runNumber: number) => {
        store.dispatch(linkLogToRun(logId, runNumber)).then(() =>
            store.dispatch(fetchRun(runNumber)).then(() =>
                m.redraw()
            )
        );
    }

    view(vnode: Vnode) {
        return (
            <div>
                <Table
                    data={selectUserLogs(store.getState())}
                    columns={LinkLogToRunColumns(vnode.attrs.runNumber, this.linkLogToRun)}
                />
            </div>
        );
    }
}