import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatChipsModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';

const modules = [
  MatIconModule,
  MatCardModule,
  MatSortModule,
  MatChipsModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class MaterialModule {}
