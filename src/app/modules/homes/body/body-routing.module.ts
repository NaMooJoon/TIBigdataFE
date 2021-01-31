import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { BodyContainerComponent } from './body-container/body-container.component';

const routes: Routes = [
  {
    path: "",
    component: BodyContainerComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'specials',
        loadChildren: () => import('./specials/specials.module').then(m => m.SpecialsModule)
      },
      {
        path: 'library',
        loadChildren: () => import('./library/library.module').then(m => m.LibraryModule)
      },
      {
        path: 'membership',
        loadChildren: () => import('../../communications/communication.module').then(m => m.CommunicationModule),
        // canLoad : [AuthGuard]./modules/communications/communication.module
      },
      {
        path: 'community',
        loadChildren: () => import('./community/community.module').then(m => m.CommunityModule),
      },
      {
        path: 'introduce',
        loadChildren: () => import('./intro/intro.module').then(m => m.IntroModule),
      },
      {
        path: 'userpage',
        loadChildren: () => import('./userpage/userpage.module').then(m => m.UserpageModule),
      }
    ]
  }






];

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodyRoutingModule { }
