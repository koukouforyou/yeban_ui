import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanBindProjectItemDto, HumanServiceProxy, ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { HumanTest, scrollableCol } from '../humanrelationlist.component';

@Component({
    selector: 'app-edit-human-project-map-modal',
    templateUrl: './edit-human-project-map-modal.component.html',
    styleUrls: ['./edit-human-project-map-modal.component.css']
})
export class EditHumanProjectMapModalComponent extends AppComponentBase {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;

    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;

    constructor(injector: Injector,private _HumanServiceProxy: HumanServiceProxy, private _projectServiceProxy: ProjectServiceProxy) { super(injector); }


    active = false;
    saving = false;
    projectId = abp.utils.getCookieValue("Abp.ProjectId");
    pageFilters: {
        searchKey: string;
    } = <any>{};
    projectlist: HumanBindProjectItemDto[];
    currentProjectList: HumanBindProjectItemDto[];
    scrollableCols: any[];
    frozenCols: any[];
    currentprojectlist: ProjectDto[];
    ngOnInit() {
        this.getProject();

    }

    onShown(): void {

    }

    show(): void {
        this.active = true;
        this.frozenCols = [
            { field: 'name', header: 'Name' },
            { field: 'project', header: 'Project' }
        ];
        this.modal.show();
    }

    getProject() {
        this._projectServiceProxy.getList().subscribe(result => {
            this.currentprojectlist = result;
        });
    }



    bindProject(id: string, bindProjectList: HumanBindProjectItemDto[]): void {
        this._HumanServiceProxy.bindProject(id, bindProjectList.filter(e => e.isBind).map(e => e.projectId)).subscribe((result) => {
            this.modalSave.emit(result);
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }

    changeProject(id: string, projectId: string): void {
        this._HumanServiceProxy.changeProject(id, projectId).subscribe((result) => {
            this.modalSave.emit(result);
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }

    getLists(event?: LazyLoadEvent) {
        console.log(this.projectId);
        this.scrollableCols;
        this.frozenCols;
        this.primengTableHelper.showLoadingIndicator();
        this._HumanServiceProxy.getAllBindProjectDetailWithOutFilter(this.primengTableHelper.getMaxResultCount(this.paginator, event), this.primengTableHelper.getSkipCount(this.paginator, event), this.pageFilters.searchKey)
            .subscribe(result => {
                var tempresult = result.items.map(function (data) {
                    var humanTest = new HumanTest;
                    humanTest.humanId = data.humanId;
                    humanTest.humanName = data.humanName;
                    humanTest.bindProjectIds = data.bindProjectIds;
                    data.bindProjectIds.forEach(e => humanTest.isCurrentTenant = e.isCurrentTenant);
                    var project = data.bindProjectIds.find(e => e.isDefault == true);
                    humanTest.projectId = project == undefined ? undefined : project.projectId;
                    return humanTest;
                })
                if (result.items.length > 0) {

                    this.projectlist = result.items[0].bindProjectIds;
                    this.currentProjectList = this.projectlist.filter(e=>e.projectId==this.projectId);
                }
                this.scrollableCols = this.projectlist.map(function (data) {
                    var scrcollableCol = new scrollableCol;
                    scrcollableCol.field = data.projectName;
                    scrcollableCol.header = data.projectName;
                    return scrcollableCol;
                });
                this.primengTableHelper.records = tempresult;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
                //console.log(this.primengTableHelper.records);

            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
