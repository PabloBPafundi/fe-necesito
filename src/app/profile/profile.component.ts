import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, User, Edit } from 'lucide-angular';
NgFor
@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  readonly User = User;
  readonly Edit = Edit;


ngOnInit(): void {
 

}




  user = {
    name: 'Juan',
    lasName: ' Pérez',
    lastLocation: 'CABA',
    email: 'juan.perez@example.com'
  };

  
}  



