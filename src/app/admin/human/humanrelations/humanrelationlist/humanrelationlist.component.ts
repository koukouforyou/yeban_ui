import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanBindProjectDetailDto, HumanBindProjectItemDto, HumanIdBindProjectDetaiDto, HumanServiceProxy, ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent, Paginator } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { CreateHumanModalComponent } from '../../humans/create-human-modal/create-human-modal.component';

@Component({
    selector: 'app-humanrelationlist',
    templateUrl: './humanrelationlist.component.html',
    styleUrls: ['./humanrelationlist.component.css'],
    animations: [appModuleAnimation()]
})
export class HumanrelationlistComponent extends AppComponentBase implements OnInit {


    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;

    @ViewChild('createHumanModalComponent', { read: CreateHumanModalComponent, static: false }) createHumanModalComponent: CreateHumanModalComponent;
    constructor(injector: Injector, private _HumanServiceProxy: HumanServiceProxy, private _projectServiceProxy: ProjectServiceProxy) {
        super(injector);
    }
    projectlist: HumanBindProjectItemDto[];
    currentprojectlist: ProjectDto[];
    //frozenCols: any[];
    frozenCols: any[];
    scrollableCols: any[];
    pageFilters: {
        searchKey: string;
    } = <any>{};
    ngOnInit() {
        this.show();
        this.getProject();
        this.frozenCols = [
            { field: 'name', header: 'Name' },
            { field: 'project', header: 'Project' }
        ];
        // var item1 = new scrollableCol;
        // item1.field = 'name';
        // item1.header = 'name';

        // // var item2 = new scrollableCol;
        // // item2.field = 'project';
        // // item2.header = 'project';
        // this.frozenCols = [ item1]
    }


    getProject() {
        this._projectServiceProxy.getList().subscribe(result => {
            this.currentprojectlist = result;
        });
    }
    getLists(event?: LazyLoadEvent) {
        this.scrollableCols;
        this.frozenCols;
        this.primengTableHelper.showLoadingIndicator();
        this._HumanServiceProxy.getAllBindProjectDetail(this.primengTableHelper.getMaxResultCount(this.paginator, event), this.primengTableHelper.getSkipCount(this.paginator, event), this.pageFilters.searchKey)
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

    bindProject(id: string, bindProjectList: HumanBindProjectItemDto[]): void {
        this._HumanServiceProxy.bindProject(id, bindProjectList.filter(e => e.isBind).map(e => e.projectId)).subscribe((result) => {
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }

    changeProject(id: string, projectId: string): void {
        this._HumanServiceProxy.changeProject(id, projectId).subscribe((result) => {
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }

    createHuman(): void {
        this.createHumanModalComponent.show();
    }

    private show(): void {
    }
}
export class HumanTest extends HumanIdBindProjectDetaiDto {
    projectId!: string | undefined;
    isCurrentTenant: boolean;
}

export class scrollableCol {
    field: string;
    header: string;
}
