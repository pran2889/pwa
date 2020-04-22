import { Component, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-medium-modal',
  templateUrl: './medium-modal.component.html',
  styleUrls: ['./medium-modal.component.scss']
})
export class MediumModalComponent {
  @ViewChild('mediumModal') public mediumModal: ModalDirective;
  @Input() title: string;
  constructor() {}
  show() {
    this.mediumModal.show();
  }
  hide() {
    this.mediumModal.hide();
  }
}
