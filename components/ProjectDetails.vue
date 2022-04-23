<template>
    <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mx-3 fa-2xl position-absolute start-50 top-50 translate-middle"></i>
    <div v-else class="container-fluid">
        <div v-if="not_found" class="position-absolute start-50 top-50 translate-middle text-center">
            <h2 class="text-muted">NOT FOUND</h2>
            <router-link to="/">Home</router-link>
        </div>
        <div v-else class="container pt-5">
            <div class="row justify-content-evenly mb-4">
                <div class="col-md-6 bg-white py-3 rounded shadow-sm">
                    <div class="float-end">
                        <i v-if="!updating" @click="toggleUpdate" class="fa-solid fa-pen-to-square fa-lg text-warning m-3"></i>
                        <i v-else @click="toggleUpdate" class="fa-solid fa-xmark fa-lg m-3"></i>
                        <i @click='deleteProject(project._id)' class="fa-solid fa-trash-can fa-lg text-danger m-3"></i>
                    </div>
                    <div class="row justify-content-center text-center">
                        <div class="col-6 mb-3">
                            <span class="text-muted">Name</span><br> 
                            <input v-if="updating" type="text" class="form-control" v-model="project.nom">
                            <span v-else class="h5 fw-bold">{{project.nom}}</span>                
                        </div>
                        <div class="col-6 mb-3">
                            <span class="text-muted">Client</span><br> 
                            <input v-if="updating" type="text" class="form-control" v-model="project.client">
                            <span v-else class="h5 fw-bold">{{project.client}}</span>
                        </div>
                        <div class="col-12 mb-3">
                            <table class="table table-borderless">                                
                                <tbody>
                                    <tr class="text-muted">
                                        <td>Date Debut</td>
                                        <td></td>
                                        <td>Date Fin</td>
                                    </tr>
                                    <tr class="fw-bold">
                                        <td>
                                            <input v-if="updating" type="date" class="form-control" v-model="project.date_debut">
                                            <span v-else>{{project.date_debut}}</span>
                                        </td>
                                        <td><i class="fa-solid fa-arrow-right-long"></i></td>
                                        <td>
                                            <input v-if="updating" type="date" class="form-control" v-model="project.date_fin">
                                            <span v-else>{{project.date_fin}}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12 mb-3">
                            <span class="text-muted">Status</span><br> 
                            <select v-if="updating" v-model="project.status" class="form-select form-select-md" aria-label=".form-select-sm">
                                <option value="Prospecter">Prospecter</option>
                                <option value="En cours">En cours</option>
                                <option value="Reception provisoir">Reception provisoir</option>
                                <option value="Reception définitif">Reception définitif</option>
                                <option value="Cloturer">Cloturer</option>
                            </select>
                            <span v-else class="h5 fw-bold">{{project.status}}</span>
                        </div>
                        <div class="col-6 mb-3">
                            <span class="text-muted">Montant</span><br> 
                            <input v-if="updating" type="number" min="0" step="100" class="form-control" v-model="project.montant">
                            <span v-else class="h5 fw-bold">{{project.montant}} DH</span>
                        </div>
                        <div class="col-6 mb-3">
                            <span class="text-muted">Garantie</span><br> 
                            <input v-if="updating" type="number" min="0" step="100" class="form-control" v-model="project.garantie">
                            <span v-else class="h5 fw-bold">{{project.garantie}} DH</span>
                        </div>
                    </div>
                    <button v-if="updating" @click="updateProject" class="btn btn-warning float-end">Modifier</button>
                </div>
                <div class="col-md-4 mt-3 bg-white py-3 rounded shadow-sm text-center h-50 factures">
                    <button type="button" class="btn btn-outline-primary border-0 float-end" data-bs-toggle="modal" data-bs-target="#ProjectFileModal">
                        <i class="fa-solid fa-plus fa-lg"></i>
                    </button>
                    <h4>Files</h4>
                    <hr>
                    <h6 v-if="files.length===0" class="text-muted">Aucun File</h6>
                    <div v-else>
                        
                    </div>
                </div>
            </div>
            <div class="row justify-content-center text-center mb-3">
                <div class="col-10 bg-white rounded shadow p-3">
                    <button type="button" class="btn btn-outline-primary border-0 m-1 float-end" data-bs-toggle="modal" data-bs-target="#factureModal">
                        <i class="fa-solid fa-plus fa-lg"></i>
                    </button>
                    <h4>Factures</h4><hr>
                    <h6 v-if="factures.length===0" class="text-muted">Aucune Facture</h6>
                    <table v-else class="table table-striped">
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Montant</td>
                                <td>Status</td>
                                <td>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="facture in factures" :key="facture._id">
                                <td class="text-success">{{facture.date}}</td>
                                <td>{{facture.montant}} DH</td>
                                <td>{{facture.status}}</td>
                                <td><i  @click="(e)=>deleteFacture(e,facture._id)" class="fa-solid fa-xmark text-muted opacity-25"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <FactureModal @new-facture="newFactures"/>
    <ProjectFileModal />
