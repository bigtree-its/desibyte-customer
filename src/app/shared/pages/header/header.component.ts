import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  

  navigationService = inject(NavigationService);
  
  toggleSideNav() {
    this.navigationService.setShowNav(true);
  }

  faBars = faBars;
}
