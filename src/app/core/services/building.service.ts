import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BuildingService {
    constructor (private http: HttpClient) {}

    getEntitiesData(): Observable<any> {
        // return entitiesData;
      return this.http.get('assets/json_data/mc-1f.json');
    }
}
