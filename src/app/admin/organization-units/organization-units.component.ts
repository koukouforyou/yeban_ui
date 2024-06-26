import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { OrganizationTreeComponent } from './organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-unit-members.component';

@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase {

    @ViewChild('ouMembers', { read: OrganizationUnitMembersComponent, static: false}) ouMembers: OrganizationUnitMembersComponent;
    @ViewChild('ouTree', { read: OrganizationTreeComponent,static: false}) ouTree: OrganizationTreeComponent;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
