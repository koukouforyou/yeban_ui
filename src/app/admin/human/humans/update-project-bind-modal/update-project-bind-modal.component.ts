import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanBindProjectDetailDto, HumanBindProjectItemDto, HumanServiceProxy, ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'app-update-project-bind-modal',
    templateUrl: './update-project-bind-modal.component.html',
    styleUrls: ['./update-project-bind-modal.component.css']
})
export class UpdateProjectBindModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { read: ModalDirective, static: false }) modal: ModalDirective;

    constructor(injector: Injector, private _humanServiceProxy: HumanServiceProxy, private _projectServiceProxy: ProjectServiceProxy) { super(injector); }
    id: string;
    project: string;
    projectList: HumanBindProjectDetailDto;

    currentProjectList: HumanBindProjectItemDto[];
    bindProjectList: HumanBindProjectItemDto[];
    active = false;
    saving = false;
    isThisProject: boolean;
    isThisTenant: boolean;
    ngOnInit() {
    }

    onShown(): void {

    }

    show(id: string): void {
        this.id = id;
        this._humanServiceProxy.getBindProjectDetail(id).subscribe((result) => {
            this.projectList = result;
            var defaultproject = result.bindProjectIds.find(e => e.isDefault);
            result.bindProjectIds.forEach(e => {
                this.isThisTenant = e.isCurrentTenant;
            })
            if (defaultproject != undefined) {
                this.project = defaultproject.projectId;
            }
            else {
                this.project = undefined;
            }
            this.currentProjectList = this.projectList.bindProjectIds.filter(e => e.isCurrentTenant == true);
            if (abp.utils.getCookieValue("Abp.ProjectId") != null) {
                if (abp.utils.getCookieValue("Abp.ProjectId") == this.project) {
                    this.isThisProject = true;
                }
                else {
                    this.isThisProject = false;
                }
                this.bindProjectList = this.projectList.bindProjectIds.filter(e => e.projectId != this.project);
            }
            else {
                this.isThisProject = true;
                this.bindProjectList = this.projectList.bindProjectIds;
            }
            this.active = true;
            this.modal.show();
        })

    }

    close(): void {
        this.project = undefined;
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        this.bindProject();
        this.changeProject();
        this.close();
    }

    bindProject(): void {
        this._humanServiceProxy.bindProject(this.id, this.bindProjectList.filter(e => e.isBind).map(e => e.projectId)).subscribe((result) => {
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }

    changeProject(): void {
        this._humanServiceProxy.changeProject(this.id, this.project).subscribe((result) => {
            this.notify.info(this.l('SavedSuccessfully'));
        })
    }
}
