<template>
  <!-- Modal -->
    <div class="modal fade" id="factureModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Ajouter facture</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-3">
            <div class="form-floating mb-3">
                <input v-model="date" type="date" class="form-control" id="floatingInput1" >
                <label for="floatingInput1">Date</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="montant" type="number" min="0" step="100" class="form-control" id="floatingInput2" >
                <label for="floatingInput2">Montant</label>
            </div>
            <div class="row mb-3">
                    <div class="col-3">
                        <label class="h5">Status :</label>
                    </div>
                    <div class="col-9">
                        <select v-model="status" class="form-select" aria-label="status">
                            <option value="prévu">Prévu</option>
                            <option value="envoyer">Envoyer</option>
                            <option value="payer">Payer</option>
                        </select>
                    </div>
            </div>
            <div class="mb-3">
                <label for="formFile" class="form-label">Fichier :</label>
                <input class="form-control" type="file" id="formFile" accept=".pdf">
            </div>
            <div v-if="err!=''" class="alert alert-danger">
                {{err}}
            </div>
        </div>
        <div class="modal-footer">
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mx-3"></i>
            <i v-if="success" class="fa-solid fa-check text-success fa-lg"></i>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" @click="addFacture">Ajouter</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import EventBus from "@vertx/eventbus-bridge-client.js";
import axios from "axios";
export default {
    name:"FactureModal",
    data(){
        return{
            date:null,
            montant:0,
            status:"",
            err:"",
            loading:false,
            success:false
        }
    },
    methods:{
        addFacture(){
            const file=document.querySelector("input[type='file']")
            if(this.date===null || this.montant===0 ||this.status===""||file.files[0]===undefined){
                this.err="Veuillez remplir tous les champs"
                return
            }
            if(file.files[0].type!=='application/pdf'){
                this.err="Format fichier invalid"
                return
            }
            this.success=false
            this.loading=true
            const facture={
                date:this.date,
                montant:this.montant,
                status:this.status,
                type:"facture",
                id_project:this.$route.params.id
            }
            
            var ref=this
            var eb = new EventBus('http://localhost:8888/eventbus');
            eb.onopen = function() {
                eb.send('add.facture', facture,(err,msg) =>{
                if(err){
                    ref.loading=false
                    ref.err="Error"
                    console.log(err);
                    return
                }
                ref.err=""
                ref.montant=0
                ref.status=""
                ref.date=null
                
                ref.saveFile(msg.body,file)
                eb.send("get.facture.all",ref.$route.params.id,(err,msg)=>{
                    if(err){
                        console.log(err)
                        return
                    }
                    ref.$emit("new-facture",{msg:msg.body})
                })
                console.log(msg);
                });
            };
            eb.onclose = function() {
                console.log("disconnected");
                eb = null;
            };
        },
        saveFile(id,file){
            if(this.err==""){
                var myFormData = new FormData();
                myFormData.append('file', file.files[0]);
                axios.post(`http://localhost:8888/facture/save/${id}`,myFormData)
                .then(res=>{
                    console.log(res.data)
                    this.loading=false
                    this.success=true
                    file.value=""
                })
                .catch(err=>{
                    console.error(err)
                    this.err="error uploading file"
                })
            }
        }
    }
}
</script>

<style>

</style>