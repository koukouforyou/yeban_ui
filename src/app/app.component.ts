import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { SubscriptionStartType } from '@shared/service-proxies/service-proxies';
import { ChatSignalrService } from 'app/shared/layout/chat/chat-signalr.service';
import * as moment from 'moment';
import { AppComponentBase } from 'shared/common/app-component-base';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { NotificationSettingsModalComponent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
import { CreateProjectModelComponent } from './admin/project/create-project-model/create-project-model.component';
import { UpdateProjectModelComponent } from './admin/project/update-project-model/update-project-model.component';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {

    subscriptionStartType = SubscriptionStartType;
    theme: string;
    installationMode = true;

    @ViewChild('loginAttemptsModal', { read: LoginAttemptsModalComponent, static: false }) loginAttemptsModal: LoginAttemptsModalComponent;
    @ViewChild('linkedAccountsModal', { read: LinkedAccountsModalComponent, static: false }) linkedAccountsModal: LinkedAccountsModalComponent;
    @ViewChild('changePasswordModal', { read: ChangePasswordModalComponent,static: false }) changePasswordModal: ChangePasswordModalComponent;
    @ViewChild('changeProfilePictureModal', { read: ChangeProfilePictureModalComponent,static: false }) changeProfilePictureModal: ChangeProfilePictureModalComponent;
    @ViewChild('mySettingsModal', { read: MySettingsModalComponent, static: false }) mySettingsModal: MySettingsModalComponent;
    @ViewChild('notificationSettingsModal', { read: NotificationSettingsModalComponent, static: false }) notificationSettingsModal: NotificationSettingsModalComponent;
    @ViewChild('chatBarComponent', { static: false }) chatBarComponent;
    @ViewChild('createProjectModal',{read:CreateProjectModelComponent,static:false}) createProjectModal:CreateProjectModelComponent;
    @ViewChild('updateProjectModal',{read:UpdateProjectModelComponent,static:false}) updateProjectModal:UpdateProjectModelComponent;

    public constructor(
        injector: Injector,
        private _chatSignalrService: ChatSignalrService,
        private _userNotificationHelper: UserNotificationHelper
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._userNotificationHelper.settingsModal = this.notificationSettingsModal;
        this.theme = abp.setting.get('App.UiManagement.Theme').toLocaleLowerCase();
        this.installationMode = UrlHelper.isInstallUrl(location.href);

        this.registerModalOpenEvents();

        if (this.appSession.application) {
            SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
        }
    }

    ngAfterViewInit(): void {
        abp.signalr.autoConnect = false;
    }

    subscriptionStatusBarVisible(): boolean {
        return this.appSession.tenantId > 0 &&
            (this.appSession.tenant.isInTrialPeriod ||
                this.subscriptionIsExpiringSoon());
    }

    subscriptionIsExpiringSoon(): boolean {
        if (this.appSession.tenant.subscriptionEndDateUtc) {
            return moment().utc().add(AppConsts.subscriptionExpireNootifyDayCount, 'days') >= moment(this.appSession.tenant.subscriptionEndDateUtc);
        }

        return false;
    }

    registerModalOpenEvents(): void {
        abp.event.on('app.show.loginAttemptsModal', () => {
            this.loginAttemptsModal.show();
        });

        abp.event.on('app.show.linkedAccountsModal', () => {
            this.linkedAccountsModal.show();
        });

        abp.event.on('app.show.changePasswordModal', () => {
            this.changePasswordModal.show();
        });

        abp.event.on('app.show.changeProfilePictureModal', () => {
            this.changeProfilePictureModal.show();
        });

        abp.event.on('app.show.mySettingsModal', () => {
            this.mySettingsModal.show();
        });
        abp.event.on('app.show.projectcreateModal',()=>{
            this.createProjectModal.show();
        });
        abp.event.on("app.show.projectupdateModal",(id)=>{
            this.updateProjectModal.show(id);
        })
    }

    getRecentlyLinkedUsers(): void {
        abp.event.trigger('app.getRecentlyLinkedUsers');
    }

    onMySettingsModalSaved(): void {
        abp.event.trigger('app.onMySettingsModalSaved');
    }
}
