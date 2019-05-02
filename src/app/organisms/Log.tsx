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
import Modal from '../atoms/Modal';
import LinkRunToLog from '../atoms/LinkRunToLog';
import SuccessMessage from '../atoms/SuccessMessage';
import { store } from '../redux/configureStore';
import { fetchAttachmentsByLog } from '../redux/ducks/attachment/operations';
import { fetchLog } from '../redux/ducks/log/operations';
import { selectCurrentLog, selectIsFetchingLog, selectIsPatchingLinkRunToLog } from '../redux/ducks/log/selectors';
import Card from '../atoms/Card';
import DescriptionList from '../atoms/DescriptionList';
import LogDescription from '../constants/LogDescription';
import TabContainer from '../molecules/TabContainer';
import MarkdownViewer from '../atoms/MarkdownViewer';
import Table from '../molecules/Table';
import RunColumns from '../constants/RunColumns';
import { selectAttachments } from '../redux/ducks/attachment/selectors';
import { Attachment } from '../interfaces/Attachment';
import { download } from '../utility/FileUtil';
import AttachmentComponent from '../molecules/Attachment';
import { selectFetchingTags, selectTagsForLog, selectTags } from '../redux/ducks/tag/selectors';
import { Tag, TagCreate } from '../interfaces/Tag';
import Input from '../atoms/Input';
import FormGroup from '../molecules/FormGroup';
import Label from '../atoms/Label';
import Select from '../atoms/Select';
import { createTag } from '../redux/ducks/tag/operations';
import Button, { ButtonType, ButtonClass } from '../atoms/Button';

interface Attrs {
    logId: number;
}

type Vnode = m.Vnode<Attrs, Log>;

export default class Log extends MithrilTsxComponent<Attrs> {

    constructor(vnode: Vnode) {
        super();
        store.dispatch(fetchLog(vnode.attrs.logId));
        store.dispatch(fetchAttachmentsByLog(vnode.attrs.logId));
    }

    async handleSubmit(event: any): Promise<void> {
        const log = await selectCurrentLog(store.getState()) as Log | null;
        const tagId = event.target.tag.value;
        const newTag = event.target.tagText.value;
        if (log && tagId) {
            // add existing tag to Log
            // store.dispatch()
            event.target.reset(); // Clear the form.
        } else if (log && newTag) {
            // create new tag and add to Log
            const tagToCreate = {
                tagText: newTag
            };
            store.dispatch(createTag(tagToCreate as TagCreate));
            event.target.reset(); // Clear the form.
        }
    }

    view(vnode: Vnode) {
        const addExistingRunId = 'add-existing-run';
        const state = store.getState();
        const currentLog = selectCurrentLog(state);
        const isFetchingLog = selectIsFetchingLog(state);
        const isPatchingLinkRunToLog = selectIsPatchingLinkRunToLog(state);
        const attachments = selectAttachments(store.getState());
        const tagsForLog = selectTagsForLog(store.getState());
        const tags = selectTags(store.getState());

        return (
            <div class="container-fluid">
                <Spinner isLoading={isFetchingLog || isPatchingLinkRunToLog}>
                    <SuccessMessage />
                    <HttpErrorAlert>
                        <SuccessMessage />
                        <div class="row">
                            <div class="col-md-12 mx-auto">
                                <Card
                                    className={'shadow-sm bg-light'}
                                    headerTitle={'Log'}
                                    headerContent={
                                        <Modal
                                            id={addExistingRunId}
                                            title="Link to run"
                                            buttonClass="btn btn-primary"
                                        >
                                            <LinkRunToLog logId={vnode.attrs.logId} />
                                        </Modal>}
                                    footerContent={(
                                        <TabContainer titles={['Content', 'Runs', 'Files', 'Tags']} >
                                            {
                                                currentLog && currentLog.body
                                                    ? <MarkdownViewer
                                                        id={'CreateLogMarkdown'}
                                                        content={currentLog.body}
                                                    />
                                                    : 'This log has no text'
                                            }
                                            {
                                                currentLog && currentLog.runs && currentLog.runs.length > 0
                                                    ? (
                                                        <Table
                                                            data={currentLog.runs}
                                                            columns={RunColumns}
                                                            className="font-sm"
                                                        />
                                                    )
                                                    : 'This log has no runs'
                                            }
                                            {
                                                <div>
                                                    <ul>
                                                        {attachments && attachments.map((attachment: Attachment) =>
                                                            <li key={attachment.fileId}>
                                                                <a
                                                                    id={attachment.fileId}
                                                                    download={attachment.title}
                                                                    href={download(attachment)}
                                                                >
                                                                    {attachment.title}
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    <hr />
                                                    <Modal
                                                        id="attachment-modal-id"
                                                        title="Add attachment"
                                                        buttonClass="btn btn-primary btn-lg"
                                                    >
                                                        <div>
                                                            <form id="addAttachment">
                                                                <AttachmentComponent
                                                                    attachTo="Log"
                                                                    isExistingItem={true}
                                                                />
                                                            </form>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            }
                                            {
                                                <div>
                                                    <h3>Currently added tags:</h3>
                                                    <ul>
                                                        {tagsForLog && tagsForLog.map((tag: Tag) =>
                                                            <li key={tag.id}>
                                                                <a
                                                                    id={tag.id}
                                                                    href={m.route.set(`/Logs?tagId=${tag.id}`)}
                                                                    title="Click to search for logs with this tag."
                                                                >
                                                                    {tag.tagText}
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    <hr />
                                                    <h3>Add a Tag to this log:</h3>
                                                    <form
                                                        onsubmit={(event: Event) => {
                                                            event.preventDefault();
                                                            this.handleSubmit(event);
                                                        }}
                                                    >
                                                        <FormGroup
                                                            label={(
                                                                <Label id="tag" text="Select an existing tag:" />
                                                            )}
                                                            field={(
                                                                <div>
                                                                    <Spinner
                                                                        isLoading={selectFetchingTags(
                                                                            store.getState())}
                                                                        small
                                                                    >
                                                                        <Select
                                                                            id="tag"
                                                                            className="selectpicker form-control"
                                                                            name="tag"
                                                                            required
                                                                            optionValue="id"
                                                                            optionText="tagText"
                                                                            options={tags}
                                                                            defaultOption="Please select a Tag."
                                                                        />
                                                                    </Spinner>
                                                                </div>
                                                            )}
                                                        />
                                                        <FormGroup
                                                            label={(
                                                                <Label
                                                                    autofocus="autofocus"
                                                                    id="description"
                                                                    text="Add new tag:"
                                                                />
                                                            )}
                                                            field={(
                                                                <Input
                                                                    id="tagText"
                                                                    inputType="text"
                                                                    autofocus="autofocus"
                                                                    className="form-control"
                                                                />
                                                            )}
                                                        />
                                                        <FormGroup
                                                            field={(
                                                                <Button
                                                                    buttonType={ButtonType.SUBMIT}
                                                                    buttonClass={ButtonClass.DEFAULT}
                                                                    text="Add Tag"
                                                                />
                                                            )}
                                                        />
                                                    </form>
                                                </div>
                                            }
                                        </TabContainer>
                                    )}
                                >
                                    <DescriptionList
                                        title={currentLog && currentLog.title}
                                        descriptions={LogDescription}
                                        entity={currentLog}
                                    />
                                </Card>
                            </div>
                        </div>
                    </HttpErrorAlert>
                </Spinner>
            </div >
        );
    }
}
