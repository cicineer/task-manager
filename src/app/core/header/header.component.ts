import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggle = new EventEmitter();
  @Output() toggleDarkTheme = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  openSideBar() {
    this.toggle.emit();
  }

  onChange(checked) {
    this.toggleDarkTheme.emit(checked);
  }

  logout() {

  }

}
