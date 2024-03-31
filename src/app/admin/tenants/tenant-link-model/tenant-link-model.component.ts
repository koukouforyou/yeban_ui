import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantsRelationDetailDto, TenantsRelationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent, Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { CreateTenantRelationModalComponent } from './create-tenant-relation-modal/create-tenant-relation-modal.component';

@Component({
    selector: 'app-tenant-link-model',
    templateUrl: './tenant-link-model.component.html',
    styleUrls: ['./tenant-link-model.component.css'],
    animations: [appModuleAnimation()]
})
export class TenantLinkModelComponent extends AppComponentBase{

    @ViewChild('createTenantRelation',{read:CreateTenantRelationModalComponent,static:false}) createTenantRelation:CreateTenantRelationModalComponent;
    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @ViewChild('paginator', { read: Paginator, static: true}) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true}) dataTable: Table;

    constructor(injector: Injector, private _tenantsLinkAppService: TenantsRelationServiceProxy) {
        super(injector);
    }

    tenantId: number;
    active = false;
    saving = false;
    tenantsRelation:TenantsRelationDetailDto[];
    pageFilters: {
        searchKey: string;
    } = <any>{};
    ngOnInit() {

    }

    onShown(): void {
    }

    show(tenantId: number): void {
        this.tenantId = tenantId;
        this.active = true;
        this.getLists();
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    getLists(event?:LazyLoadEvent){
        if(this.primengTableHelper.shouldResetPaging(event)){
            this.paginator.changePage(0);
            return;
        }
        this.primengTableHelper.showLoadingIndicator();
        this._tenantsLinkAppService.getDetailBySourceTenantId(this.tenantId,this.primengTableHelper.getMaxResultCount(this.paginator,event),this.primengTableHelper.getSkipCount(this.paginator,event),this.pageFilters.searchKey).subscribe(result=>{
                this.primengTableHelper.totalRecordsCount =result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
        })
    }

    save(): void {

    }
    delete(id:number):void{

    }

    create(id:number):void{
        this.createTenantRelation.show(id);
    }
}
