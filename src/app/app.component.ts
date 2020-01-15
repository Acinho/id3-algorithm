import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as ID3 from 'decision-tree';

import { TreningPodaci } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  treningPodaci: { [key: string]: any } = TreningPodaci.vrednost;
  testPodaci: { [key: string]: any } = TreningPodaci.test;
  attributi: string[] = TreningPodaci.atributi;
  klasniAtribut: string = this.attributi[this.attributi.length - 1];
  vrednosniAtributi: string[] = this.attributi.slice(0, this.attributi.length - 1);

  stabloOdluke = new ID3(this.treningPodaci, this.klasniAtribut, this.vrednosniAtributi);
  preciznost = this.stabloOdluke.evaluate(this.testPodaci);

  formGroup: FormGroup;
  kvalitetVina: number;

  constructor(private fb: FormBuilder) {
    const formObject = {};
    this.vrednosniAtributi.forEach(x => formObject[x] = this.fb.control(undefined, Validators.required));
    this.formGroup = this.fb.group(formObject);
    this.vrednosniAtributi.forEach(atribut => {
      console.log(atribut);
      const test: number[] = this.treningPodaci.map(x => x[atribut]);
      console.log(Math.min(...test));
      console.log(Math.max(...test));
    });
  }

  resetujFormu(): void {
    const toReset = {};
    this.vrednosniAtributi.forEach(x => toReset[x] = undefined);
    this.formGroup.reset(toReset);
    this.kvalitetVina = undefined;
  }

  proslediFormu(): void {
    this.kvalitetVina = this.stabloOdluke.predict(this.formGroup.value);
    if (this.kvalitetVina > 10) {
      console.log(this.kvalitetVina);
      this.kvalitetVina = 10;
    }
  }
}
