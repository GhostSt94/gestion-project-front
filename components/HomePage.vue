<template>
  <div class="container text-center pt-5 min-vh-100 position-relative">
    <div class="row pt-lg-5">
      <div class="col-md-8">
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mx-3"></i>
        <table v-else class="table table-hover h-50">
          <thead class="fw-bold">
            <td>Projets</td>
            <td>Client</td>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project._id" @click="redirectToDetails(project._id)">
              <td>{{project.nom}}</td>
              <td>{{project.client}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-4 align-middle">
        <button @click="redirectToAdd" class="btn btn-outline-primary rounded-circle" title="Ajouter projet"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "@vertx/eventbus-bridge-client.js";
export default {
  name:"HomePage",
  data(){
    return{
      projects:[],
      loading:true
    }
  },
  methods:{
    redirectToAdd(){
      this.$router.push('/ajouter')
    },
    redirectToDetails(id){
      this.$router.push(`/project/${id}`)
    }
  },
  mounted(){
    var ref=this
    var eb = new EventBus('http://localhost:8888/eventbus');
    eb.onopen = function() {
        console.log('connected');
        eb.send('get.project.all', "",(err,msg) =>{
          if(err){
            ref.loading=false
            console.log(err);
            return
          }
          ref.loading=false
          ref.projects=msg.body
          console.log(ref.projects);
        });
    };
    eb.onclose = function() {
        console.log("disconnected");
        eb = null;
    };
  }
}
</script>

<style>
  
  tr:hover{
    cursor: pointer;
  }
</style>