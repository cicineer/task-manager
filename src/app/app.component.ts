import {Component} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkTheme = false;

  constructor(private overlayContainer: OverlayContainer) {
  }

  switchTheme(dark) {
    this.darkTheme = dark;
    this.darkTheme ?
      this.overlayContainer.getContainerElement().classList.add('myapp-dark-theme') :
      this.overlayContainer.getContainerElement().classList.remove('myapp-dark-theme');
  }
}
