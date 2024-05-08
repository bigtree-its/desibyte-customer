import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodsHomeComponent } from './foods';

const routes: Routes = [
  { path: '', component: FoodsHomeComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
