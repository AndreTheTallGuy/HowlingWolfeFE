import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Times } from '../models/Times';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PoolCheckerService {

  availability: Times[] = [
    {time:"8am", boats:{kayak: 16, canoe: 5, tandem: 5}},
    {time:"9am", boats:{kayak: 16, canoe: 5, tandem: 5}},
    {time: "10am", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "11am", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "12pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "1pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "2pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "3pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "4pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "5pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "6pm", boats: {kayak: 16, canoe: 5, tandem: 5}}];

  globalBoat: string; 

  constructor(private api: ApiService) { }

  checkPool(date, selectedBoat, duration, time): Observable<boolean>{
      this.resetTimesArray();

      switch (selectedBoat) {
        case "Single Kayak":
          this.globalBoat = "kayak";
          break;
          case "Canoe":
          this.globalBoat = "canoe";
          break;
          case "Tandem":
          this.globalBoat = "tandem";
          break;
      }
      
    return from(this.api.getAllOrdersByDate(date).toPromise()
    .then((res)=>{
      //Subtracts previous orders from pool
      for(let order of res){
        for(let boat of order.boats){
            this.pool(boat.boat, boat.duration, boat.time);
        }
      }
          
      //Subtracts any orders in the cart from pool
      if(sessionStorage.getItem("cartList")){
        let boatsInCart = JSON.parse(sessionStorage.getItem("cartList"));
        for(let boat of boatsInCart){
          if(boat.date === date.toISOString()){
            this.pool(boat.boat, boat.duration, boat.time);
          }
        }
      }

      // subtracts user's selected boat from pool
      this.pool(selectedBoat, duration, time);
      
      return this.verifyAvailability(this.globalBoat, duration, time);
    }))
  }

  checkAvailability(date, selectedBoat, duration, time):Observable<number>{
    let counter = 1;
    
    return from(this.checkPool(date, selectedBoat, duration, time).toPromise().then((res)=> {
        
        for (let i = 0; i < this.availability.length; i++) {
          if(this.availability[i].time === time){
            counter = this.availability[i].boats[this.globalBoat] +1;
          }
        }
        return counter
      }))
  }

  resetTimesArray(){
    this.availability = [
    {time:"8am", boats:{kayak: 16, canoe: 5, tandem: 5}},
    {time:"9am", boats:{kayak: 16, canoe: 5, tandem: 5}},
    {time: "10am", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "11am", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "12pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "1pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "2pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "3pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "4pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "5pm", boats: {kayak: 16, canoe: 5, tandem: 5}},
    {time: "6pm", boats: {kayak: 16, canoe: 5, tandem: 5}}]
  }

  verifyAvailability(selectedBoat, duration, time){
    
    for (let i = 0; i < this.availability.length; i++) {
        if(this.availability[i].time === time){
          let boatsArray = this.availability[i].boats;
          if(boatsArray[selectedBoat] <0){
            return false;
          } else {
            return true;
          }
        }
    }
  }

  pool(boat, duration, time){
      // subtracts from availability based on duration of trip plus one hour buffer
      if(boat === "Single Kayak" && duration === "1"){
        if(time === "8am"){
          this.availability[0].boats.kayak -= 1;
          this.availability[1].boats.kayak -= 1;
          // this.availability[2].boats.kayak -= 1;
        } else if( time === "9am"){
          this.availability[1].boats.kayak -= 1;
          this.availability[2].boats.kayak -= 1;
          // this.availability[3].boats.kayak -= 1;
        } else if( time === "10am"){
          this.availability[2].boats.kayak -= 1;
          this.availability[3].boats.kayak -= 1;
          // this.availability[4].boats.kayak -= 1;
        }else if( time === "11am"){
          this.availability[3].boats.kayak -= 1;
          this.availability[4].boats.kayak -= 1;
          // this.availability[5].boats.kayak -= 1;
        }else if( time === "12pm"){
          this.availability[4].boats.kayak -= 1;
          this.availability[5].boats.kayak -= 1;
          // this.availability[6].boats.kayak -= 1;
        }else if( time === "1pm"){
          this.availability[5].boats.kayak -= 1;
          this.availability[6].boats.kayak -= 1;
          // this.availability[7].boats.kayak -= 1;
        }else if( time === "2pm"){
          this.availability[6].boats.kayak -= 1;
          this.availability[7].boats.kayak -= 1;
          // this.availability[8].boats.kayak -= 1;
        }else if( time === "3pm"){
          this.availability[7].boats.kayak -= 1;
          this.availability[8].boats.kayak -= 1;
          // this.availability[9].boats.kayak -= 1;
        }else if( time === "4pm"){
          this.availability[8].boats.kayak -= 1;
          this.availability[9].boats.kayak -= 1;
          // this.availability[10].boats.kayak -= 1;
        }else if( time === "5pm"){
          this.availability[9].boats.kayak -= 1;
          this.availability[10].boats.kayak -= 1;
        }else if( time === "6pm"){
          this.availability[10].boats.kayak -= 1;
        }
    } else if (boat === "Single Kayak" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.kayak -= 1;
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        // this.availability[4].boats.kayak -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        // this.availability[5].boats.kayak -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        // this.availability[6].boats.kayak -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        // this.availability[7].boats.kayak -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        // this.availability[8].boats.kayak -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        // this.availability[9].boats.kayak -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        // this.availability[10].boats.kayak -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.kayak -= 1;
      }
    } else if (boat === "Canoe" && duration === "1"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        // this.availability[2].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        // this.availability[3].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        // this.availability[4].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        // this.availability[5].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        // this.availability[6].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        // this.availability[7].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        // this.availability[8].boats.canoe -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        // this.availability[9].boats.canoe -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        // this.availability[10].boats.canoe -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.canoe -= 1;
      }
    } else if (boat === "Canoe" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        // this.availability[4].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        // this.availability[5].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        // this.availability[6].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        // this.availability[7].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        // this.availability[8].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        // this.availability[9].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        // this.availability[10].boats.canoe -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.canoe -= 1;
      }
    } else if (boat === "Tandem" && duration === "1"){
      if(time === "8am"){
        this.availability[0].boats.tandem -= 1;
        this.availability[1].boats.tandem -= 1;
        // this.availability[2].boats.tandem -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        // this.availability[3].boats.tandem -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        // this.availability[4].boats.tandem -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        // this.availability[5].boats.tandem -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        // this.availability[6].boats.tandem -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        // this.availability[7].boats.tandem -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        // this.availability[8].boats.tandem -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        // this.availability[9].boats.tandem -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        // this.availability[10].boats.tandem -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.tandem -= 1;
      }
    } else if (boat === "Tandem" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.tandem -= 1;
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        // this.availability[4].boats.tandem -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        // this.availability[5].boats.tandem -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        // this.availability[6].boats.tandem -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        // this.availability[7].boats.tandem -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        // this.availability[8].boats.tandem -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        // this.availability[9].boats.tandem -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        // this.availability[10].boats.tandem -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.tandem -= 1;
      }
    } 
  }
}
