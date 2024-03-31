import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LayoutRefService } from '@metronic/app/core/services/layout/layout-ref.service';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';
import { MenuAsideOffcanvasDirective } from '@metronic/app/core/directives/menu-aside-offcanvas.directive';
import { Router } from '@angular/router';

@Component({
    templateUrl: './theme6-layout.component.html',
    selector: 'theme6-layout',
    animations: [appModuleAnimation()]
})
export class Theme6LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('mHeader', { read: ElementRef, static: false}) mHeader: ElementRef;
    @ViewChild('mAsideLeft', { read: ElementRef, static: false}) mAsideLeft: ElementRef;
    @HostBinding('attr.mMenuAsideOffcanvas') mMenuAsideOffcanvas: MenuAsideOffcanvasDirective;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-' + this.currentTheme.baseSettings.menu.asideSkin + '.svg';

    constructor(
        injector: Injector,
        private router: Router,
        private layoutRefService: LayoutRefService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.mMenuAsideOffcanvas = new MenuAsideOffcanvasDirective(this.mAsideLeft, this.router);
            this.mMenuAsideOffcanvas.ngAfterViewInit();
        });

        this.layoutRefService.addElement('header', this.mHeader.nativeElement);
    }
}
