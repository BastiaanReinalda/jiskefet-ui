/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import State from '../models/State';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import { Event } from '../interfaces/Event';
import Tabs from '../molecules/Tab';
import CreateLogTabs from '../constants/CreateLogTabs';
import Modal from '../atoms/Modal';
import MarkdownViewer from '../atoms/MarkdownViewer';
import MarkdownHelpText from '../constants/MarkdownHelpText';
import AttachmentComponent from '../atoms/Attachment';

interface Attrs {
    runNumber?: number;
}

type Vnode = m.Vnode<Attrs, CreateLog>;

export default class CreateLog extends MithrilTsxComponent<Attrs> {

    addToCreateLog = (event: Event) => {
        State.LogModel.createLog[event.target.id] = event.target.value;
    }

    addRunsToCreateLog = (event: Event) => {
        State.RunModel.fetchById(event.target.value).then(() => {
            State.LogModel.createLog.runs = new Array();
            State.LogModel.createLog.runs.push(State.RunModel.current);
        });
    }

    addDescription = (content: string) => {
        State.LogModel.createLog.text = content;
    }

    saveLog(runNumber: number | undefined) {
        if (runNumber) {
            State.LogModel.createLog.runs = new Array();
            State.LogModel.createLog.runs.push(State.RunModel.current);
        }
        if (State.AuthModel.profile !== null) {
            State.UserModel.fetchById(State.AuthModel.profile.userData.userId).then(() => {
                State.LogModel.createLog.user = State.UserModel.current;
                State.LogModel.save().then(() => {
                    m.route.set('/Logs');
                });
            });
        }
    }

    view(vnode: Vnode) {
        return (
            <form
                onsubmit={(event: Event) => {
                    event.preventDefault();
                    this.saveLog(vnode.attrs.runNumber);
                }}
            >
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12 mx-auto bg-light rounded p-4 shadow-sm">
                            <div>
                                <h3>
                                    {`Create a new log ${vnode.attrs.runNumber ?
                                        `for run number ${vnode.attrs.runNumber}` :
                                        ''}`}
                                </h3>
                            </div>
                            <div class="form-group">
                                <label for="title">Add a Title:</label>
                                <div class="field">
                                    <input
                                        id="title"
                                        type="text"
                                        class="form-control"
                                        placeholder="Title"
                                        required
                                        oninput={this.addToCreateLog}
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="subtype">Select Subtype:</label>
                                <div class="field">
                                    <select
                                        id="subtype"
                                        class="form-control"
                                        name="subtype"
                                        required
                                        onclick={this.addToCreateLog}
                                    >
                                        <option value="run">run</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="subtype">Run number:</label>
                                <div class="field">
                                    <input
                                        id="runs"
                                        type="number"
                                        class="form-control"
                                        placeholder="Run number"
                                        value={vnode.attrs.runNumber && vnode.attrs.runNumber}
                                        required
                                        oninput={this.addRunsToCreateLog}
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="card shadow-sm bg-light">
                                    <Tabs
                                        tabs={CreateLogTabs}
                                        entity={State.LogModel.createLog}
                                        func={(content: string) => this.addDescription(content)}
                                        caller={'description'}
                                    />
                                </div>
                            </div>
                            <AttachmentComponent
                                attachTo="Log"
                                hideImagePreview={true}
                                isExistingItem={false}
                            />
                            <br />
                            <button type="submit" class="btn btn-primary">Submit</button>
                            <button
                                type="button"
                                class="btn btn-info float-right"
                                data-toggle="modal"
                                data-target="#MarkdownHelpText"
                            >
                                Formatting help
                            </button>
                            <Modal id="MarkdownHelpText" title="Markdown help">
                                <MarkdownViewer id={'MarkdownHelpTextViewer'} content={MarkdownHelpText} />
                            </Modal>
                        </div>
                    </div>
                </div>
            </form >
        );
    }
}