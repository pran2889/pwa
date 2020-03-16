import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';
import { ModalModule } from 'ngx-bootstrap';
import { MediumModalComponent } from './components/modals/medium-modal/medium-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ModalModule.forRoot(),
    MaterialModule,
    ],
  declarations: [
    MediumModalComponent,
  ],
  exports: [
    MediumModalComponent]
})
export class SharedModule { }
