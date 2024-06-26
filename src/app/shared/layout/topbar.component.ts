import { Injector, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ChangeUserLanguageDto, LinkedUserDto, ProfileServiceProxy, ProjectCreateDto, ProjectDto, ProjectServiceProxy, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { EIDRM } from 'constants';
import { CreateProjectModelComponent } from '@app/admin/project/create-project-model/create-project-model.component';

@Component({
    templateUrl: './topbar.component.html',
    selector: 'topbar',
    encapsulation: ViewEncapsulation.None
})
export class TopBarComponent extends AppComponentBase implements OnInit {

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;
    shownLoginName = '';
    tenancyName = '';
    userName = '';
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-' + this.currentTheme.baseSettings.menu.asideSkin + '.svg';
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;
    projectlist:ProjectDto[];
    currentProject:ProjectDto;
    projectCreateDto:ProjectCreateDto = new ProjectCreateDto();



    constructor(
        injector: Injector,
        private _abpSessionService: AbpSessionService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userLinkServiceProxy: UserLinkServiceProxy,
        private _authService: AppAuthService,
        private _impersonationService: ImpersonationService,
        private _linkedAccountService: LinkedAccountService,
        private _projectServiceProxy:ProjectServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;
        this.languages = _.filter(this.localization.languages, l => (l).isDisabled === false);

        this.currentLanguage = this.localization.currentLanguage;
        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;
        this.projectinit();
        this.setCurrentLoginInformations();
        this.getProfilePicture();
        this.getRecentlyLinkedUsers();
        this.registerToEvents();
    }

    projectinit():void{
        this._projectServiceProxy.getList().subscribe(result=>{
            this.projectlist = result;
            if(abp.utils.getCookieValue("Abp.ProjectId")!=null)
            {
                var project = this.projectlist.find(e=>e.id==abp.utils.getCookieValue("Abp.ProjectId"));
                if(project!=null)
                {
                this.currentProject = project;
                }
                else
                {
                    abp.utils.deleteCookie("Abp.ProjectId");
                }
            }
        });
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });

        abp.event.on('app.getRecentlyLinkedUsers', () => {
            this.getRecentlyLinkedUsers();
        });

        abp.event.on('app.cleanProjected',()=>{
            this.cleanProject();
        })

        abp.event.on('app.onMySettingsModalSaved', () => {
            this.onMySettingsModalSaved();
        });
        abp.event.on('app.show.projectcreated',()=>{
            this.projectinit();
        });
    }

    changeProject(id:string):void{
        this.currentProject = this.projectlist.find(e=>e.id==id);
        abp.utils.setCookieValue('Abp.ProjectId',this.currentProject.id, new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
        abp.appPath);
        window.location.reload();
    }

    updateProject(id:string):void{
        abp.event.trigger('app.show.projectupdateModal',id);
    }

    cleanProject():void{
        this.currentProject = null;
        abp.utils.deleteCookie('Abp.ProjectId',abp.appPath);
        window.location.reload();
    }

    createProject():void{
        abp.event.trigger('app.show.projectcreateModal');
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
                abp.appPath
            );

            window.location.reload();
        });
    }

    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this._abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getRecentlyLinkedUsers(): void {
        this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
            this.recentlyLinkedUsers = result.items;
        });
    }


    showLoginAttempts(): void {
        abp.event.trigger('app.show.loginAttemptsModal');
    }

    showLinkedAccounts(): void {
        abp.event.trigger('app.show.linkedAccountsModal');
    }

    changePassword(): void {
        abp.event.trigger('app.show.changePasswordModal');
    }

    changeProfilePicture(): void {
        abp.event.trigger('app.show.changeProfilePictureModal');
    }

    changeMySettings(): void {
        abp.event.trigger('app.show.mySettingsModal');
    }

    logout(): void {
        this._authService.logout();
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    switchToLinkedUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    get chatEnabled(): boolean {
        return (!this._abpSessionService.tenantId || this.feature.isEnabled('App.ChatFeature'));
    }

    downloadCollectedData(): void {
        this._profileServiceProxy.prepareCollectedData().subscribe(() => {
            this.message.success(this.l('GdprDataPrepareStartedNotification'));
        });
    }
}
