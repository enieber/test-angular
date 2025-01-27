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
      sigla: ['', [Validators.required, Validators.maxLength(3)]],
      nome: ['', [Validators.required]],
      simbolo: ['', [Validators.required, Validators.maxLength(5)]],
      codigo: [
        0,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }


  ngOnInit(): void {
    this.coinService.getCoins().subscribe((response: Coin[]) => {
      this.coins = response;
    });
  }


  closeDialog() {
    this.coinForm.reset();
    this.edit = false;
    this.coinForm.controls['codigo'].enable();
    this.coinDialog.nativeElement.close();
  }

  openDialog() {
    this.coinDialog.nativeElement.showModal();
  }

  editCoin(codigo: number) {
    let item = this.coins.find((item) => item.codigo == codigo);
    if (item) {
      this.coinForm.controls['nome'].setValue(item.nome);
      this.coinForm.controls['sigla'].setValue(item.sigla);
      this.coinForm.controls['simbolo'].setValue(item.simbolo);
      this.coinForm.controls['codigo'].setValue(item.codigo);
      this.lastId = item.id;
      this.coinForm.controls['codigo'].disable();
      this.edit = true;
      this.openDialog();
    }
  }

  removeCoin(id: string) {
    this.coinService.deleteCoin(id).subscribe(() => {
      this.coins = this.coins.filter((item) => item.id !== id);
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

