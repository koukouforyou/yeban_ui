import { Component, Injector, OnInit, ViewChild, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanRelationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent, Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { CreateHumanrelationModalComponent } from '../create-humanrelation-modal/create-humanrelation-modal.component';

@Component({
    selector: 'app-humanrelationdetail',
    templateUrl: './humanrelationdetail.component.html',
    styleUrls: ['./humanrelationdetail.component.css']
})
export class HumanrelationdetailComponent extends AppComponentBase implements OnInit {

    @ViewChild('createHumanrelationModalComponent', { read: CreateHumanrelationModalComponent, static: false }) createHumanrelationModalComponent: CreateHumanrelationModalComponent;
    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector,
        private _HumanRelationServiceProxy: HumanRelationServiceProxy) {
        super(injector);
    }

    pageFilters: {
        searchKey: string;
    } = <any>{};

    active = false;
    saving = false;
    humanId: string;
    ngOnInit() {
    }

    onShown() {

    }

    close(): void {
        this.active = false;
        this.modal.hide();

    }

    show(id: string): void {
        this.humanId = id;
        this.active=true;
        this.getLists();
        this.modal.show();
    }

    getLists(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._HumanRelationServiceProxy.getByHumanId(this.humanId, this.primengTableHelper.getMaxResultCount(this.paginator, event), this.primengTableHelper.getSkipCount(this.paginator, event), this.pageFilters.searchKey)
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    editHumanRelation(id: string) {

    }

    deleteHumanRelation(id: string) {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._HumanRelationServiceProxy.delete(id)
                        .subscribe(() => {
                            this.getLists();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        )
    }

    createHumanRelation(id: string) {
        this.createHumanrelationModalComponent.show(id);
    }
}
