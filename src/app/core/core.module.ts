import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {
  MatButtonModule, MatIconModule, MatIconRegistry, MatListModule, MatSidenavModule,
  MatSlideToggleModule, MatToolbarModule
} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {loadSvgResources} from './utils/loadSvgResources';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatListModule,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatToolbarModule,
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parent: CoreModule, ir: MatIconRegistry, dr: DomSanitizer) {
    if (parent) {
      throw new Error('Core module already instantiated!');
    }
    // load all svg icons into the project
    loadSvgResources(ir, dr);
  }
}
