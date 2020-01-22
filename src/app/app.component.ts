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

  treningPodaci: { [key: string]: any }[] = TreningPodaci.vrednost;
  testPodaci: { [key: string]: any }[] = TreningPodaci.test;
  attributi: string[] = TreningPodaci.atributi;
  klasniAtribut: string = this.attributi[this.attributi.length - 1];
  vrednosniAtributi: string[] = this.attributi.slice(0, this.attributi.length - 1);

  stabloOdluke = new ID3(this.treningPodaci, this.klasniAtribut, this.vrednosniAtributi);
  // preciznost = this.stabloOdluke.evaluate(this.testPodaci);

  // minMaksVrednosti = [
  //   { min: 4.6, max: 15.9 },
  //   { min: 0.12, max: 1.58 },
  //   { min: 0, max: 1 },
  //   { min: 0.9, max: 15.5 },
  //   { min: 0.012, max: 0.611 },
  //   { min: 1, max: 72 },
  //   { min: 6, max: 289 },
  //   { min: 0.9907, max: 1.00369 },
  //   { min: 2.74, max: 4.01 },
  //   { min: 0.33, max: 2 },
  //   { min: 8.4, max: 14.9 }
  // ];

  podaciZaKombo: { [key: string]: number[] } = {};

  formGroup: FormGroup;
  kvalitetVina: number;

  constructor(private fb: FormBuilder) {
    const formObject = {};
    this.vrednosniAtributi.forEach((x, i) => formObject[x] = this.fb.control(undefined, [Validators.required]));//, Validators.min(this.minMaksVrednosti[i].min), Validators.max(this.minMaksVrednosti[i].max)]));
    this.formGroup = this.fb.group(formObject);
    this.izvadiVrednosti();
  }
  resetujFormu(): void {
    const toReset = {};
    this.vrednosniAtributi.forEach(x => toReset[x] = undefined);
    this.formGroup.reset(toReset);
    this.kvalitetVina = undefined;
  }

  proslediFormu(): void {
    this.kvalitetVina = this.stabloOdluke.predict(this.formGroup.value);
  }

  test(): void {
    this.testPodaci.forEach(x => {
      const klasnaVrednost = this.stabloOdluke.predict(x);
      x[this.klasniAtribut] = klasnaVrednost;
    });
  }

  greska(atribut: string, i: number): string {
    let toReturn = "";
    if (this.formGroup.get(atribut).errors) {
      const errorKeys = Object.keys(this.formGroup.get(atribut).errors);
      if (errorKeys.includes('required'))
        toReturn = `${atribut} je obavezno polje.`;
      // else if (errorKeys.includes('min'))
      //   toReturn = `Minimalna vrednost je ${this.minMaksVrednosti[i].min}`;
      // else if (errorKeys.includes('max'))
      //   toReturn = `Maksimalna vrednost je ${this.minMaksVrednosti[i].max}`;
    }
    return toReturn;
  }

  izvadiVrednosti(): void {
    this.attributi.forEach(atribut => {
      this.podaciZaKombo[atribut] = this.treningPodaci.map(x => Number.parseFloat(x[atribut])).filter((x, i, a) => a.indexOf(x) == i).sort((x, y) => x - y);
    });
  }
}
