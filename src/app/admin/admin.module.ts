import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AddMemberModalComponent } from 'app/admin/organization-units/add-member-modal.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule, PopoverModule, TabsModule, TooltipModule, BsDropdownModule } from 'ngx-bootstrap';
import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AutoCompleteModule, CheckboxModule, DropdownModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, InputSwitchModule, PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { TreeDragDropService } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { DemoUiDateTimeComponent } from './demo-ui-components/demo-ui-date-time.component';
import { DemoUiEditorComponent } from './demo-ui-components/demo-ui-editor.component';
import { DemoUiFileUploadComponent } from './demo-ui-components/demo-ui-file-upload.component';
import { DemoUiInputMaskComponent } from './demo-ui-components/demo-ui-input-mask.component';
import { DemoUiSelectionComponent } from './demo-ui-components/demo-ui-selection.component';
import { CreateEditionModalComponent } from './editions/create-edition-modal.component';
import { EditEditionModalComponent } from './editions/edit-edition-modal.component';
import { MoveTenantsToAnotherEditionModalComponent } from './editions/move-tenants-to-another-edition-modal.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { EditionComboComponent } from './shared/edition-combo.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';
import { PermissionComboComponent } from './shared/permission-combo.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { DefaultThemeUiSettingsComponent } from './ui-customization/default-theme-ui-settings.component';
import { Theme8ThemeUiSettingsComponent } from './ui-customization/theme8-theme-ui-settings.component';
import { Theme2ThemeUiSettingsComponent } from './ui-customization/theme2-theme-ui-settings.component';
import { Theme11ThemeUiSettingsComponent } from './ui-customization/theme11-theme-ui-settings.component';
import { Theme3ThemeUiSettingsComponent } from './ui-customization/theme3-theme-ui-settings.component';
import { Theme6ThemeUiSettingsComponent } from './ui-customization/theme6-theme-ui-settings.component';
import { Theme7ThemeUiSettingsComponent } from './ui-customization/theme7-theme-ui-settings.component';
import { Theme10ThemeUiSettingsComponent } from './ui-customization/theme10-theme-ui-settings.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { ImpersonationService } from './users/impersonation.service';
import { UsersComponent } from './users/users.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountoModule } from 'angular2-counto';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { YgoComponent } from './ygo/ygo.component';
import { CardlistComponent } from './ygo/cardlist/cardlist.component';
import { MatTableModule } from '@angular/material/table';
import { CreateCardModalComponent } from './ygo/cardlist/create-card-modal/create-card-modal.component';
import { EditCardModalComponent } from './ygo/cardlist/edit-card-modal/edit-card-modal.component';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { CardviewComponent } from './ygo/cardlist/cardview/cardview.component';
import { HumanlistComponent } from './human/humans/humanlist/humanlist.component';
import { CreateHumanModalComponent } from './human/humans/create-human-modal/create-human-modal.component';
import { EditHumanModalComponent } from './human/humans/edit-human-modal/edit-human-modal.component';
import { HumangroupstreeComponent } from './human/humangroups/humangroupstree/humangroupstree.component';
import { HumangroupdetailComponent } from './human/humangroups/humangroupdetail/humangroupdetail.component';
import { HumanrelationlistComponent } from './human/humanrelations/humanrelationlist/humanrelationlist.component';
import { CreateHumanrelationModalComponent } from './human/humanrelations/create-humanrelation-modal/create-humanrelation-modal.component';
import { UpdateHumanrelationModalComponent } from './human/humanrelations/update-humanrelation-modal/update-humanrelation-modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HumangroupsComponent } from './human/humangroups/humangroups.component';
import { HumanrelationdetailComponent } from './human/humanrelations/humanrelationdetail/humanrelationdetail.component';
import { CreateHumangroupModalComponent } from './human/humangroups/create-humangroup-modal/create-humangroup-modal.component';
import { EditHumangroupModalComponent } from './human/humangroups/edit-humangroup-modal/edit-humangroup-modal.component';
import { CreateHumangrouprelationModalComponent } from './human/humangroups/humangroupdetail/create-humangrouprelation-modal/create-humangrouprelation-modal.component';
import { ProjectListModelComponent } from './project/project-list-model/project-list-model.component';
import { CreateProjectModelComponent } from './project/create-project-model/create-project-model.component';
import { UpdateProjectModelComponent } from './project/update-project-model/update-project-model.component';
import { UpdateProjectBindModalComponent } from './human/humans/update-project-bind-modal/update-project-bind-modal.component';
import { TenantLinkModelComponent } from './tenants/tenant-link-model/tenant-link-model.component';
import { CreateTenantRelationModalComponent } from './tenants/tenant-link-model/create-tenant-relation-modal/create-tenant-relation-modal.component';
import { HumanviewComponent } from './human/humanrelations/humanview/humanview.component';
import { BindHumanrelationModalComponent } from './human/humanrelations/bind-humanrelation-modal/bind-humanrelation-modal.component';
import { EditHumanHeadpicModalComponent } from './human/humans/edit-human-modal/edit-human-headpic-modal/edit-human-headpic-modal.component';
import { UpdateAllHumanProjectBindModalComponent } from './human/humans/update-all-human-project-bind-modal/update-all-human-project-bind-modal.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HumanViewSettingModalComponent } from './human/humanrelations/humanview/human-view-setting-modal/human-view-setting-modal/human-view-setting-modal.component';
import {SidebarModule} from 'primeng/sidebar';
import {SliderModule} from 'primeng/slider';
import { HumanViewContentmenuComponent } from './human/humanrelations/humanview/human-view-contentmenu/human-view-contentmenu.component';
import { EditHumanProjectMapModalComponent } from './human/humanrelations/humanrelationlist/edit-human-project-map-modal/edit-human-project-map-modal.component';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        TreeModule,
        DragDropModule,
        ContextMenuModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        NgxChartsModule,
        CountoModule,
        TextMaskModule,
        ImageCropperModule,
        PinchZoomModule,
        CommonModule,
        InputSwitchModule,
        DropdownModule,
        CheckboxModule,
        SelectButtonModule,
        SidebarModule,
        SliderModule
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        OrganizationUnitsTreeComponent,
        RolesComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
        HostSettingsComponent,
        InstallComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateEditionModalComponent,
        EditEditionModalComponent,
        MoveTenantsToAnotherEditionModalComponent,
        LanguagesComponent,
        LanguageTextsComponent,
        CreateOrEditLanguageModalComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        CreateOrEditLanguageModalComponent,
        EditTextModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        InvoiceComponent,
        SubscriptionManagementComponent,
        AddMemberModalComponent,
        DemoUiComponentsComponent,
        DemoUiDateTimeComponent,
        DemoUiSelectionComponent,
        DemoUiFileUploadComponent,
        DemoUiInputMaskComponent,
        DemoUiEditorComponent,
        UiCustomizationComponent,
        DefaultThemeUiSettingsComponent,
        Theme8ThemeUiSettingsComponent,
        Theme2ThemeUiSettingsComponent,
        Theme3ThemeUiSettingsComponent,
        Theme6ThemeUiSettingsComponent,
        Theme7ThemeUiSettingsComponent,
        Theme10ThemeUiSettingsComponent,
        Theme11ThemeUiSettingsComponent,
        YgoComponent,
        CardlistComponent,
        CreateCardModalComponent,
        EditCardModalComponent,
        CardviewComponent,
        HumanlistComponent,
        CreateHumanModalComponent,
        EditHumanModalComponent,
        HumangroupstreeComponent,
        HumangroupdetailComponent,
        HumanrelationlistComponent,
        CreateHumanrelationModalComponent,
        UpdateHumanrelationModalComponent,
        HumangroupsComponent,
        HumanrelationdetailComponent,
        CreateHumangroupModalComponent,
        EditHumangroupModalComponent,
        CreateHumangrouprelationModalComponent,
        ProjectListModelComponent,
        UpdateProjectBindModalComponent,
        TenantLinkModelComponent,
        CreateTenantRelationModalComponent,
        HumanviewComponent,
        BindHumanrelationModalComponent,
        EditHumanHeadpicModalComponent,
        UpdateAllHumanProjectBindModalComponent,
        HumanViewSettingModalComponent,
        HumanViewContentmenuComponent,
        EditHumanProjectMapModalComponent,
    ],
    exports: [
        AddMemberModalComponent
    ],
    providers: [
        ImpersonationService,
        TreeDragDropService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale },
    ],
})
export class AdminModule { }
