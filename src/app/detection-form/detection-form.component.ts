import { Component } from '@angular/core';

@Component({
  selector: 'app-detection-form',
  standalone: true,
  imports: [],
  templateUrl: './detection-form.component.html',
  styleUrl: './detection-form.component.css'
})
export class DetectionFormComponent {
  errorMessage: string = '';
}
