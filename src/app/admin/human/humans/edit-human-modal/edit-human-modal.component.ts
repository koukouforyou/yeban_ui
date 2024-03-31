import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanDto, HumanServiceProxy, HumanUpdateDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { HumanrelationdetailComponent } from '../../humanrelations/humanrelationdetail/humanrelationdetail.component';
import { EditHumanHeadpicModalComponent } from './edit-human-headpic-modal/edit-human-headpic-modal.component';
import {SelectItem} from 'primeng/api';
@Component({
    selector: 'app-edit-human-modal',
    templateUrl: './edit-human-modal.component.html',
    styleUrls: ['./edit-human-modal.component.css']
})
export class EditHumanModalComponent extends AppComponentBase {

    @ViewChild('editHumanHeadpicModalComponent', { read: EditHumanHeadpicModalComponent, static: false }) editHumanHeadpicModalComponent: EditHumanHeadpicModalComponent;

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();



    human: HumanDto;
    constructor(injector: Injector,
        private _HumanServiceProxy: HumanServiceProxy) {
        super(injector);
        this.stateOptions = [{label:"男",value:true},{label:"女",value:false}];
    }
    stateOptions :SelectItem[];
    active = false;
    saving = false;
    id: string;
    ngOnInit() {
    }

    ngAfterViewInit() {
        document.getElementById('Name').focus();
    }

    show(id: string): void {
        this.id = id;
        this.active = true;
        this._HumanServiceProxy.get(id).pipe(finalize(() => { this.saving = false; })).subscribe((res) => {
            this.human = res;
        })
        this.modal.show();
    }

    showChange() {
        console.log(this.human.male);
    }

    onShown():void {

    }

    save() {
        this._HumanServiceProxy.update(this.human).pipe(finalize(() => { this.saving = false; })).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }

    test(): void {
    }
}
