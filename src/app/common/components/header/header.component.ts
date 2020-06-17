import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  registrationActive: boolean;
  @ViewChild('collapseButton', {static: false}) collapseButton: ElementRef;
  @ViewChild('collapsedContent', {static: false}) collapsedContent: ElementRef;
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateRegister(pagetype: string) {
    this.registrationActive = true;
    this.updateCollpseBtnStatus(true);
    let navigationPath = '/teacher-reg';
    if (pagetype === 'mentor') {
      navigationPath = '/mentor-reg'
    }
    this.router.navigate([navigationPath]);
  }

  navigateLogin() {
    this.registrationActive = false;
    this.updateCollpseBtnStatus(true);
    this.router.navigate(['/login']);
  }

  updateCollpseBtnStatus(status: boolean) {
    if (this.collapsedContent.nativeElement.classList.contains('show')) {
      this.collapseButton.nativeElement.click();
    }
  }

}
