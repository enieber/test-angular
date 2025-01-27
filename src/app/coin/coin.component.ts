import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Coin } from './coin.interface';
import { CoinService } from '../coin.service';

@Component({
  selector: 'coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css'],
})

export class CoinComponent implements OnInit {
  coinForm: FormGroup;
  coins: Coin[] = [];
  edit: boolean = false;
  lastId: string = '';

  @ViewChild('coinDialog') coinDialog!: ElementRef<HTMLDialogElement>;

  constructor(private fb: FormBuilder, private coinService: CoinService) {
    this.coinForm = this.fb.group({
      id: ['', [Validators.required, this.validateSigla]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      simbolo: ['', this.validateSimbolo],
      codigo: ['', [this.validateCodigo]]
    });
  }

  validateSigla(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = /^[A-Z]{3}$/.test(value);
    return isValid ? null : { 'invalidSigla': true };
  }

  validateSimbolo(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = value.split(',').every((symbol: string) => symbol.trim().length > 0);
    return isValid ? null : { 'invalidSimbolo': true };
  }

  validateCodigo(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = value >= 1 && value <= 999;
    return isValid ? null : { 'invalidCodigo': true };
  }

  ngOnInit(): void {
    this.coinService.getCoins().subscribe((response: Coin[]) => {
      this.coins = response;
    });
  }


  closeDialog() {
    this.coinForm.reset();
    this.edit = false;
    this.coinForm.controls['id'].enable();
    this.coinDialog.nativeElement.close();
  }

  openDialog() {
    this.coinDialog.nativeElement.showModal();
  }

  editCoin(sigla: string) {
    let item = this.coins.find((item) => item.id == sigla);
    if (item) {
      this.coinForm.controls['nome'].setValue(item.nome);
      this.coinForm.controls['id'].setValue(item.id);
      this.coinForm.controls['simbolo'].setValue(item.simbolo);
      this.coinForm.controls['codigo'].setValue(item.codigo);
      this.lastId = item.id;
      this.coinForm.controls['id'].disable();
      this.edit = true;
      this.openDialog();
    }
  }

  removeCoin(sigla: string) {
    this.coinService.deleteCoin(sigla).subscribe(() => {
      this.coins = this.coins.filter((item) => item.id !== sigla);
    });
  }

  onSubmit() {
    if (this.coinForm.valid) {
      const newCoin: Coin = this.coinForm.value;
      if (this.edit) {
        this.coinService.updateCoin(this.lastId, newCoin).subscribe((data: Coin) => {
          this.coins = this.coins.map(item => {
            if (item.id == this.lastId) {
              return data;
            }
            return item;
          })
        });
      } else {
        this.coinService.addCoin(newCoin).subscribe((data: Coin) => {
          this.coins.push(newCoin);
        });
      }
      this.closeDialog();
    } else {
      alert('verifique os campos');
      console.log('Formulário inválido', this.coinForm);
    }
  }
}

