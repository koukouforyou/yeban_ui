import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { YGO_CardPicture } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.css']
})
export class CardviewComponent extends AppComponentBase {

    @ViewChild('editModal', { read: ModalDirective,static: false}) modal: ModalDirective;
  active = false;
  pic: YGO_CardPicture;
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  onShown() {

  }

  show(pic: YGO_CardPicture): void {
    this.modal.show();
    this.active = true;
    this.pic = pic;
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
