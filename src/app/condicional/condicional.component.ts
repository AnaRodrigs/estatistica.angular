import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Consulta {
  id: number;
  sucessosA: number;
  tentativasA: number;
  sucessosB: number;
  tentativasB: number;
  probabilidadeCondicional: number;
}

@Component({
  selector: 'app-condicional',
  templateUrl: './condicional.component.html',
  styleUrls: ['./condicional.component.css']
})
export class CondicionalComponent implements OnInit {
  sucessosA: number | null = null;
  tentativasA: number | null = null;
  sucessosB: number | null = null;
  tentativasB: number | null = null;
  probabilidadeCondicional: number | null = null;
  consultasAnteriores: Consulta[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarConsultas();
  }

  calcularProbabilidadeCondicional(): void {
    if (this.sucessosA !== null && this.tentativasA !== null && this.sucessosB !== null && this.tentativasB !== null && this.tentativasA > 0 && this.tentativasB > 0) {
      const probabilidadeA = this.sucessosA / this.tentativasA;
      const probabilidadeB = this.sucessosB / this.tentativasB;
      this.probabilidadeCondicional = (probabilidadeA * probabilidadeB) / probabilidadeA;
      this.adicionarConsulta();
    } else {
      this.probabilidadeCondicional = null;
    }
  }

  adicionarConsulta(): void {
    if (this.sucessosA !== null && this.tentativasA !== null && this.sucessosB !== null && this.tentativasB !== null && this.probabilidadeCondicional !== null) {
      const novaConsulta: Consulta = {
        id: Date.now(),
        sucessosA: this.sucessosA,
        tentativasA: this.tentativasA,
        sucessosB: this.sucessosB,
        tentativasB: this.tentativasB,
        probabilidadeCondicional: this.probabilidadeCondicional
      };
      this.http.post('http://localhost:3001/condicional', novaConsulta)
        .subscribe(() => {
          this.consultasAnteriores.unshift(novaConsulta);
        });
    }
  }

  carregarConsultas(): void {
    this.http.get<any>('http://localhost:3001/condicional')
      .subscribe((consultas: Consulta[]) => {
        this.consultasAnteriores = consultas;
      });
  }
  

deletarConsulta(id: number): void {
  this.http.delete(`http://localhost:3001/condicional/${id}`)
    .subscribe(() => {
      this.consultasAnteriores = this.consultasAnteriores.filter(consulta => consulta.id !== id);
    });
}
}