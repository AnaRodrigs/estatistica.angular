import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-probabilidade',
  templateUrl: './probabilidade.component.html',
  styleUrls: ['./probabilidade.component.css']
})
export class ProbabilidadeComponent implements OnInit {
  sucessos: number | null = null;
  tentativas: number | null = null;
  probabilidade: number | null = null;
  consultasAnteriores: { id: number, sucessos: number, tentativas: number, probabilidade: number }[] = [];


  constructor(private http: HttpClient){

  }
  ngOnInit(): void {
    this.carregarConsultas();
  }
  calcularProbabilidade(): void {
    if (this.sucessos !== null && this.tentativas !== null && this.tentativas > 0) {
      this.probabilidade = (this.sucessos / this.tentativas) * 100;
      this.adicionarConsulta();
    } else {
      this.probabilidade = null;
    }
  }

  adicionarConsulta(): void {
    if (this.sucessos !== null && this.tentativas !== null && this.probabilidade !== null) {
      const novaConsulta = {
        sucessos: this.sucessos,
        tentativas: this.tentativas,
        probabilidade: this.probabilidade
      };
      this.http.post<{ id: number, sucessos: number, tentativas: number, probabilidade: number }>('http://localhost:3000/probabilidade', novaConsulta)
        .subscribe(response => {
          this.consultasAnteriores.unshift({ id: response.id, ...novaConsulta });
        });
    }
  }

  carregarConsultas(): void {
    this.http.get<{ id: number, sucessos: number, tentativas: number, probabilidade: number }[]>('http://localhost:3000/probabilidade')
      .subscribe(consultas => {
        this.consultasAnteriores = consultas;
      });
  }
  salvarConsultas(): void {
    this.http.put('/assets/consultas.json', this.consultasAnteriores)
      .subscribe();
  }
  deletarConsulta(id: number): void {
    this.http.delete(`http://localhost:3000/probabilidade/${id}`)
      .subscribe(() => {
        this.consultasAnteriores = this.consultasAnteriores.filter(consulta => consulta.id !== id);
      });
  }
}
