<template>
  <!-- Modal -->
    <div class="modal fade" id="ProjectFileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Ajouter fichier</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-3">
            <div class="mb-3">
                <input class="form-control" type="file" id="projectfile" accept=".pdf">
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
// import EventBus from "@vertx/eventbus-bridge-client.js";
import axios from "axios";
export default {
    name:"FactureModal",
    data(){
        return{
            err:"",
            loading:false,
            success:false
        }
    },
    methods:{
        addFacture(){
            const file=document.querySelector("input[id='projectfile']")
            if(file.files[0]===undefined){
                this.err="Veuillez Ajouter un fichier"
                return
            }
            this.success=false
            this.loading=true
            
                
            this.saveFile(this.$route.params.id,file)
            // eb.send("get.facture.all",ref.$route.params.id,(err,msg)=>{
            //     if(err){
            //         console.log(err)
            //         return
            //     }
            //     ref.$emit("new-facture",{msg:msg.body})
            // })
            // console.log(msg);
            
        },
        saveFile(id,file){
            if(this.err==""){
                var myFormData = new FormData();
                myFormData.append('file', file.files[0]);
                axios.post(`http://localhost:8888/project/save/${id}`,myFormData)
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