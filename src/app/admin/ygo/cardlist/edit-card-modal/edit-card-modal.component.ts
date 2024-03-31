import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { YGOServiceProxy, YGOCardPictureServiceProxy, YGO_Card_ImageDto, Languages, YGO_CardPicture, YGO_Card_ImageCreateByUrlDto, YGO_Card_ImageUpdateByUrlDto } from 'shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UtilsService } from '@shared/service-proxies/service-utils';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Console } from 'console';
import { result } from 'lodash';

@Component({
    selector: 'app-edit-card-modal',
    templateUrl: './edit-card-modal.component.html',
    styleUrls: ['./edit-card-modal.component.css']
})
export class EditCardModalComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective, static: false }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    card_img_dto: YGO_Card_ImageDto;
    ygocard_ch: YGO_CardPicture[];
    ygocard_jp: YGO_CardPicture[];
    ygocard_en: YGO_CardPicture[];
    id: string;
    active = false;
    saving = false;
    CreateImgDto: YGO_Card_ImageCreateByUrlDto;
    UpdateImgDto: YGO_Card_ImageUpdateByUrlDto;
    public app;
    constructor(
        injector: Injector,
        private _YGOServiceProxy: YGOServiceProxy,
        private _YGOCardPictureServiceProxy: YGOCardPictureServiceProxy,
        private utilsService: UtilsService,
        private http: HttpClient,
    ) {
        super(injector);
        this.CreateImgDto = new YGO_Card_ImageCreateByUrlDto();
        this.UpdateImgDto = new YGO_Card_ImageUpdateByUrlDto();
        this.utilsService.getAppData().subscribe(res => {
            this.app = res;
        });
    }

    show(id: string): void {
        this.id = id;
        this.active = true;
        //this.toggleSubscriptionFields();
        this.modal.show();
        this.getCard();
    }

    getCard(): void {
        this._YGOServiceProxy.getYGO_Card_ImageByCardId(this.id).subscribe(result => {
            this.card_img_dto = result;
            this.ygocard_ch = result.items.filter(e => e.languageId === 2);
            this.ygocard_en = result.items.filter(e => e.languageId === 1);
            this.ygocard_jp = result.items.filter(e => e.languageId === 4);
        });
    }

    onShown(): void {


    }

    getImageUrl(language: Languages): YGO_CardPicture[] {
        let result = this.card_img_dto.items.filter(e => e.languageId === language);
        return result;
    }

    getFirstImageUrl(list: YGO_CardPicture[]): string {
        if (list.length > 0) {
            return 'http://res.bamanna.com/' + list[0].ygO_CardPictureUrl;
        } else {
            return null;
        }
    }

    changePic(event: any, languageId: Languages): void {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('File', file, file.name);
        if (languageId === Languages.ZhCN) {
            if (this.ygocard_ch != null && this.ygocard_ch.length > 0) {
                formData.append('Id', this.ygocard_ch[0].id);
            }
        } else if (languageId === Languages.JaJp) {
            if (this.ygocard_jp != null && this.ygocard_jp.length > 0) {
                formData.append('Id', this.ygocard_jp[0].id);
            }
        } else if (languageId === Languages.En) {
            if (this.ygocard_en != null && this.ygocard_en.length > 0) {
                formData.append('Id', this.ygocard_en[0].id);
            }
        } else {

        }
        this.http.post('http://localhost:5000/api/services/app/YGOCardPicture/YGOCardPictureUpdate', formData)
            .pipe()
            .subscribe((result) => {
                this.getCard();
            });
    }

    createPic(event: any, ygocardNo: string, languageId: Languages): void {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('File', file, file.name);
        formData.append('YGO_CardNo', ygocardNo);
        formData.append('LanguageId', languageId.toString());
        console.log(this.appUrlService.appRootUrl);
        this.http.post('http://localhost:5000/api/services/app/YGOCardPicture/YGOCardPictureCreate', formData)
            .pipe()
            .subscribe((result) => {
                this.getCard();
            });
    }

    createPicByUrl(languageId: Languages) {
        this.CreateImgDto.languageId = languageId;
        this.CreateImgDto.ygO_CardNo = this.card_img_dto.yGO_Card.ygO_CardNo;
        this._YGOCardPictureServiceProxy.yGOCardPictureCreateByUrl(this.CreateImgDto).subscribe(result => {
            this.CreateImgDto.fileUrl = null;
            this.getCard();
        });
    }

    updatePicByUrl(languageId: Languages) {
        if (languageId === Languages.ZhCN) {
            if (this.ygocard_ch != null && this.ygocard_ch.length > 0) {
                this.UpdateImgDto.id = this.ygocard_ch[0].id;
            }
        } else if (languageId === Languages.JaJp) {
            if (this.ygocard_jp != null && this.ygocard_jp.length > 0) {
                this.UpdateImgDto.id = this.ygocard_jp[0].id;
            }
        } else if (languageId === Languages.En) {
            if (this.ygocard_en != null && this.ygocard_en.length > 0) {
                this.UpdateImgDto.id = this.ygocard_en[0].id;
            }
        } else {

        }
        this._YGOCardPictureServiceProxy.yGOCardPictureUpdateByUrl(this.UpdateImgDto).subscribe(result => {
            this.UpdateImgDto.fileUrl = null;
            this.getCard();
        });
    }

    save() {
        this._YGOServiceProxy.update(this.card_img_dto.yGO_Card).pipe(finalize(() => { this.saving = false; })).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    init(): void {

    }
}
