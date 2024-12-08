import { Component, OnInit, Output } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  
  reservations: Reservation[] = [];
  constructor(private reservationService: ReservationService, private activatedRoute: ActivatedRoute, private router: Router  ) {}

  ngOnInit():void {
    this.reservationService.getReservations().subscribe(res => {
      this.reservations = res
    });
  }

  deleteReservation(id: string){
    this.reservationService.deleteReservation(id).subscribe(res => {
      console.log(res)
    });
  }

}
