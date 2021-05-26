import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  mailChimpEndpoint = 'https://howlingwolfe.us6.list-manage.com/subscribe/post-json?u=5489daafdce6012200253dd6f&amp;id=84814a9394'

  constructor( private http: HttpClient) { }

  subscribeToList(data){
    const params = new HttpParams()
        .set('EMAIL', data.email)
        .set('b_5489daafdce6012200253dd6f_84814a9394', '')

        const mailChimpUrl = `${this.mailChimpEndpoint}&${params.toString()}`;
        return this.http.jsonp(mailChimpUrl, 'c')
  }
}
