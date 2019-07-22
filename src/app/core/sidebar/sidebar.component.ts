import {Component, OnInit} from '@angular/core';
import * as getDate from 'date-fns/get_date';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  today;

  constructor() {
  }

  ngOnInit() {
    this.today = `day${getDate(new Date())}`;
  }

}
