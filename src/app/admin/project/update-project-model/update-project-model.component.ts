import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProjectServiceProxy, ProjectUpdateDto } from '@shared/service-proxies/service-proxies';
import { UtilsService } from '@shared/service-proxies/service-utils';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-update-project-model',
    templateUrl: './update-project-model.component.html',
    styleUrls: ['./update-project-model.component.css']
})
export class UpdateProjectModelComponent extends AppComponentBase {

    constructor(injector: Injector
        , private _projectServiceProxy: ProjectServiceProxy
        , private utilsService: UtilsService) {
        super(injector);
        super(injector);
        this.utilsService.getAppData().subscribe(res => {
            this.app = res;
        });
    }

    @ViewChild('createOrEditModal', { read: ModalDirective, static: false }) modal: ModalDirective;
    dto: ProjectUpdateDto = new ProjectUpdateDto();
    @Output() unitUpdated: EventEmitter<ProjectUpdateDto> = new EventEmitter<ProjectUpdateDto>();
    ngOnInit() {
    }

    public app;
    active = false;
    saving = false;

    onShown(): void {

    }

    show(id: string): void {
        this._projectServiceProxy.get(id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.active = true;
                this.modal.show();
                this.dto = result;
            });
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        this.saving = true;
        this._projectServiceProxy.update(this.dto)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.unitUpdated.emit(result);
                abp.event.trigger("app.show.projectcreated");
            });
    }

    deleteProject(id: string): void {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._projectServiceProxy.delete(id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyDeleted'));
                            this.close();
                            abp.event.trigger("app.cleanProjected");
                        });
                }
            }
        )
    }
}
