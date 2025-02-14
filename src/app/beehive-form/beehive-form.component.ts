import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Beehive } from '../interfaces/beehive';
import { BeehiveService } from '../services/beehive.service';
import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-beehive-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './beehive-form.component.html',
  styleUrl: './beehive-form.component.css'
})
export class BeehiveFormComponent {

  @Input() isVisible = false; // Input property to control the visibility of the form
  @Input() isAddNew = false; // Input property to determine if the form is for adding a new beehive
  @Output() close = new EventEmitter<void>(); // Output event to notify when the form is closed
  @Output() submitForm = new EventEmitter<any>(); // Output event to emit the form data when submitted

  // Observable to hold the list of beehives fetched from the service
  beehives$: Observable<Beehive[]> = new Observable<Beehive[]>();

  // Observable to hold the data of a specific beehive (not used in the current code)
  formBeehive$: Observable<Beehive> = new Observable<Beehive>();

  // Constructor that injects the BeehiveService to interact with beehive data
  constructor(private b: BeehiveService) {
  
  }

  // Lifecycle hook that is called after the component is initialized
  ngOnInit(): void {
    // Fetches filtered beehives from the service and assigns it to the beehives$ observable
    this.beehives$ = this.b.getFilteredBeehieves(true);
  }

  // Object to hold the form data for the beehive
  formData = {
    name: '',
    beehiveId: '',
    latitude: '',
    longitude: '',
    userId: '',
    formIotDevice: '',
    angle: '',
  };

  // Method to close the modal and emit the close event
  closeModal() {
    this.close.emit(); // Emit the close event to notify parent component
  }

  // Method to handle form submission
  onSubmit() {
    this.submitForm.emit(this.formData); // Emit the form data to the parent component
    this.closeModal(); // Close the modal after submission
  }

  refresh(){
    this.beehives$ = this.b.getFilteredBeehieves(true);
  }
}
