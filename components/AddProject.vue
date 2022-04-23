<template>
  <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 mt-4 py-4 px-3 rounded shadow">
                <i @click="back" class="fa-solid fa-arrow-left-long float-start text-secondary back"></i>
                <h3 class="text-center p-2">Ajouter project</h3>
                <div class="form-floating mb-3">
                    <input v-model="nom" type="text" class="form-control" id="floatingInput1" >
                    <label for="floatingInput1">Nom</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model="client" type="text" class="form-control" id="floatingInput2" >
                    <label for="floatingInput2">Client</label>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input v-model="date_debut" type="date" class="form-control" id="floatingInput3">
                            <label for="floatingInput3">Date debut</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input v-model="date_fin" type="date" class="form-control" id="floatingInput4" >
                            <label for="floatingInput4">Date fin</label>
                        </div>
                    </div>
                </div>  
                <div class="row my-4">
                    <div class="col-3">
                        <label class="h5">Status :</label>
                    </div>
                    <div class="col-9">
                        <select v-model="status" class="form-select form-select-md" aria-label=".form-select-sm">
                            <option value="Prospecter">Prospecter</option>
                            <option value="En cours">En cours</option>
                            <option value="Reception provisoir">Reception provisoir</option>
                            <option value="Reception définitif">Reception définitif</option>
                            <option value="Cloturer">Cloturer</option>
                        </select>
                    </div>
                    
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input v-model="montant" type="number" class="form-control" min="0" step="100" id="floatingInput5" >
                            <label for="floatingInput3">Montant DH</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input v-model="garantie" type="number" class="form-control" min="0" step="100" id="floatingInput6">
                            <label for="floatingInput4">Garantie DH</label>
                        </div>
                    </div>
                </div>
                <div v-if="error!=''" class="alert alert-danger">{{error}}</div>
                <div class="float-end">
                    <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mx-3"></i>
                    <button @click="addProject" class="btn btn-primary">Ajouter</button>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import EventBus from "@vertx/eventbus-bridge-client.js";
import Swal from 'sweetalert2'

export default {
    data(){
        return{
            nom:"",
            client:"",
            date_debut:null,
            date_fin:null,
            status:"",
            montant:0,
            garantie:0,
            error:'',
            loading:false
        }
    },
    methods:{
        back(){
            this.$router.back()
        },
        addProject(){
            if(this.nom===""||this.client===""||this.date_debut===null||this.date_fin===""||this.status===""||this.montant===0||this.garantie===0){
                this.error="rempliser tous les champs"
                return
            }
            if(new Date(this.date_fin).setHours(0,0,0,0)-new Date(this.date_debut).setHours(0,0,0,0)<=0){
                this.error="Date fin inférieur à date debut"
                return
            }
            this.loading=true
            this.error=""
            var ref=this
            var eb = new EventBus('http://localhost:8888/eventbus');
            eb.onopen = function() {
                const project={
                    nom:ref.nom,
                    client:ref.client,
                    date_debut:ref.date_debut,
                    date_fin:ref.date_fin,
                    status:ref.status,
                    montant:ref.montant,
                    garantie:ref.garantie,
                    type:'project'
                }
                eb.send('add.project',project,(err,msg)=>{
                    if(err){
                        console.log(err);
                        ref.loading=false
                        ref.error="Error inserting the project"
                    }
                    console.log(msg);
                    ref.loading=false
                    Swal.fire('Projet Ajouté')
                    ref.$router.back()
                });
            };
            eb.onclose = function() {
                console.log("disconnected");
                eb = null;
            };
        }
    }
}
</script>

<style scoped>
    .back{
        cursor: pointer;
        color: black;
    }
</style>