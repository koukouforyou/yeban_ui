import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HumanGroupDto, HumanGroupMoveDto, HumanGroupServiceProxy } from '@shared/service-proxies/service-proxies';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { MenuItem, TreeNode } from 'primeng/api';
import * as _ from 'lodash';
import { IBasicGroupTreeUnitInfo } from '../basic-grouptree-unit-info';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CreateHumangroupModalComponent } from '../create-humangroup-modal/create-humangroup-modal.component';
import { EditHumangroupModalComponent } from '../edit-humangroup-modal/edit-humangroup-modal.component';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';

@Component({
    selector: 'app-humangroupstree',
    templateUrl: './humangroupstree.component.html',
    styleUrls: ['./humangroupstree.component.css']
})
export class HumangroupstreeComponent extends AppComponentBase implements OnInit {

    @Output() ouSelected = new EventEmitter<IBasicGroupTreeUnitInfo>();
    @ViewChild('createHumanGroupModal', { read: CreateHumangroupModalComponent, static: false }) createHumanGroupModal: CreateHumangroupModalComponent;
    @ViewChild('editHumanGroupModal', { read: EditHumangroupModalComponent, static: false }) editHumanGroupModal: EditHumangroupModalComponent
    @ViewChild('entityTypeHistoryModal', { read: EntityTypeHistoryModalComponent, static: false }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;


    _entityTypeFullName = 'Abp.Organizations.OrganizationUnit';

    ouContextMenuItems: MenuItem[];
    canManageOrganizationUnits = true;
    selectedOu: TreeNode;
    treeData: any;
    totalUnitCount = 0;
    constructor(injector: Injector,
        private _humanGroupServiceProxy: HumanGroupServiceProxy,
        private _arrayToTreeConverterService: ArrayToTreeConverterService,
        private _treeDataHelperService: TreeDataHelperService) {
        super(injector);
    }


    ngOnInit(): void {
        this.ouContextMenuItems = this.getContextMenuItems();
        this.getTreeDataFromServer();
    }

    nodeSelect(event) {
        this.ouSelected.emit(<IBasicGroupTreeUnitInfo>{
            id: event.node.data.id,
            displayName: event.node.data.name
        });
    }

    addGroup(parentId): void {
        this.createHumanGroupModal.show(
            parentId
        );
    }

    nodeDrop(event) {
        this.message.confirm(
            this.l('OrganizationUnitMoveConfirmMessage', event.dragNode.data.name, event.dropNode.data.name),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    const input = new HumanGroupMoveDto();
                    input.id = event.dragNode.data.id;
                    input.parentId = event.originalEvent.target.nodeName === 'SPAN'||event.originalEvent.target.nodeName === 'DIV' ? event.dropNode.data.id : event.dropNode.parent?event.dropNode.parent.data.id:undefined;
                    this._humanGroupServiceProxy.moveGroup(input)
                        .pipe(catchError(error => {
                            this.revertDragDrop();
                            return Observable.throw(error);
                        }))
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyMoved'));
                            this.reload();
                        });
                } else {
                    this.revertDragDrop();
                }
            }
        );
    }

    reload(): void {
        this.getTreeDataFromServer();
    }

    private generateTextOnTree(ou: HumanGroupDto) {
        return ou.name;
    }

    private getTreeDataFromServer(): void {
        let self = this;
        this._humanGroupServiceProxy.getTreeList().subscribe((result: HumanGroupDto[]) => {
            this.treeData = this._arrayToTreeConverterService.createTree(result, 'parentId', 'id', 59, 'children',
                [{
                    target: 'label',
                    targetFunction(item) {
                        return self.generateTextOnTree(item);
                    }
                }, {
                    target: 'expandedIcon',
                    value: 'fa fa-folder-open m--font-warning'
                },
                {
                    target: 'collapsedIcon',
                    value: 'fa fa-folder m--font-warning'
                },
                {
                    target: 'selectable',
                    value: true
                }],true,true);
        });
    }


    private getContextMenuItems(): any[] {

        const canManageOrganizationTree = this.isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree');

        let items = [
            {
                label: this.l('Edit'),
                disabled: !canManageOrganizationTree,
                command: (event) => {
                    this.editHumanGroupModal.show(
                        this.selectedOu.data.id,
                    );
                }
            },
            {
                label: this.l('AddSubUnit'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.addGroup(this.selectedOu.data.id);
                }
            },
            {
                label: this.l('Delete'),
                disabled: !canManageOrganizationTree,
                command: () => {
                    this.message.confirm(
                        this.l('OrganizationUnitDeleteWarningMessage', this.selectedOu.data.displayName),
                        this.l('AreYouSure'),
                        isConfirmed => {
                            if (isConfirmed) {
                                this._humanGroupServiceProxy.delete(this.selectedOu.data.id).subscribe(() => {
                                    this.deleteGroup(this.selectedOu.data.id);
                                    this.notify.success(this.l('SuccessfullyDeleted'));
                                    this.selectedOu = null;
                                });
                            }
                        }
                    );
                }
            }
        ];

        if (this.isEntityHistoryEnabled()) {
            items.push({
                label: this.l('History'),
                disabled: false,
                command: (event) => {
                    this.entityTypeHistoryModal.show({
                        entityId: this.selectedOu.data.id.toString(),
                        entityTypeFullName: this._entityTypeFullName,
                        entityTypeDescription: this.selectedOu.data.displayName
                    });
                }
            });
        }

        return items;
    }
    deleteGroup(id) {
        let node = this._treeDataHelperService.findNode(this.treeData, { data: { id: id } });
        if (!node) {
            return;
        }

        if (!node.data.parentId) {
            _.remove(this.treeData, {
                data: {
                    id: id
                }
            });
        }

        let parentNode = this._treeDataHelperService.findNode(this.treeData, { data: { id: node.data.parentId } });
        if (!parentNode) {
            return;
        }

        _.remove(parentNode.children, {
            data: {
                id: id
            }
        });
    }

    unitCreated(dto: HumanGroupDto): void {
        this.getTreeDataFromServer();
        // if (dto.parentId) {
        //     let unit = this._treeDataHelperService.findNode(this.treeData, { data: { id: dto.parentId } });
        //     if (!unit) {
        //         return;
        //     }

        //     unit.children.push({
        //         label: this.generateTextOnTree(dto),
        //         expandedIcon: 'fa fa-folder-open m--font-warning',
        //         collapsedIcon: 'fa fa-folder m--font-warning',
        //         selected: true,
        //         children: [],
        //         data: dto
        //     });
        // } else {
        //     this.treeData.push({
        //         label: this.generateTextOnTree(dto),
        //         expandedIcon: 'fa fa-folder-open m--font-warning',
        //         collapsedIcon: 'fa fa-folder m--font-warning',
        //         selected: true,
        //         children: [],
        //         data: dto
        //     });
        // }

        // this.totalUnitCount += 1;

    }

    unitUpdated(dto: HumanGroupDto): void {
        // let item = this._treeDataHelperService.findNode(this.treeData, { data: { id: dto.id } });
        // if (!item) {
        //     return;
        // }

        // item.label = this.generateTextOnTree(dto);
        this.getTreeDataFromServer();
    }


    private isEntityHistoryEnabled(): boolean {
        let customSettings = (abp as any).custom;
        return customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    revertDragDrop() {
        this.reload();
    }
}
