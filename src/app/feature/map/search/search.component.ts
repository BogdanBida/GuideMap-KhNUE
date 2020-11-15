import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public inputText: string;

  constructor() { }

  ngOnInit() {
  }

  clear() {
    this.inputText = '';
  }

  find() {
    console.log(this.inputText);
  }

}
