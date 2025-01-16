import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Beehive } from '../interfaces/beehive';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [],
  templateUrl: './api.component.html',
  styleUrl: './api.component.css'
})
export class APIComponent {

  beehives$: Observable<Beehive[]> = new Observable<Beehive[]>

  beehive!: Beehive;

  constructor(private beehiveService: ApiService){}

  ngOnInit(): void {
    // const beehiveId = this.route.snapshot.paramMap.get('id');
    const beehiveId = 1;
    if (beehiveId != null) {
      this.beehiveService.getBeehiveById(+beehiveId).subscribe(result => 
        this.beehive = result);
    }
  }

}
