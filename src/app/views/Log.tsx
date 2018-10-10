import * as m from 'mithril';
import LogModel from '../models/Log';
import Spinner from '../components/Spinner';
import QuillViewer from '../components/QuillViewer';
import { format } from 'date-fns';

export default class Log implements m.Component {
    private id: number;
    private isLoading: boolean;

    constructor(vnode: any) {
        this.id = vnode.attrs.id;
        this.isLoading = true;
    }

    oninit() {
        LogModel.fetchOne(this.id).then(() => this.isLoading = false);
    }

    view() {
        return (
            <div className="container">
                <Spinner isLoading={this.isLoading}>
                    <div class="row">
                        <div class="col-md-12 mx-auto">
                            <div class="card shadow-sm bg-light">
                                <div class="card-header">
                                    Log
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h5 class="card-title">{LogModel.current.title}</h5>
                                        </div>
                                        <div class="col-md-6">
                                            <dl class="row">
                                                <dt class="col-sm-6">Log id</dt>
                                                <dd class="col-sm-6">{LogModel.current.logId}</dd>

                                                <dt class="col-sm-6">Subtype:</dt>
                                                <dd class="col-sm-6">
                                                    {LogModel.current.subtype === 'run' ?
                                                        <span class="badge badge-warning">{LogModel.current.subtype}</span>
                                                        : LogModel.current.subtype}
                                                </dd>

                                                <dt class="col-sm-6">Origin:</dt>
                                                <dd class="col-sm-6">
                                                    {LogModel.current.origin === 'human' ?
                                                        <span class="badge badge-success">{LogModel.current.origin}</span>
                                                        : LogModel.current.origin}
                                                </dd>

                                                <dt class="col-sm-6">Creation time:</dt>
                                                <dd class="col-sm-6">{format(LogModel.current.creationTime, 'HH:MM:SS MM/DD/YYYY')}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer log-footer">
                                    <QuillViewer id={LogModel.current.logId} content={LogModel.current.text} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Spinner>
            </div>
        );
    }
}
