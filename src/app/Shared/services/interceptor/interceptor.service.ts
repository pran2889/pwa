import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { map } from 'rxjs/operators';

import Dexie from 'dexie';
import { UUID } from 'angular2-uuid';
import { OnlineOfflineService } from '../onlineoffline/onlineoffline.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  public indexDb: any;
  public fields: { id: string; url: string; body: any };
  private apiCount: number;
  constructor(
    private httpClient: HttpClient,
    private onlineOfflineService: OnlineOfflineService
  ) {
    this.registerToEvents(onlineOfflineService);
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.onlineOfflineService.isOnline) {
      const token: string = localStorage.getItem('token');

      if (token) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
      }

      const excludesArr = ['https://file.io'];
      if (!excludesArr.find(x => request.url.includes(x))) {
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json')
          });
        }
      }

      request = request.clone({
        headers: request.headers.set('Accept', 'application/json')
      });

      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
          return event;
        })
      );
    } else {
      this.fields = { id: UUID.UUID(), url: request.url, body: request.body };
      this.createDatabase();
      this.addToIndexedDb(this.fields);
    }
  }

  public registerToEvents(onlineofflineService: OnlineOfflineService) {
    onlineofflineService.connectionChanged.subscribe(online => {
      if (online) {
        this.sendItemsFromIndexedDb();
      }
    });
  }

  public createDatabase() {
    this.indexDb = new Dexie(`SpaceAutomation`);
    const fields = Object.keys(this.fields);
    this.indexDb.version(1).stores({
      spaceAuto: fields.join(`,`)
    });
  }

  public addToIndexedDb(items) {
    this.indexDb.spaceAuto
      .add(items)
      .then(async () => {
        const allItems: any[] = await this.indexDb.spaceAuto.toArray();
      })
      .catch(e => {
        console.log('Error: ' + (e.stack || e));
      });
  }

  public async sendItemsFromIndexedDb() {
    const allItems: any[] = await this.indexDb.spaceAuto.toArray();
    allItems.forEach(item => {
      this.resendData(item.url, item.body).subscribe();
      this.indexDb.spaceAuto.delete(item.id).then(() => {
        console.log(`item ${item.id} sent and deleted locally`);
      });
    });
  }

  public resendData = (url, data) => {
    return this.httpClient.post(url, data).pipe(map(x => x));
  }
}
