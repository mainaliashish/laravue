require('./bootstrap');

window.Vue = require('vue');

// moment js for date formatting..
import moment from 'moment'

import VueRouter from 'vue-router'
import Dashboard from './components/DashboardComponent.vue'
import Users from './components/UsersComponent.vue'
import Profile from './components/ProfileComponent.vue'
import Developer from './components/DeveloperComponent.vue'
import NotFound from './components/NotfoundComponent.vue'

// Vform for Laravel validation
import { Form, HasError, AlertError } from 'vform'

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
// Globally installing Vform
window.Form = Form


// Integrating Sweet Alert Js via NPM
import Swal from 'sweetalert2'
// globally installing sweetalert
window.swal = Swal

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

window.toast = Toast

Vue.use(VueRouter)

// Vue Progress bar 
import VueProgressBar from 'vue-progressbar'


import Gate from './Gate'
Vue.prototype.$gate = new Gate(window.user);

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
  })


// Vue js Routes Paths
let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/users', component: Users },
    { path: '/profile', component: Profile },
    { path: '/developer', component: Developer },
    { path: '*', component: NotFound },

  ]


const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

// Filters for UpperCase text and Date 
Vue.filter('upText', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('myDate',function(created){
    return moment(created).format('MMMM Do YYYY');
});


// Custom events using $emit vue js
let Fire = new Vue();

// globally installing events
window.Fire = Fire


Vue.component(
  'passport-clients',
  require('./components/passport/Clients.vue').default
);

Vue.component(
  'passport-authorized-clients',
  require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
  'passport-personal-access-tokens',
  require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
  'not-found',
  require('./components/NotfoundComponent.vue').default
);

Vue.component('pagination', require('laravel-vue-pagination'));

const app = new Vue({
    el: '#app',
    router,
    data: {
      search: ''
    },
    methods: {
        searchit: _.debounce(() => {
          Fire.$emit('searching');
        }, 1000),

        printme() {
          window.print();
        }
      }
    });
