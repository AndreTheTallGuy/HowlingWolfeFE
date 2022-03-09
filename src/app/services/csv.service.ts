import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }
  
  downloadFile(data, filename) {
    let csvData = this.ConvertToCSV(data, ['Order Id', 'Date', 'Time', 'Shuttle', 'Boat', 'Price', 'Discount', 'Coupon', 'GC Debit', 'GC Number', 'Name', 'Email', 'Phone', 'Ordered On',  'Admin Add', 'Comment']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

ConvertToCSV(objArray, headerList) {
     let objectNames: string[] = ['id', 'date', 'time', 'shuttle', 'boat', 'price', 'discount', 'coupon', 'gcDebit', 'giftCard', 'name', 'email', 'phone',  'orderedOn',  'type', 'comment']
     let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = '';
     
     for (let index in headerList) {
         row += headerList[index] + ',';
     }
     
     row = row.slice(0, -1);
     str += row + '\r\n';
     
     for (let i = 0; i < array.length; i++) {
         let line = '';
         for (let index in objectNames) {
          let head = objectNames[index];
          let field = array[i][head];
          if(field === null){
            line += ' ' + ',';
          } else if(typeof field == 'string' && field.includes(',')){
            line += field.replace(/,/g, ' ') + ',';
          } else {
            line += field + ',';
          }
       }

         str += line + '\r\n';
         
     }
     return str;
 }
}
