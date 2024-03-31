import { Component, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { HumangroupdetailComponent } from './humangroupdetail/humangroupdetail.component';
import { HumangroupstreeComponent } from './humangroupstree/humangroupstree.component';

@Component({
  selector: 'app-humangroups',
  templateUrl: './humangroups.component.html',
  styleUrls: ['./humangroups.component.css'],
  animations: [appModuleAnimation()]
})
export class HumangroupsComponent implements OnInit {

    @ViewChild('groupTree', { read: HumangroupstreeComponent,static: false}) groupTree: HumangroupstreeComponent;
    @ViewChild('humangroupsdetail',{read:HumangroupdetailComponent,static:false}) humangroupsdetail:HumangroupdetailComponent;
  constructor() { }

  ngOnInit() {
  }

}
