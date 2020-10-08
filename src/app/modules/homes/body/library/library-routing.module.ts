import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LibraryRootComponent} from './library-root/library-root.component';
import {CategoryComponent} from './category/category.component';
import { CatGraphComponent } from './category-graph/category-graph.component';
const routes: Routes = [
  {
    path : "",
    component : LibraryRootComponent,
    children:[
      {
        path : "",
        component : CategoryComponent
      },
      {
        path : "graph",
        component : CatGraphComponent
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
