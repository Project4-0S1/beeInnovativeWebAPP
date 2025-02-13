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

  @Input() isVisible = false;
  @Input() isAddNew = false;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  beehives$: Observable<Beehive[]> = new Observable<Beehive[]>();

  formBeehive$: Observable<Beehive> = new Observable<Beehive>();


  constructor(private b: BeehiveService) {
  
  }

  ngOnInit(): void{
    this.beehives$ = this.b.getFilteredBeehieves(true);
  }


  formData = {
    name: '',
    beehiveId: '',
    latitude:'',
    longitude: '',
    userId: '',
    formIotDevice: '',
    angle: '',
  };

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    this.submitForm.emit(this.formData);
    this.closeModal();
  }
}
