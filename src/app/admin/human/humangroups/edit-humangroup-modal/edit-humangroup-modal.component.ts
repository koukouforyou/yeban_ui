import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanGroupDto, HumanGroupServiceProxy, HumanGroupUpdateDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-edit-humangroup-modal',
    templateUrl: './edit-humangroup-modal.component.html',
    styleUrls: ['./edit-humangroup-modal.component.css']
})
export class EditHumangroupModalComponent extends AppComponentBase {

    active = false;
    saving = false;
    @ViewChild('createOrEditModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    dto: HumanGroupUpdateDto = new HumanGroupUpdateDto();
    @Output() unitCreated: EventEmitter<HumanGroupDto> = new EventEmitter<HumanGroupDto>();
    @Output() unitUpdated: EventEmitter<HumanGroupDto> = new EventEmitter<HumanGroupDto>();

    constructor(injector: Injector,
        private _humanGroupServiceProxy: HumanGroupServiceProxy) {
        super(injector);
    }

    onShown(): void {

    }

    show(id: number): void {
        this._humanGroupServiceProxy.get(id).pipe(finalize(() => this.saving = false))
        .subscribe((result) => {
            this.dto = new HumanGroupUpdateDto;
            this.dto.id = result.id;
            this.dto.name = result.name;
            this.active = true;
            this.modal.show();
        });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        this.saving = true;
        this._humanGroupServiceProxy.update(this.dto)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }

    ngOnInit() {
    }

}
