import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  url= "http://localhost:3000/Consultas";
  constructor() { }
}
