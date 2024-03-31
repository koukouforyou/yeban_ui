import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanRelationCreateDto, HumanRelationServiceProxy, HumanServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-create-humanrelation-modal',
    templateUrl: './create-humanrelation-modal.component.html',
    styleUrls: ['./create-humanrelation-modal.component.css']
})
export class CreateHumanrelationModalComponent extends AppComponentBase {

    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;
    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _HumanRelationServiceProxy: HumanRelationServiceProxy,
        private _HumanServiceProxy:HumanServiceProxy) {
        super(injector);
    }
    humanRelation: HumanRelationCreateDto = new HumanRelationCreateDto();
    pageFilters: {
        searchKey: string;
    } = <any>{};

    active = false;
    saving = false;
    selectRowData: any;
    ngOnInit() {
    }

    onShown() {

    }
    show(id: string): void {
        this.humanRelation.sourceHumanId=id;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
        this.humanRelation= new HumanRelationCreateDto();
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

    rowSelect(event?:any)
    {
        this.humanRelation.destHumanId = event.data.id;
    }

    save(){
        this._HumanRelationServiceProxy.create(this.humanRelation).subscribe(result => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.active = false;
            this.modal.hide();
            this.humanRelation= new HumanRelationCreateDto();
            this.modalSave.emit(null);
        });

    }
}
