import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent {

  http = inject(HttpClient);

  files: File[] = [];
  myMap: Map<string, string> = new Map<string, string>();


  // On file Select
  onChange(event: any) {
    const files = event.target.files;
    if (files.length) {

      [...files].forEach((file) => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.myMap.set(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  upload(){
    var formData = new FormData();
  var params = new HttpParams();
    [...this.files].forEach((file) => {
      console.log('Uploading image '+ file.name)
      formData.append("name", file.name);
      formData.append("image", file, file.name);
      params = params.set('filename', file.name);
    });
    // const upload$ = this.adService.uploadImages(ad, formData);
  

    const upload$ = this.http.post('http://localhost:8083/ads/v1/imagekit/upload', formData, {params});
    upload$.subscribe({
      next: () => {
        console.log('Success')
      },
      error: (error: any) => {
       console.log('Error')
      },
    });
  }
}
