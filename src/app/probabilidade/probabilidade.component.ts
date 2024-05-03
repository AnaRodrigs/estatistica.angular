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
  proximoId: number = 1; 
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
        id: this.proximoId++,
        sucessos: this.sucessos,
        tentativas: this.tentativas,
        probabilidade: this.probabilidade
      };
      
      this.http.post('http://localhost:3000/probabilidade', novaConsulta)
        .subscribe(() => {
          this.consultasAnteriores.unshift(novaConsulta);
        });
    }
  }
  carregarConsultas(): void {
    const consultasString = localStorage.getItem('consultas');
    if (consultasString) {
      this.consultasAnteriores = JSON.parse(consultasString);
    }
  }
  salvarConsultas(): void {
    this.http.put('/assets/consultas.json', this.consultasAnteriores)
      .subscribe();
  }
  
  deletarConsulta(id: number): void {
    this.consultasAnteriores = this.consultasAnteriores.filter(consulta => consulta.id !== id);
    // Atualizar o armazenamento local após excluir a consulta
    localStorage.setItem('consultas', JSON.stringify(this.consultasAnteriores));

    // Deletar do servidor JSON
    this.http.delete(`http://localhost:3000/probabilidade/${id}`)
      .subscribe(() => {
        console.log('Consulta deletada:', id);
      }, error => {
        console.error('Erro ao deletar consulta:', error);
      });
  }
}