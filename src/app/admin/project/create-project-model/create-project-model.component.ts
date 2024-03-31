import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProjectCreateDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { UtilsService } from '@shared/service-proxies/service-utils';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-create-project-model',
    templateUrl: './create-project-model.component.html',
    styleUrls: ['./create-project-model.component.css'],
})
export class CreateProjectModelComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    dto: ProjectCreateDto = new ProjectCreateDto();
    @Output() unitCreated: EventEmitter<ProjectCreateDto> = new EventEmitter<ProjectCreateDto>();

    constructor(injector: Injector
        , private _projectServiceProxy: ProjectServiceProxy,private utilsService: UtilsService) {
            super(injector);
            this.utilsService.getAppData().subscribe(res => {
                this.app = res;
            });
        }
        public app;
    active = false;
    saving = false;

    ngOnInit() {
    }


    onShown(): void {

    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        this.saving = true;
        this._projectServiceProxy.create(this.dto)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitCreated.emit(result);
                abp.event.trigger("app.show.projectcreated");
            });
    }
}
