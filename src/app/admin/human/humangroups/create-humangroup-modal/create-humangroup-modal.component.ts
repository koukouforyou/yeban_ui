import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanGroupCreateDto, HumanGroupDto, HumanGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-create-humangroup-modal',
    templateUrl: './create-humangroup-modal.component.html',
    styleUrls: ['./create-humangroup-modal.component.css']
})
export class CreateHumangroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    dto: HumanGroupCreateDto = new HumanGroupCreateDto();
    @Output() unitCreated: EventEmitter<HumanGroupDto> = new EventEmitter<HumanGroupDto>();
    @Output() unitUpdated: EventEmitter<HumanGroupDto> = new EventEmitter<HumanGroupDto>();

    constructor(injector: Injector,
        private _humanGroupServiceProxy: HumanGroupServiceProxy) {
        super(injector);
    }

    active = false;
    saving = false;

    ngOnInit() {
    }

    onShown(): void {

    }

    show(parentId: number): void {
        this.dto.parentId = parentId;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        this.saving = true;
        this._humanGroupServiceProxy.create(this.dto)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.dto.name="";
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }
}
