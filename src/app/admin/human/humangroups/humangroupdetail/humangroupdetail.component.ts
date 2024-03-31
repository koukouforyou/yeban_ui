import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AddMemberModalComponent } from '@app/admin/organization-units/add-member-modal.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanDto, HumanGroupDto, HumanGroupRelationCreateDto, HumanGroupRelationDetailDto, HumanGroupRelationDto, HumanGroupRelationServiceProxy, HumanGroupRelationUpdateDto, HumanGroupUpdateDto, HumanServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateHumanModalComponent } from '../../humans/create-human-modal/create-human-modal.component';
import { CreateHumangrouprelationModalComponent } from './create-humangrouprelation-modal/create-humangrouprelation-modal.component';

@Component({
    selector: 'app-humangroupdetail',
    templateUrl: './humangroupdetail.component.html',
    styleUrls: ['./humangroupdetail.component.css']
})
export class HumangroupdetailComponent extends AppComponentBase implements OnInit {

    _HumanGroup: HumanGroupDto;
    @ViewChild('addHumanRelationModal', { read: CreateHumangrouprelationModalComponent, static: false }) addHumanRelationModal: CreateHumangrouprelationModalComponent;

    @ViewChild('addHumanModal',{ read: CreateHumanModalComponent, static: false })
    addHumanModal:CreateHumanModalComponent;

    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;
    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    constructor(injector: Injector, private _humanServiceProxy: HumanServiceProxy,
        private _humanGroupRelationServiceProxy:HumanGroupRelationServiceProxy) { super(injector); }
    memo:string;
    ngOnInit() {
    }

    get HumanGroup():HumanGroupDto{
        return this._HumanGroup;
    }
    set HumanGroup( dto:HumanGroupDto){
        this._HumanGroup = dto;
        this.refreshhumanrelation();
    }

    getHuman(event?: LazyLoadEvent) {
        if (!this._HumanGroup) {
            return;
        }

        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        this._humanGroupRelationServiceProxy.getRelationByGroupId(
            this.HumanGroup.id,
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event), null
        ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    refreshhumanrelation():void{
        this.reloadPage();
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    openAddModal(): void {
        this.addHumanRelationModal.show(this._HumanGroup.id);
    }

    openNewHumanAddModal():void{
        this.addHumanModal.show();
    }

    createHumanGroupRelation(dto:HumanDto){
        console.log(dto.id);
        var entity =new HumanGroupRelationCreateDto();
        entity.humanGroupId = this.HumanGroup.id;
        entity.humanId = dto.id;
        this._humanGroupRelationServiceProxy.create(entity).subscribe(()=>{
            this.refreshhumanrelation();
            this.notify.success(this.l('SuccessfullyCreated'));
        });
    }

    displayNameclick(res){
        this.memo = res;
    }

    ondisplayNameChange(res:HumanGroupRelationDetailDto){
        var entity = new HumanGroupRelationUpdateDto();
        entity.id = res.id;
        entity.memo = res.memo;
        entity.humanId = res.human.id;
        entity.humanGroupId = res.humanGroup.id;
        this._humanGroupRelationServiceProxy.update(entity).subscribe(()=>{
            this.refreshhumanrelation();
            this.notify.success(this.l('SuccessfullyUpdated'));
        })
    }

    removeHumanRelation(id: string) {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._humanGroupRelationServiceProxy.delete(id)
                        .subscribe(() => {
                            this.refreshhumanrelation();
                            this.notify.success(this.l('SuccessfullyCreated'));
                        });
                }
            }
        )
    }
}
