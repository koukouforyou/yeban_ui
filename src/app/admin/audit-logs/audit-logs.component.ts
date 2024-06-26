import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuditLogDetailModalComponent } from '@app/admin/audit-logs/audit-log-detail-modal.component';
import { EntityChangeDetailModalComponent } from '@app/shared/common/entityHistory/entity-change-detail-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AuditLogListDto, AuditLogServiceProxy, EntityChangeListDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';

@Component({
    templateUrl: './audit-logs.component.html',
    styleUrls: ['./audit-logs.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class AuditLogsComponent extends AppComponentBase {

    @ViewChild('auditLogDetailModal', { read: AuditLogDetailModalComponent,static: false}) auditLogDetailModal: AuditLogDetailModalComponent;
    @ViewChild('entityChangeDetailModal', { read: EntityChangeDetailModalComponent, static: false}) entityChangeDetailModal: EntityChangeDetailModalComponent;
    @ViewChild('dataTableAuditLogs', { read: Table, static: false}) dataTableAuditLogs: Table;
    @ViewChild('dataTableEntityChanges', { read: Table, static: false}) dataTableEntityChanges: Table;
    @ViewChild('paginatorAuditLogs', { read: Paginator, static: false}) paginatorAuditLogs: Paginator;
    @ViewChild('paginatorEntityChanges', { read: Paginator, static: false}) paginatorEntityChanges: Paginator;

    //Filters
    public dateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];

    public usernameAuditLog: string;
    public usernameEntityChange: string;
    public serviceName: string;
    public methodName: string;
    public browserInfo: string;
    public hasException: boolean = undefined;
    public minExecutionDuration: number;
    public maxExecutionDuration: number;
    public entityTypeFullName: string;
    public objectTypes: NameValueDto[];

    primengTableHelperAuditLogs = new PrimengTableHelper();
    primengTableHelperEntityChanges = new PrimengTableHelper();
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private _auditLogService: AuditLogServiceProxy,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    showAuditLogDetails(record: AuditLogListDto): void {
        this.auditLogDetailModal.show(record);
    }

    showEntityChangeDetails(record: EntityChangeListDto): void {
        this.entityChangeDetailModal.show(record);
    }

    getAuditLogs(event?: LazyLoadEvent) {
        if (this.primengTableHelperAuditLogs.shouldResetPaging(event)) {
            this.paginatorAuditLogs.changePage(0);

            return;
        }

        this.primengTableHelperAuditLogs.showLoadingIndicator();

        this._auditLogService.getAuditLogs(
            moment(this.dateRange[0]),
            moment(this.dateRange[1]),
            this.usernameAuditLog,
            this.serviceName,
            this.methodName,
            this.browserInfo,
            this.hasException,
            this.minExecutionDuration,
            this.maxExecutionDuration,
            this.primengTableHelperAuditLogs.getSorting(this.dataTableAuditLogs),
            this.primengTableHelperAuditLogs.getMaxResultCount(this.paginatorAuditLogs, event),
            this.primengTableHelperAuditLogs.getSkipCount(this.paginatorAuditLogs, event)
        ).subscribe((result) => {
            this.primengTableHelperAuditLogs.totalRecordsCount = result.totalCount;
            this.primengTableHelperAuditLogs.records = result.items;
            this.primengTableHelperAuditLogs.hideLoadingIndicator();
        });
    }

    getEntityChanges(event?: LazyLoadEvent) {
        this._auditLogService.getEntityHistoryObjectTypes()
            .subscribe((result) => {
                this.objectTypes = result;
            });

        if (this.primengTableHelperEntityChanges.shouldResetPaging(event)) {
            this.paginatorEntityChanges.changePage(0);
            return;
        }

        this.primengTableHelperEntityChanges.showLoadingIndicator();

        this._auditLogService.getEntityChanges(
            moment(this.dateRange[0]),
            moment(this.dateRange[1]),
            this.usernameEntityChange,
            this.entityTypeFullName,
            this.primengTableHelperEntityChanges.getSorting(this.dataTableEntityChanges),
            this.primengTableHelperEntityChanges.getMaxResultCount(this.paginatorEntityChanges, event),
            this.primengTableHelperEntityChanges.getSkipCount(this.paginatorEntityChanges, event)
        ).subscribe((result) => {
            this.primengTableHelperEntityChanges.totalRecordsCount = result.totalCount;
            this.primengTableHelperEntityChanges.records = result.items;
            this.primengTableHelperEntityChanges.hideLoadingIndicator();
        });
    }

    exportToExcelAuditLogs(): void {
        const self = this;
        self._auditLogService.getAuditLogsToExcel(
            moment(self.dateRange[0]),
            moment(self.dateRange[1]),
            self.usernameAuditLog,
            self.serviceName,
            self.methodName,
            self.browserInfo,
            self.hasException,
            self.minExecutionDuration,
            self.maxExecutionDuration,
            undefined,
            1,
            0)
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }

    exportToExcelEntityChanges(): void {
        const self = this;
        self._auditLogService.getEntityChangesToExcel(
            moment(self.dateRange[0]),
            moment(self.dateRange[1]),
            self.usernameEntityChange,
            self.entityTypeFullName,
            undefined,
            1,
            0)
            .subscribe(result => {
                self._fileDownloadService.downloadTempFile(result);
            });
    }

    truncateStringWithPostfix(text: string, length: number): string {
        return abp.utils.truncateStringWithPostfix(text, length);
    }
}
