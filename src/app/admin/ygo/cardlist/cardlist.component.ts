import { NgModule, Component, ElementRef, Injector, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { YGOServiceProxy, YGO_Card, YGO_CardByFilterPagedDto, YGO_CardProperties, YGO_CardUseLimited, YGO_MonsterCardRace, YGO_MonsterCardType, YGO_TrapCardType, YGO_SpellCardType, YGOCardPictureServiceProxy, YGO_CardPicture } from 'shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { UtilsService } from '@shared/service-proxies/service-utils';
import { EditCardModalComponent } from './edit-card-modal/edit-card-modal.component';
import { CreateCardModalComponent } from './create-card-modal/create-card-modal.component';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { CardviewComponent } from './cardview/cardview.component';
import { formatDate } from '@angular/common';
import { now } from 'lodash';


// @NgModule({
//     imports: [ PinchZoomModule ]
// })

@Component({
    animations: [appModuleAnimation()],
    templateUrl: './cardlist.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./cardlist.component.css']
})
export class CardlistComponent extends AppComponentBase implements OnInit {

    @ViewChild('editCardModal', { read: EditCardModalComponent, static: false }) editCardModal: EditCardModalComponent;
    @ViewChild('cardViewModal', { read: CardviewComponent, static: false }) cardViewModal: CardviewComponent;
    @ViewChild('createCardModal', { read: CreateCardModalComponent, static: false }) createCardModal: CreateCardModalComponent;
    @ViewChild('paginator', { read: Paginator, static: true }) paginator: Paginator;
    @ViewChild('dataTable', { read: Table, static: true }) dataTable: Table;

    myString = 123;
    i = 0;
    color = 'yellow';
    pageFilters: {
        searchKey: string;
        advancedFiltersAreShown: boolean;
        ygo_CardProperties: YGO_CardProperties;
        ygo_CardUseLimited: YGO_CardUseLimited;
        ygo_MonsterCardRace: YGO_MonsterCardRace;
        ygo_MonsterCardType: YGO_MonsterCardType;
        ygo_TrapCardType: YGO_TrapCardType;
        ygo_SpellCardType: YGO_SpellCardType;
        isHaveImage: boolean;
    } = <any>{};
    title = 'YGO_CardList';
    pics: YGO_CardPicture[];
    private changeTimes = new Array<Date>();
    public app;
    constructor(
        injector: Injector,
        private _YGOServiceProxy: YGOServiceProxy,
        private _YGOCardPictureServiceProxy: YGOCardPictureServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private utilsService: UtilsService) {
        super(injector);
        this.primengTableHelper = new PrimengTableHelper();
        this.pageFilters.searchKey = '';
        this.pageFilters.advancedFiltersAreShown = false;
        this.pageFilters.isHaveImage = true;
        this.utilsService.getAppData().subscribe(res => {
            this.app = res;
        });
    }
    input = new YGO_CardByFilterPagedDto;

    ngOnInit(): void {

    }

    getList(event?: LazyLoadEvent) {
        var currentTime = new Date();
        this.changeTimes.push(currentTime);
        if (this.changeTimes.length == 1) {
            this.getCards(event);
        }
        else {
            setTimeout(() => {
                if (this.changeTimes[this.changeTimes.length - 1] == currentTime) {
                    this.getCards(event);
                }
            }, 500);
        }
    }

    getCards(event?: LazyLoadEvent){
        this.primengTableHelper.showLoadingIndicator();
        this.input.filter = this.pageFilters.searchKey;
        this.input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this.input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this.input.ygO_CardProperties = this.pageFilters.ygo_CardProperties;
        this.input.ygO_CardUseLimited = this.pageFilters.ygo_CardUseLimited;
        this.input.ygO_MonsterCardRace = this.pageFilters.ygo_MonsterCardRace;
        this.input.ygO_MonsterCardType = this.pageFilters.ygo_MonsterCardType;
        this.input.ygO_SpellCardType = this.pageFilters.ygo_SpellCardType;
        this.input.ygO_TrapCardType = this.pageFilters.ygo_TrapCardType;
        this.input.isHaveImage = this.pageFilters.isHaveImage;
        this._YGOServiceProxy.getYGO_Card_ImageByFilter(
            this.input)
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    editCard(id: string): void {
        this.editCardModal.show(id);
    }

    createCard(): void {
        this.createCardModal.show();
    }

    deleteCard(id: string): void {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._YGOServiceProxy.delete(id)
                        .subscribe(() => {
                            this.getCards();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            });
    }

    getCardPicByCardNoAsync(cardno: string): Observable<YGO_CardPicture[]> {
        return this._YGOCardPictureServiceProxy.getCardPicByCardNo(cardno);
    }

    cardView(pic: YGO_CardPicture): void {
        this.cardViewModal.show(pic);
    }
}
