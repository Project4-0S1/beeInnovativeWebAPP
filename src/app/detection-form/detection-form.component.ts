import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EstimatedNestLocations } from '../interfaces/estimatedNestLocations';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimatedNestLocationService } from '../services/estimated-nest-location.service';
import { CalculationService } from '../services/calculation.service';
import { Calculation } from '../interfaces/calculation';


@Component({
  selector: 'app-detection-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detection-form.component.html',
  styleUrl: './detection-form.component.css'
})
export class DetectionFormComponent implements OnInit {
  options: any = {};
  isSubmitted: boolean = false;
  errorMessage: string = "";

  calculation: Calculation = { id: 0, beehiveId: 0, TimeBetween: 0, Direction: 0};

  constructor(
    private router: Router,
    private calculationService: CalculationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.calculation.beehiveId = +params.get('beehiveId')!;
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.calculationService.postNewCalculation(this.calculation).subscribe({
      next: (v) => this.router.navigateByUrl("/"),
      error: (e) => this.errorMessage = e.message
    });
  }
}
