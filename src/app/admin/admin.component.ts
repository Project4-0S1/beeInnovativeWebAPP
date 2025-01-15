import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Beehive } from '../beehive';
import { BeehiveService } from '../beehive.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  beehive!: Beehive

  constructor(private beehiveService:BeehiveService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // const beehiveId = this.route.snapshot.paramMap.get('id');
    const beehiveId = 1;
    if (beehiveId != null) {
      this.beehiveService.getBeehiveById(+beehiveId).subscribe(result => 
        this.beehive = result);
    }
  }
}
