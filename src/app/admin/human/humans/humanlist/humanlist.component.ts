import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LazyLoadEvent, Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { HumanServiceProxy } from 'shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateHumanModalComponent } from '../create-human-modal/create-human-modal.component';
import { EditHumanModalComponent } from '../edit-human-modal/edit-human-modal.component';
import { HumanrelationdetailComponent } from '../../humanrelations/humanrelationdetail/humanrelationdetail.component';
import { UpdateProjectBindModalComponent } from '../update-project-bind-modal/update-project-bind-modal.component';
import { EditHumanHeadpicModalComponent } from '../edit-human-modal/edit-human-headpic-modal/edit-human-headpic-modal.component';
import {SelectItem} from 'primeng/api';
@Component({
    selector: 'app-humanlist',
    templateUrl: './humanlist.component.html',
    styleUrls: ['./humanlist.component.css'],
    animations: [appModuleAnimation()]
})
export class HumanlistComponent extends AppComponentBase implements OnInit {

    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;
    @ViewChild('createHumanModalComponent', { read: CreateHumanModalComponent, static: false }) createHumanModalComponent: CreateHumanModalComponent;
    @ViewChild('editHumanModalComponent', { read: EditHumanModalComponent, static: false }) editHumanModalComponent: EditHumanModalComponent;
    @ViewChild('humanrelationdetailComponent', { read: HumanrelationdetailComponent, static: false }) humanrelationdetailComponent: HumanrelationdetailComponent;
    @ViewChild('updateProjectBindModalComponent', { read: UpdateProjectBindModalComponent, static: false }) updateProjectBindModalComponent: UpdateProjectBindModalComponent;
    @ViewChild('editHumanHeadpicModalComponent', { read: EditHumanHeadpicModalComponent, static: false }) editHumanHeadpicModalComponent: EditHumanHeadpicModalComponent;

    private changeTimes = new Array<Date>();
    pageFilters: {
        searchKey: string;
    } = <any>{};
    constructor(injector: Injector,
        private _HumanServiceProxy: HumanServiceProxy) {
        super(injector);
        this.stateOptions = [{label:"男",value:true},{label:"女",value:false}];
    }

    stateOptions :SelectItem[];

    ngOnInit(): void {
    }

    getList(event?: LazyLoadEvent) {
        var currentTime = new Date();
        this.changeTimes.push(currentTime);
        if (this.changeTimes.length == 1) {
            this.getHumans(event);
        } else {
            setTimeout(() => {
                if (this.changeTimes[this.changeTimes.length - 1] == currentTime) {
                    this.getHumans(event);
                }
            }, 500);
        }
    }

    getHumans(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._HumanServiceProxy.getHumanListByFilter(this.primengTableHelper.getMaxResultCount(this.paginator, event), this.primengTableHelper.getSkipCount(this.paginator, event), this.pageFilters.searchKey)
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });

    }

    deleteHuman(id: string): void {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._HumanServiceProxy.delete(id)
                        .subscribe(() => {
                            this.getList();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        )
    }

    editHumanRelation(id: string): void {
        this.humanrelationdetailComponent.show(id);
    }

    createHuman(): void {
        this.createHumanModalComponent.show();
    }

    editHuman(id: string): void {
        this.editHumanModalComponent.show(id);
    }

    editProjectBind(id: string): void {
        this.updateProjectBindModalComponent.show(id);
    }

    changeMajor(id: string, isMajor: boolean): void {
        this._HumanServiceProxy.changeHumanMajor(id, isMajor).subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
        });
    }

    changeSex(id:string,sex:boolean) {
        console.log(sex);
    }

}
