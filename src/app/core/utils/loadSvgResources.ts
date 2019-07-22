import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

export function loadSvgResources(ir: MatIconRegistry, dr: DomSanitizer) {
  const imgDir = 'assets/img/';
  const sidebarDir = `${imgDir}sidebar/`;
  const daysDir = `${imgDir}days/`;
  const avatarDir = `${imgDir}avatar/`;
  const iconsDir = `${imgDir}icons/`;
  ir.addSvgIcon('project', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}project.svg`));
  ir.addSvgIcon('projects', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}projects.svg`));
  ir.addSvgIcon('tasks', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}tasks.svg`));
  ir.addSvgIcon('day', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}day.svg`));
  ir.addSvgIcon('week', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}week.svg`));
  ir.addSvgIcon('month', dr.bypassSecurityTrustResourceUrl(`${sidebarDir}month.svg`));
  ir.addSvgIcon('move', dr.bypassSecurityTrustResourceUrl(`${iconsDir}move.svg`));
  ir.addSvgIcon('add', dr.bypassSecurityTrustResourceUrl(`${iconsDir}add.svg`));
  ir.addSvgIcon('delete', dr.bypassSecurityTrustResourceUrl(`${iconsDir}delete.svg`));
  ir.addSvgIconSetInNamespace('avatars', dr.bypassSecurityTrustResourceUrl(`${avatarDir}avatars.svg`));
  ir.addSvgIcon('unassigned', dr.bypassSecurityTrustResourceUrl(`${avatarDir}unassigned.svg`));
  const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
  ];
  days.forEach(d =>
    ir.addSvgIcon(`day${d}`, dr.bypassSecurityTrustResourceUrl(`${daysDir}day${d}.svg`)));
}
