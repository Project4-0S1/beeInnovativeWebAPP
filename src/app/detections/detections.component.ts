import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DetectionService } from '../services/detection.service';
import { HornetDetection } from '../interfaces/HornetDetection';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Beehive } from '../interfaces/beehive';
import { BeehiveService } from '../services/beehive.service';

@Component({
  selector: 'app-detections',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  templateUrl: './detections.component.html',
  styleUrl: './detections.component.css'
})
export class DetectionsComponent implements OnInit {
  detections!: Observable<HornetDetection[]>;
  errorMessage: string = '';
  beehiveId?: number;
  beehive?: Beehive;

  constructor(
    private detectionService: DetectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.beehiveId = +params.get('beehiveId')!;
    });
    this.getDetections();
  }

  getDetections() {
    this.detections = this.detectionService.getDetections(this.beehiveId);
  }

  add() {
    this.router.navigate(['/add', this.beehiveId], { state: { mode: 'add' } })
  }

  delete(id: number) {
    this.detectionService.deleteDetection(id).subscribe({
      next: (v) => this.getDetections(),
      error: (e) => this.errorMessage = e.message
    })
  }
}
