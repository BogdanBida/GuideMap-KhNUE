import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public isOpen = new BehaviorSubject<boolean>(false);
  constructor() { }
}
