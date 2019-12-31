<style>

.widget-user-header {
    background-position: center;
    background-size: cover;
    height: 250px !important;
}

</style>

<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
            <!-- Widget: user widget style 1 -->
            <div class="card card-widget widget-user mt-5">
              <!-- Add the bg color to the header using any of the bg-* classes -->
              <div class="widget-user-header text-white" style="background: url('../img/user-cover.jpg') center center;">
                <h3 class="widget-user-username text-right">Elizabeth Pierce</h3>
                <h5 class="widget-user-desc text-right">Web Designer</h5>
              </div>
              <div class="widget-user-image">
                <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-sm-4 border-right">
                    <div class="description-block">
                      <h5 class="description-header">3,200</h5>
                      <span class="description-text">SALES</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                  <div class="col-sm-4 border-right">
                    <div class="description-block">
                      <h5 class="description-header">13,000</h5>
                      <span class="description-text">FOLLOWERS</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                  <div class="col-sm-4">
                    <div class="description-block">
                      <h5 class="description-header">35</h5>
                      <span class="description-text">PRODUCTS</span>
                    </div>
                    <!-- /.description-block -->
                  </div>
                  <!-- /.col -->
                </div>
                <!-- /.row -->
              </div>
            </div>
            </div>
            <!-- /.widget-user -->
        <div class="col-md-12">
            <div class="card">
              <div class="card-header p-2">
                <ul class="nav nav-pills">
                  <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                  <li class="nav-item"><a class="nav-link active" href="#settings" data-toggle="tab">Settings</a></li>
                </ul>
              </div><!-- /.card-header -->
              <div class="card-body">
                <div class="tab-content">
                  <div class="tab-pane" id="activity">
                    <h2>Display User's Activity</h2>
                  </div>
                  <!-- /.tab-pane -->

                  <div class="tab-pane active" id="settings">
                    <form class="form-horizontal">
                      <div class="form-group row">
                        <label for="name" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                          <input type="text" v-model="form.name" class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" name="email" id="name" placeholder="Name">
                          <has-error :form="form" field="name"></has-error>
                        </div>
                      </div>

                      <div class="form-group row">
                        <label for="email" class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                          <input type="email" v-model="form.email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" name="email" id="email" placeholder="Email">
                        <has-error :form="form" field="email"></has-error>
                        </div>
                      </div>

                      <div class="form-group row">
                        <label for="bio" class="col-sm-2 col-form-label">Biography</label>
                        <div class="col-sm-10">
                          <textarea class="form-control" v-model="form.bio" id="bio" name="bio" :class="{ 'is-invalid': form.errors.has('bio') }" placeholder="Biography">
                              
                          </textarea>
                        <has-error :form="form" field="bio"></has-error>
                        </div>
                      </div>

                      <div class="form-group row">
                        <label for="photo" class="col-sm-2 col-form-label">Photo</label>
                        <div class="col-sm-10">
                          <input type="file" name="photo" @change="updatePhoto" id="photo">
                        </div>
                        <span class="widget-user-image">
                          <img class="img-circle preview" :src="getProfilePhoto()" alt="User Avatar">
                        </span>
                        
                      </div>


                      <div class="form-group row">
                        <label for="password" class="col-sm-2 col-form-label">Password (Leave empty if not changing)</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" id="password" name="password" placeholder="Password">
                            <has-error :form="form" field="password"></has-error>
                        </div>
                      </div>

                      <div class="form-group row">
                        <div class="offset-sm-2 col-sm-10">
                          <button type="submit" @click.prevent="updateInfo()" class="btn btn-danger">Update</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <!-- /.tab-pane -->
                </div>
                <!-- /.tab-content -->
              </div><!-- /.card-body -->
            </div>
            <!-- /.nav-tabs-custom -->
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

        mounted() {
                console.log('Profile Component mounted.')
            },
        
        methods: {
                updatePhoto(e) {
                    // console.log('uploading');
                    let file = e.target.files[0];
                    let reader = new FileReader();
                    if(file['size'] < 2111775)
                        {
                        reader.onloadend = (file) => {
                        this.form.photo = reader.result;
                    }
                    reader.readAsDataURL(file);
                    } else {
                          swal.fire(
                          'Error',
                          'Something went wrong.',
                          'error'
                        )
                  }                   
                },

                updateInfo() {
                  this.$Progress.start()
                  this.form.put('api/profile/')
                    .then(() => {
                        swal.fire(
                          'Updated!',
                          'User info updated successfully updated.',
                          'success'
                        )
                      this.$Progress.finish()
                    })
                    .catch(() => {

                      this.$Progress.fail()
                    })
                },

                getProfilePhoto(){
                let photo = (this.form.photo.length > 200) ? this.form.photo : "img/profile/"+ this.form.photo ;
                return photo;
                }
        },
        
        created() {
            axios.get("api/profile").then(({ data }) => (this.form.fill(data)));
        }
        
    }
</script>