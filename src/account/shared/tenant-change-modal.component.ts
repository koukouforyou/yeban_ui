import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput, Tenant, TenantAvailabilityState, TenantsRelationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'tenantChangeModal',
    templateUrl: './tenant-change-modal.component.html'
})
export class TenantChangeModalComponent extends AppComponentBase {

    @ViewChild('tenantChangeModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    @ViewChild('tenancyNameInput', { read: ElementRef, static: false }) tenancyNameInput: ElementRef;

    tenancyName = '';
    active = false;
    saving = false;
    tenants: Tenant[];
    destinctTenant: any;
    constructor(
        private _accountService: AccountServiceProxy, private _tenantsLinkAppService: TenantsRelationServiceProxy,
        injector: Injector
    ) {
        super(injector);
    }

    show(tenancyName: string): void {
        this.tenancyName = tenancyName;
        this.active = true;
        this.modal.show();
        this._tenantsLinkAppService.getAllTenants().subscribe((result => {
            this.tenants = result;
            this.active = true;
            this.modal.show();
        }));
    }

    onShown(): void {
        (this.tenancyNameInput.nativeElement as any).focus();
    }

    save(): void {

        if (this.destinctTenant.id == undefined) {
            abp.multiTenancy.setTenantIdCookie(undefined);
            this.close();
            location.reload();
            return;
        }

        let input = new IsTenantAvailableInput();
        input.tenancyName = this.tenants.find(e => e.id == this.destinctTenant.id).tenancyName;
        this.saving = true;
        this._accountService.isTenantAvailable(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: IsTenantAvailableOutput) => {
                switch (result.state) {
                    case TenantAvailabilityState.Available:
                        abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        this.close();
                        location.reload();
                        return;
                    case TenantAvailabilityState.InActive:
                        this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
                        break;
                    case TenantAvailabilityState.NotFound: //NotFound
                        this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
                        break;
                }
            });
    }

    save2(): void {

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
