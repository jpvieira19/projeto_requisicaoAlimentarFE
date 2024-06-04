export class IPedidos{
    id: number;
    name: string;
    fiambre: number;
    queijo: number;
    bolo: number;
    date: Date;
    service: string;
    responsavel: string;
    emailBody: string;
    dataNecessidade: string;

    constructor(id: number, nome: string, fiambre: number, queijo: number, bolo: number, date: Date, service: string, responsavel: string, emailBody: string, dataNecessidade: string){
        this.id = id;
        this.name = nome;
        this.fiambre = fiambre;
        this.queijo = queijo;
        this.bolo = bolo;
        this.date = date;
        this.service = service;
        this.responsavel = responsavel;
        this.emailBody = emailBody;
        this.dataNecessidade = dataNecessidade;
    }
}