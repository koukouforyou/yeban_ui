import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Tenant, TenantsRelationCreateDto, TenantsRelationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-create-tenant-relation-modal',
    templateUrl: './create-tenant-relation-modal.component.html',
    styleUrls: ['./create-tenant-relation-modal.component.css']
})
export class CreateTenantRelationModalComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector, private _tenantsLinkAppService: TenantsRelationServiceProxy) {
        super(injector);
    }
    tenantCreateDto:TenantsRelationCreateDto = new TenantsRelationCreateDto();
    tenants:Tenant[];
    active = false;
    saving = false;
    ngOnInit() {
    }

    show(tenantId: number): void {
        this.tenantCreateDto.sourceTenantId  = tenantId;
        this._tenantsLinkAppService.getAllTenants().subscribe((result=>{
            this.tenants = result.filter(e=>e.id!=this.tenantCreateDto.sourceTenantId);
            this.active = true;
        this.modal.show();
        }));
    }

    onShown() {

    }

    save() {
        this._tenantsLinkAppService.create(this.tenantCreateDto).pipe(finalize(()=>{this.saving=false;})).subscribe(()=>{
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    }

    close(): void {
        // this.human = new HumanCreateDto();
        this.active = false;
        this.modal.hide();
    }
}
