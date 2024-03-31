import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'app-create-card-modal',
  templateUrl: './create-card-modal.component.html',
  styleUrls: ['./create-card-modal.component.css']
})
export class CreateCardModalComponent extends AppComponentBase {

  active = false;
  saving = false;
  constructor(
    injector: Injector,
  ) { 
    super(injector);
  }

  ngOnInit() {
  }

  show(){
    const self = this;
    self.active= true;
  }

  save(){

  }

  close(){
    
  }
}
