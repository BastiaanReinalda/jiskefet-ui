/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import State from '../models/State';
import { HttpError } from '../interfaces/HttpError';

interface Attrs {
    /**
     * The title of where the attachment is added to.
     */
    attachTo: string;
    /**
     * Whether the item already exists
     */
    isExistingItem: boolean;
    /**
     * Whether to hide the image preview
     */
    hideImagePreview?: boolean;
}

type Vnode = m.Vnode<Attrs, AttachmentComponent>;

export default class AttachmentComponent extends MithrilTsxComponent<Attrs> {

    private isExistingItem: boolean;
    private hasChosenAttachment: boolean;
    private maxFileSize: number;

    constructor(vnode: Vnode) {
        super();
        this.isExistingItem = vnode.attrs.isExistingItem;
        this.hasChosenAttachment = false;
        this.maxFileSize = 50000000;
    }

    /**
     * Gets called after User selects a file.
     * @param event The event of having selected a file.
     */
    getSelectedFiles = (event: Event) => {
        const files = (event.target as HTMLInputElement).files as FileList;
        const maxSizeLabel = document.getElementById('maximum-size-label') as HTMLElement;

        if (files[0].size > this.maxFileSize) {
            maxSizeLabel.hidden = false;
        } else {
            maxSizeLabel.hidden = true;
            this.read(files[0], this.isExistingItem);
        }
    }

    /**
     *  Read the files with the reader object into a Base64 encoded string.
     * @param file The file that the user has chosen (event.target.files).
     * @param isExistingItem Whether the attachment is added to an existing Item.
     */
    read = (file: File, isExistingItem: boolean) => {
        this.hasChosenAttachment = true;
        const reader = new FileReader();
        reader.onload = () => {
            // Store the base64 encoded file as a string
            const base64String = reader.result as string;
            // Save the file data in the state
            this.saveAttachmentState(base64String, file.name, isExistingItem);
            // Set image preview
            const previewImage = document.getElementById('preview-image');
            if (base64String.indexOf('image') >= 0 && previewImage) {
                (previewImage as HTMLImageElement).src = base64String;
            } else {
                (previewImage as HTMLImageElement).src = '';
            }
        };
        reader.readAsDataURL(file);
    }

    /**
     * Saves the base64 encoded string into the state.
     * @param base64String The file base64 encoded string.
     * @param name The name of the file.
     * @param isExistingItem Whether the attachment is added to an existing Item.
     */
    saveAttachmentState = (base64String: string, name: string, isExistingItem: boolean) => {

        State.AttachmentModel.createAttachment.title = name;
        State.AttachmentModel.createAttachment.fileMime = base64String.
            substring('data:'.length, base64String.indexOf(';base64,'));
        State.AttachmentModel.createAttachment.fileData = base64String.split(';base64,')[1];

        if (isExistingItem) {
            State.AttachmentModel.createAttachment.log = State.LogModel.current;
        } else {
            // Check if attachment was not already added (needs to be adjusted for multiple file upload)
            if (State.LogModel.createLog.attachments === undefined
                || State.LogModel.createLog.attachments.length > 0) {

                State.LogModel.createLog.attachments = new Array();
            }
            State.LogModel.createLog.attachments.push(State.AttachmentModel.createAttachment);
        }
    }

    /**
     * This function will post the saved Attachment to the Api and reset the view to show its been added
     */
    postAttachments = async () => {
        if (State.AttachmentModel.createAttachment && this.hasChosenAttachment) {
            await State.AttachmentModel.save()
                .catch((e: HttpError) => {
                    State.HttpErrorModel.add(e);
                })
                .then(async () => {
                    // Reset the input form
                    const fileInput = document.getElementById('addAttachment') as HTMLFormElement;
                    const imagePreview = document.getElementById('preview-image') as HTMLImageElement;
                    if (fileInput && imagePreview.src) {
                        fileInput.reset();
                        imagePreview.src = '';
                    }
                    // Redraw the current view
                    await State.AttachmentModel.fetchForLog(State.LogModel.current.logId);
                });
        }
    }

    view(vnode: Vnode) {
        const { attachTo, hideImagePreview } = vnode.attrs;
        return (
            <div>
                <div class="alert alert-danger" role="alert" id="maximum-size-label" for="save" hidden>
                    Maximum file size is 50MB! Please select a smaller file.
                </div>
                <label for="fileUpload">Attach file to {attachTo}:</label>
                <input
                    type="file"
                    class="form-control-file"
                    id="fileUpload"
                    name="fileUpload"
                    data-show-caption="true"
                    onchange={this.getSelectedFiles}
                />
                <img
                    id="preview-image"
                    src=""
                    style="max-width:40%; padding:10px 10px 10px 0px;"
                    hidden={hideImagePreview}
                />
                <div hidden={!this.isExistingItem}>
                    <span
                        class="d-inline-block"
                        tabindex="0"
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Select a file before saving."
                    >
                        <button
                            id="save"
                            class="btn btn-primary"
                            data-dismiss="modal"
                            onclick={this.postAttachments}
                            disabled={!this.hasChosenAttachment}
                        >Save File
                        </button>
                    </span>
                </div>
            </div>
        );
    }
}
