import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanGroupRelationCreateDto, HumanGroupRelationDto, HumanGroupRelationServiceProxy, HumanServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent, Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-create-humangrouprelation-modal',
    templateUrl: './create-humangrouprelation-modal.component.html',
    styleUrls: ['./create-humangrouprelation-modal.component.css']
})
export class CreateHumangrouprelationModalComponent extends AppComponentBase {




    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;
    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('createModal', { read: ModalDirective, static: false }) createModal: ModalDirective;

    @Output() unitCreated: EventEmitter<HumanGroupRelationDto> = new EventEmitter<HumanGroupRelationDto>();
    dto: HumanGroupRelationCreateDto = new HumanGroupRelationCreateDto();
    constructor(injector: Injector,
        private _humanGroupRelationServiceProxy: HumanGroupRelationServiceProxy,
        private _HumanServiceProxy: HumanServiceProxy) {
        super(injector);
    }
    selectRowData: any;
    pageFilters: {
        searchKey: string;
    } = <any>{};
    active = false;
    saving = false;

    ngOnInit() {
    }

    onShown(): void {

    }

    rowSelect(event?: any) {
        this.dto.humanId = event.data.id;
    }

    getLists(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._HumanServiceProxy.getHumanListByFilter(this.primengTableHelper.getMaxResultCount(this.paginator, event), this.primengTableHelper.getSkipCount(this.paginator, event), this.pageFilters.searchKey)
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }


    show(parentId: number): void {
        this.dto.humanGroupId = parentId;
        this.active = true;
        this.createModal.show();
    }

    close(): void {
        this.createModal.hide();
        this.active = false;
    }

    save(): void {
        this.saving = true;
        this._humanGroupRelationServiceProxy.create(this.dto)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
            });
    }

}
