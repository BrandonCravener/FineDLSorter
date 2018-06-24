import { HomeComponent } from '../../components/home/home.component';
import { GroupsComponent } from '../../components/groups/groups.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OverlookedComponent} from '../../components/overlooked/overlooked.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'groups',
        component: GroupsComponent
    },
    {
        path: 'overlooked',
        component: OverlookedComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
