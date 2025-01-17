import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Beehive } from '../interfaces/beehive';
import { BeehiveService } from '../services/beehive.service';
import { CommonModule } from '@angular/common';
import { UserBeehive } from '../interfaces/user-beehive';
import { UserBeehiveService } from '../services/user-beehive.service';

@Component({
  selector: 'app-beehive-crud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beehive-crud.component.html',
  styleUrl: './beehive-crud.component.css'
})
export class BeehiveCrudComponent implements OnInit {
  beehives$: Observable<UserBeehive[]> = new Observable<UserBeehive[]>();

  constructor(private ub: UserBeehiveService) {}

  ngOnInit(): void{
    this.beehives$ = this.ub.getAll();
  }
}
