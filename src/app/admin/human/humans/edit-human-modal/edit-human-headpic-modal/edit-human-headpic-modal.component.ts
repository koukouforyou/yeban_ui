import { Injector } from '@angular/core';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanBase64PicUpdateDto, HumanPicServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-edit-human-headpic-modal',
    templateUrl: './edit-human-headpic-modal.component.html',
    styleUrls: ['./edit-human-headpic-modal.component.css']
})
export class EditHumanHeadpicModalComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector, private _HumanPicServiceProxy: HumanPicServiceProxy) { super(injector); }
    active = false;
    saving = false;
    picUrl: string;
    humanId: string;
    base64: string;
    onShown() {

    }

    save() {
        if (this.picUrl != undefined) {
            this._HumanPicServiceProxy.updateHeadPic(this.picUrl, this.humanId).subscribe(result => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.active = false;
                this.modal.hide();
                this.modalSave.emit();
                this.picUrl = undefined;
                this.humanId = undefined;
            });
        }
        else {
            if (this.base64 != undefined) {
                var dto = new HumanBase64PicUpdateDto();
                dto.base64 = this.base64;
                dto.humanId = this.humanId;
                this._HumanPicServiceProxy.updateHeadPicByBase64(dto).subscribe(result => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.active = false;
                    this.modal.hide();
                    this.modalSave.emit();
                    this.picUrl = undefined;
                    this.humanId = undefined;
                    this.base64 = undefined;
                });
            }
            else {

            }
        }
    }

    show(humanId: string): void {
        this.active = true;
        this.modal.show();
        this.humanId = humanId;
    }

    async handlePaste(event) {
        var img = await event.view.navigator.clipboard.read();
        for (var item of img) {
            for (var type of item.types) {
                var blob = await item.getType(type);
                var base64 = this.blobToBase64(blob);
                this.base64 = <string>(await base64);
            }
        }
        this.picUrl = undefined;
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                resolve((e.target as any).result);
            };
            fileReader.readAsDataURL(blob);
            fileReader.onerror = () => {
                reject(new Error('blobToBase64 error'));
            };
        }
        );
    }

    close(): void {
        this.active = false;
        this.base64 = undefined;
        this.picUrl = undefined;
        this.modal.hide();
    }

}
