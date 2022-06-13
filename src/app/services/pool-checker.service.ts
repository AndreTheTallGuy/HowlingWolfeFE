import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Times } from '../models/Times';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PoolCheckerService {

  availability: Times[] = [];

  constructor(private api: ApiService) { }

  checkPool(date, selectedBoat, duration, time): boolean{
    this.resetTimesArray();
    let result: boolean = false;

    this.api.getAllOrdersByDate(date).subscribe((res)=>{
      //loops through orders to get each boat
      for(let order of res){
        for(let boat of order.boats){
         // if boat's date matches user's date, it is subtracted from the pool
        //  let boatDate = boat.date;
          if(Date.parse(boat.date.toString()) === Date.parse(date.toISOString())){
            this.pool(boat.boat, boat.duration, boat.time);
          }
        }
      }
      if(sessionStorage.getItem("cartList")){
        let boatsInCart = JSON.parse(sessionStorage.getItem("cartList"));
        for(let boat of boatsInCart){
          if(boat.date === date.toISOString()){
            this.pool(boat.boat, boat.duration, boat.time);
          }
        }
      }
      // subtracts user's selected boat from pool
      result = this.pool(selectedBoat, duration, time);

    },(err)=>{
      console.log(err.message);
    })
    return result;
    
  }

  resetTimesArray(){
    this.availability = [
    {time:"8am", boats:{kayak: 16, canoe: 2, tandem: 5}},
    {time:"9am", boats:{kayak: 16, canoe: 2, tandem: 5}},
    {time: "10am", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "11am", boats: {kayak: 1, canoe: 2, tandem: 5}},
    {time: "12pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "1pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "2pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "3pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "4pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "5pm", boats: {kayak: 16, canoe: 2, tandem: 5}},
    {time: "6pm", boats: {kayak: 16, canoe: 2, tandem: 5}}]
  }

  verifyAvailability(selectedBoat, time){
    for (let i = 0; i < this.availability.length; i++) {
     if(this.availability[i].time === time){
       let boatsArray = this.availability[i].boats;
       if(boatsArray[selectedBoat] <1){
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

    return this.verifyAvailability(boat, time);
  }


}
