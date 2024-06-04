import { Component, OnInit } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { PedidosService } from '../../../Services/pedidos.service';
import { IPedidos } from '../../../Interfaces/IPedidos';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Router, RouterLink, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-create-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgIf, NgFor, RouterModule],
  templateUrl: './create-and-get-project.component.html',
  styleUrls: ['./create-and-get-project.component.scss'],
  providers: [DatePipe]
})
export class CreateAndGetProjectComponent implements OnInit {
  pedido: IPedidos = {
    id: 0,
    name: '',
    fiambre: 0,
    queijo: 0,
    bolo: 0,
    date: new Date(),
    service: 'Banco de Sangue | Dadores Benévolos Sangue',
    responsavel: '',
    emailBody: 'Bom dia,\n\nConforme acordado, segue em anexo a requisição de suplementos alimentares para o banco de sangue.\n\nMuito obrigado.',
    dataNecessidade: '' // Nova propriedade para a data de necessidade
  };

  responsaveis = [
    'Pedro Vieira',
    'Carla Gonçalves',
    'Olga Almeida',
    'Maria Mourão',
    'João Caldas',
    'Sara Moreira',
    'Carla Gouveia',
    'Sandra Andrade',
    'Claudia Tuna',
    'Rosária Moreira',
    'Claudia Pinto'
  ];

  formattedDate: string = '';
  showSuccessMessage: boolean = false;
  formattedMinDate: string = '';


  constructor(private pedidosService: PedidosService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.pedido.date = new Date(); // Sets the current date
    this.formattedDate = this.datePipe.transform(this.pedido.date, 'yyyy-MM-dd HH:mm') || '';

    // Set the minimum date for the dataNecessidade input field to today
    this.formattedMinDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || ''; // Today's date

  }

  onSubmit(): void {
    console.log('Pedido antes de enviar:', this.pedido); // Log para debug
    this.pedidosService.createPedido(this.pedido).subscribe(
      response => {
        console.log('Pedido created successfully', response);
        // Delay the PDF generation to ensure the DOM is updated
        setTimeout(() => {
          this.generatePdfAndSendEmail();
        }, 1000);
      },
      error => {
        console.error('Error creating pedido', error);
      }
    );
  }

  generatePdfAndSendEmail(): void {
    const data = document.getElementById('pedido-content');
    const emailBodyGroup = document.getElementById('email-body-group');
    const buttonsGroup = document.getElementById('buttons-group');

    if (data && emailBodyGroup && buttonsGroup) {
      // Esconder os elementos
      emailBodyGroup.style.display = 'none';
      buttonsGroup.style.display = 'none';

      html2canvas(data, { scrollY: -window.scrollY }).then(canvas => {
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 0;

        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        const pdfBlob = pdf.output('blob');

        // Mostrar os elementos novamente
        emailBodyGroup.style.display = 'block';
        buttonsGroup.style.display = 'block';

        // Send the PDF to the backend
        this.sendEmailWithPdf(pdfBlob);
      }).catch(error => {
        console.error('Error generating PDF:', error);

        // Mostrar os elementos novamente em caso de erro
        emailBodyGroup.style.display = 'block';
        buttonsGroup.style.display = 'block';
      });
    } else {
      console.error('Element not found: #pedido-content, #email-body-group, or #buttons-group');
    }
  }

  sendEmailWithPdf(pdfBlob: Blob): void {
    const formData = new FormData();
    const formattedDate = new Date().toISOString().slice(0, 19).replace(/-/g, '').replace(/T/g, '_').replace(/:/g, '');
    const fileName = `Requisicao_Suplementos_Alimentares_BancoSangue_${formattedDate}.pdf`;
    formData.append('pdf', pdfBlob, fileName);
    formData.append('pedido', JSON.stringify(this.pedido));
    formData.append('emailBody', this.pedido.emailBody); // Adiciona o corpo do email ao formData

    console.log('Form data:', formData); // Log para debug

    this.pedidosService.sendEmailWithPdf(formData).subscribe(
      response => {
        console.log('Email sent successfully', response);
        this.showSuccessMessage = true;
      },
      error => {
        this.showSuccessMessage = true;
      }
    );
  }

  clearForm(): void {
    this.pedido = {
      id: 0,
      name: '',
      fiambre: 0,
      queijo: 0,
      bolo: 0,
      date: new Date(),
      service: 'Banco de Sangue | Dadores Benévolos Sangue',
      responsavel: '',
      emailBody: '', // Limpar o campo de corpo do email
      dataNecessidade: '' // Limpar a data de necessidade
    };
    this.formattedDate = this.datePipe.transform(this.pedido.date, 'yyyy-MM-dd HH:mm') || '';
  }

  returnToForm(): void {
    this.showSuccessMessage = false;
    this.clearForm();
  }
}
