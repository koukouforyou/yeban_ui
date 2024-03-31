import { Component, ElementRef, Injector, NgZone, OnInit, Renderer2 } from '@angular/core';
import { ContextMenu } from 'primeng/primeng';

@Component({
  selector: 'app-human-view-contentmenu',
  templateUrl: './human-view-contentmenu.component.html',
  styleUrls: ['./human-view-contentmenu.component.css']
})
export class HumanViewContentmenuComponent extends ContextMenu implements OnInit {

  constructor(el: ElementRef, renderer: Renderer2, zone: NgZone) {
    super(el,renderer,zone);
  }

  ngOnInit() {
  }

}
