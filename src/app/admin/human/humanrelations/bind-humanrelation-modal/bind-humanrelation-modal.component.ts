import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanRelationCreateDto, HumanRelationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-bind-humanrelation-modal',
    templateUrl: './bind-humanrelation-modal.component.html',
    styleUrls: ['./bind-humanrelation-modal.component.css']
})
export class BindHumanrelationModalComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    humanRelation: HumanRelationCreateDto = new HumanRelationCreateDto();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    constructor(injector: Injector,
        private _HumanRelationServiceProxy: HumanRelationServiceProxy) {
        super(injector);
    }
    sourceName:string;
    destName:string;

    active = false;
    ngOnInit() {
    }

    onShown() {

    }
    show(sourceId: string,destId:string,sourceName:string,destName:string): void {
        this.humanRelation.sourceHumanId = sourceId;
        this.humanRelation.destHumanId = destId;
        this.sourceName = sourceName;
        this.destName = destName;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.humanRelation = new HumanRelationCreateDto();
    }

    save() {
        this._HumanRelationServiceProxy.create(this.humanRelation).subscribe(result => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.active = false;
            this.modal.hide();
            this.modalSave.emit(result);
            this.humanRelation = new HumanRelationCreateDto();
        });

    }
}