</template>

<script>
import EventBus from "@vertx/eventbus-bridge-client.js";
import FactureModal from "./project-details/FactureModal.vue";
import ProjectFileModal from "./project-details/ProjectFileModal.vue";
import Swal from "sweetalert2"

export default {
    name:"ProjectDetails",
    components:{
        FactureModal,ProjectFileModal
    },
    data(){
        return{
            project:{
                _id:"",
                nom:"",
                client:"",
                date_debut:null,
                date_fin:null,
                status:"",
                montant:0,
                garantie:0,
            },
            loading:true,
            not_found:false,
            updating:false,
            factures:[],
            files:[],
            // 
            error:'',
        }
    },
    methods:{
        toggleUpdate(){
            this.updating=!this.updating
        },
        newFactures({msg}){
            this.factures=msg
        },
        deleteProject(id){
            var ref=this
            Swal.fire({
                title: 'Supprimer ce projet ?',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        var eb = new EventBus('http://localhost:8888/eventbus');
                        eb.onopen = function() {
                            eb.send('delete.project', id,(err,msg) =>{
                                if(err){
                                    console.log(err);
                                    return
                                }
                                Swal.fire('Projet Supprimé')
                                console.log(msg);
                                ref.$router.back()
                            });
                        }
                    } 
                })
            
        },
        updateProject(){
            var ref=this
            Swal.fire({
                title: 'Modifier ce projet ?',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        var eb = new EventBus('http://localhost:8888/eventbus');
                        eb.onopen = function() {
                            eb.send('update.project', ref.project,(err,msg) =>{
                                if(err){
                                    console.log(err);
                                    return
                                }
                                console.log(msg);
                                ref.updating=false;
                                Swal.fire('Projet Modifié')
                                ref.getProject(eb,ref)
                            });
                        }
                    } 
                })
        },
        deleteFacture(e,id){
            Swal.fire({
                title: 'Supprimer cette Facture ?',
                showCancelButton: true,
                confirmButtonText: 'Confirmer',
                }).then((result) => {
                    if (result.isConfirmed) {
                        var eb = new EventBus('http://localhost:8888/eventbus');
                        eb.onopen = function() {
                            eb.send('delete.facture', id,(err,msg) =>{
                                if(err){
                                    console.log(err);
                                    return
                                }
                                e.target.closest('tr').remove()
                                console.log(msg);
                            });
                        }
                    } 
                })
        },
        getProject(eb,ref){
            eb.send('get.project', ref.$route.params.id,(err,msg) =>{
                if(err){
                    if(err.failureCode===404){
                        ref.not_found=true
                    }
                    ref.loading=false
                    console.log(err);
                    return
                }
                ref.loading=false
                ref.project=msg.body
                console.log(ref.project);
            });
        }
    },
    mounted(){
        var ref=this
        var eb = new EventBus('http://localhost:8888/eventbus');
        eb.onopen = function() {
            console.log('connected');
            ref.getProject(eb,ref)
            // eb.send('get.project', ref.$route.params.id,(err,msg) =>{
            //     if(err){
            //         if(err.failureCode===404){
            //             ref.not_found=true
            //         }
            //         ref.loading=false
            //         console.log(err);
            //         return
            //     }
            //     ref.loading=false
            //     ref.project=msg.body
            //     console.log(ref.project);
            // });
            eb.send("get.facture.all",ref.$route.params.id,(err,msg)=>{
                if(err){
                    console.log(err)
                    return
                }
                ref.factures=msg.body
                console.log(msg)
            })
        };
        eb.onclose = function() {
            console.log("disconnected");
            eb = null;
        };
    }
}
</script>

<style>
    .fa-solid:hover{
        cursor: pointer;
    }
    .list-group{
        max-height: 250px;
        overflow-y: scroll;
    }
    .fa-xmark:hover{
        opacity: 1 !important;
    }
</style>