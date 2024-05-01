import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/auth-model';


@Component({
  selector: 'app-side-nav-content',
  templateUrl: './side-nav-content.component.html',
  styleUrls: ['./side-nav-content.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavContentComponent implements OnInit {

  // accountService = inject(AccountService);
  user?: User;
  
  navItems = [
    { label: 'Login', route: '/apps'},
    { label: 'Logout', route: '/'},
    { label: 'Become a partner', route: '/become-a-partner'},
    { label: 'Orders', route: '/orders'},
    { label: 'Profile', route: '/profile'}
  ];
  

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Fetching logged in customer...')
   
  }

  onNavigationSelection(navItem: any) {
    this.router.navigate([navItem.route]);
  }

  logout(){
    // this.accountService.logout();
  }
}