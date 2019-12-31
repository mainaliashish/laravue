<template>
  <div class="container">
        <div class="card mt-5" v-if="$gate.isAdmin()">
              <div class="card-header">
                <h3 class="card-title">List of Users</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModal()">Add New
                        <i class="fa fa-user-plus fa-fw"></i>
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Registered at</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                
                  <tr v-for="user in users.data" :key="user.id">

                    <td>{{user.id}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.created_at | myDate}}</td>
                    <td>{{user.type | upText}}</td>

                    <td>
                          <a href="#" @click="editModal(user)">
                              <i class="fa fa-edit"></i>
                          </a>
                          |
                          <a href="#" @click="deleteUser(user.id)">
                              <i class="fa fa-trash text-red"></i>
                          </a>
        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>

  <!-- Modal -->
        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>

  <div class="modal fade" id="addNewUser" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-show="!editMode" id="exampleModalLongTitle">Create New User</h5>
          <h5 class="modal-title" v-show="editMode" id="exampleModalLongTitle">Update User</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <form  @submit.prevent="editMode ? updateUser() : createUser()">
            <div class="modal-body">
              <div class="form-group">
                <input v-model="form.name" type="text" name="name"
                  placeholder="Name"
                  class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                <has-error :form="form" field="name"></has-error>
              </div>

              <div class="form-group">
                <input v-model="form.email" type="email" name="email"
                  placeholder="Email"
                  class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                <has-error :form="form" field="email"></has-error>
              </div>

              <div class="form-group">
                <textarea v-model="form.bio" name="bio" id="bio"
                placeholder="Short bio for user (Optional)"
                class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                <has-error :form="form" field="bio"></has-error>
            </div>


              <div class="form-group">
                  <select name="type" v-model="form.type" id="type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                      <option value="">Select User Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">Standard User</option>
                      <option value="author">Author</option>
                  </select>
                  <has-error :form="form" field="type"></has-error>
              </div>

              <div class="form-group">
                  <input v-model="form.password" type="password" name="password" id="password"
                  placeholder="Password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                  <has-error :form="form" field="password"></has-error>
              </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          <button type="submit" v-show="!editMode" class="btn btn-primary">Create user</button>
          <button type="submit" v-show="editMode" class="btn btn-primary">Update user</button>

        </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
    export default {  
        data() {
          return {
            editMode: false,
            users: {},
            form: new Form({
                id: '',
                name: '',
                email: '',
                password: '',
                type: '',
                bio: '',
                photo: ''
            })
          }
        },

        methods: {
  		// Our method to GET results from a Laravel endpoint
	    	getResults(page = 1) {
            axios.get('api/user?page=' + page)
            .then(response => {
            this.users = response.data;
          })
          },
        
          newModal() {
             this.editMode = false
             this.form.reset()
             $('#addNewUser').modal('show');
          },

          editModal(user) {
             this.editMode = true
             this.form.reset()
             $('#addNewUser').modal('show');
             this.form.fill(user)
          },

          loadUsers() {
              axios.get("api/user").then(({ data }) => (this.users = data));
          },

          createUser() {
              // start progress bar
              this.$Progress.start()
              // Send Http request to API\UserController
              this.form.post('api/user')
                .then(() => {
                    Fire.$emit('AfterCreateUser')
                    // Hide Model
                    $('#addNewUser').modal('hide');
                    // Show toast notification
                    toast.fire({
                      icon: 'success',
                      title: 'User created successfully'
                    })
                    // hide progress bar
                    this.$Progress.finish()
                })
                .catch(() => {
                })
          },

          deleteUser(id) {
              swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                // Send request to server
                this.form.delete('api/user/'+id)
                  .then(() => {
                    // Hide Model
                    $('#addNewUser').modal('hide');
                      if (result.value) {
                        swal.fire(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                        )
                      Fire.$emit('AfterCreateUser');
                      }
                  }).catch(() => {
                    
                  })
              })
          },

          updateUser() {
                // Start Vue progress bar
                this.$Progress.start()
                // UsersController Update method
                this.form.put('api/user/'+this.form.id)
                  .then(() => { // Success 
                    // Hide Model
                    $('#addNewUser').modal('hide');
                        swal.fire(
                          'Updated!',
                          'User info updated successfully updated.',
                          'success'
                        )
                      // Progress bar finish
                      this.$Progress.finish();
                      // Load data from server dynamically
                      Fire.$emit('AfterCreateUser')
                  })
                  .catch(() => { // Error
                    this.$Progress.fail()
                  })
          }
        },

        created() {
          Fire.$on('searching',() => {
                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                .then((data) => {
                    this.users = data.data
                })
                .catch(() => {
                })
            })
          this.loadUsers();
          // add user automatically after create
          Fire.$on('AfterCreateUser', () => {
            this.loadUsers();
          });
          //etInterval(() => this.loadUsers(), 3000)
        }

    }
</script>