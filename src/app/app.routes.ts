import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { PostsComponent } from './components/posts/posts.component';
import { DemoComponent } from './components/demo/demo.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'users',
        component: UsersComponent
    },
    {
        path: 'posts',
        component: PostsComponent
    },
    {
        path: 'demo',
        component: DemoComponent
    },
    // Redirect to home for any other route
    {
        path: '**',
        redirectTo: ''
    }
];
