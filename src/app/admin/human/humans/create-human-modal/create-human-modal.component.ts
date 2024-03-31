import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanCreateDto, HumanServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import {SelectItem} from 'primeng/api';

@Component({
    selector: 'app-create-human-modal',
    templateUrl: './create-human-modal.component.html',
    styleUrls: ['./create-human-modal.component.css']
})
export class CreateHumanModalComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    human: HumanCreateDto = new HumanCreateDto();

    constructor(injector: Injector,
        private _HumanServiceProxy: HumanServiceProxy) {
        super(injector);
        this.stateOptions = [{label:"男",value:true},{label:"女",value:false}];
    }
    stateOptions :SelectItem[];
    active = false;
    saving = false;
    ngOnInit() {
    }

    ngAfterViewInit() {
        document.getElementById('Name').focus();
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    onShown():void {

    }

    save() {
        this._HumanServiceProxy.create(this.human).pipe(finalize(() => { this.saving = false; })).subscribe(result => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(result);
        });
    }

    continueSave(){
        this._HumanServiceProxy.create(this.human).pipe(finalize(() => { this.saving = false; })).subscribe(result => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.human = new HumanCreateDto();
            this.modalSave.emit(result);
        });
    }

    close(): void {
        this.human = new HumanCreateDto();
        this.active = false;
        this.modal.hide();
    }
}
