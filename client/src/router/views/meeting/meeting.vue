<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import { utilsStorage } from '@/state/modules/utilsStorage.js';
import Create from "@/components/widgets/meeting/create";
import { ContentLoader } from 'vue-content-loader'
import EmptyList from "@/components/widgets/emptylist";
import Upload from "@/components/widgets/fileselector";
import Swal from "sweetalert2";
const axios = require('axios')
/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Meeting",
    meta: [{ name: "description", content: appConfig.description }],
    path : ""
  },
  components: { Layout,Create,EmptyList,ContentLoader,Upload},
  data() {
    return {
      title: "Meeting",
      haveMeeting : false,
      showHistory : true,
      activeMeeting : null,
      expanHistory : true,
      listMeeting : [],
      loadingLoadData : false,
      selectedRoom : null,
      visibleSelected : true,
      loadingSelected : false,
      userName : "",
      visibleInfoSelected:false,
      tmpfile : null,
      listFiles : []
    };
  },
  mounted(){
      this.userName = utilsStorage.getName()
      this.checkActiveMeeting()
      this.getListMeeting()
  },
  methods : {
      getListMeeting(){
        this.loadingLoadData = true
        this.$refs.lay.$refs.topProgress.start()
        utilsStorage.getListMeetingChannel((res)=>{
            if(res){
              this.listMeeting = res
            }else{
              this.listMeeting = []
            }
            this.$refs.lay.$refs.topProgress.done()
            this.loadingLoadData = false
        })
      },
      create(){
          if(this.haveMeeting){
            window.open(this.activeMeeting.hostLink, "_blank");
          }else{
            this.$bvModal.show('modal-share')
          }
      },
      checkActiveMeeting(){
        this.$refs.lay.$refs.topProgress.start()
        utilsStorage.checkMeetingActive((res)=>{
            if(res){
              this.haveMeeting = true
              this.activeMeeting = res
            }else{
              this.haveMeeting = false
              this.activeMeeting = null
            }
            this.$refs.lay.$refs.topProgress.done()
        })
      },
      openHistory(){
          this.showHistory = true
      },
      ExpandHistory(){
        this.expanHistory = !this.expanHistory
      },
      refresh(){
        this.getListMeeting()
        this.checkActiveMeeting()
      },
      refreshSelected(){
        
      },
      ExpandSelected(){
        this.visibleSelected = !this.visibleSelected
      },
      Detail(e){
        utilsStorage.roomId = e.id
        this.selectedRoom = e
        this.expanHistory = false
        this.getListFile(e.id)
      },
      infoSelected(){
        this.visibleInfoSelected = !this.visibleInfoSelected
      },
      refreshFile(){
        if(this.selectedRoom){
          this.getListFile(this.selectedRoom.id)
        }
      },
      copy(text){
          var elmnt = document.createElement("textarea");
          elmnt.value = text;
          elmnt.style.top = "0"
          elmnt.style.left = "0"
          elmnt.style.position = "fixed"
          document.body.appendChild(elmnt)
          elmnt.focus()
          elmnt.select();
          elmnt.setSelectionRange(0, 99999)
          document.execCommand("copy");
          this.$toasted.show("Copied",{
              position : 'bottom-right',
              duration : 2000
          })
      },
      getListFile(id){
        this.$refs.lay.$refs.topProgress.start()
        utilsStorage.listMeetingFile(id,(res)=>{
            if(res){
                res = res.map((v)=>{
                    let icon = utilsStorage.geticonSearch(v.filename)
                    v.icon = icon.icon
                    v.color = icon.color
                    v.link = utilsStorage.host.replace("api/cms/", "")+v.filename
                    return v
                })
              this.listFiles = res
            }else{
              this.listFiles = []
            }
            this.$refs.lay.$refs.topProgress.done()
        })
      },
      Open(e){
        this.$refs.lay.$refs.topProgress.start()
        let link = e.link
        link = link.replace(/\s/g,"%20")
          axios({
            method: 'get',
            url: link,
            responseType: 'arraybuffer'
          })
          .then(response => {
            this.forceFileDownload(response,e.filename)
            this.$refs.lay.$refs.topProgress.done()
            
          })
          .catch((e) =>{console.log(e)} )
      },
      forceFileDownload(response,name){
        this.$toasted.clear()
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
          link.setAttribute('download',name) //or any other extension
        document.body.appendChild(link)
        link.click()
      },
      DeleteRoom(e){
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger ml-2"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "No, cancel!",
              showCancelButton: true
            })
            .then(result => {
              if (result.value) {
                this.$refs.lay.$refs.topProgress.start()
                utilsStorage.deleteMeetingChannel(e.id,(res)=>{
                    if(res){
                      if(res.success){
                          swalWithBootstrapButtons.fire(
                            "Deleted!",
                            `${res.message}`,
                            "success"
                          );
                      }else{
                          swalWithBootstrapButtons.fire(
                            "Cancelled",
                            `${res.message}`,
                            "error"
                          );
                      }
                    }else{
                      swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Deleted Failed",
                        "error"
                      );
                    }
                    this.refresh()
                    this.$refs.lay.$refs.topProgress.done()
                })
              } else{
                result.dismiss === Swal.DismissReason.cancel
              }
            });
      },
      DeleteFile(e){
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger ml-2"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "No, cancel!",
              showCancelButton: true
            })
            .then(result => {
              if (result.value) {
                this.$refs.lay.$refs.topProgress.start()
                utilsStorage.deleteMeetingFile(e.id,(res)=>{
                    if(res){
                      if(res.success){
                          swalWithBootstrapButtons.fire(
                            "Deleted!",
                            `${res.message}`,
                            "success"
                          );
                      }else{
                          swalWithBootstrapButtons.fire(
                            "Cancelled",
                            `${res.message}`,
                            "error"
                          );
                      }
                    }else{
                      swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Deleted Failed",
                        "error"
                      );
                    }
                    this.refreshFile()
                    this.$refs.lay.$refs.topProgress.done()
                })
              } else{
                result.dismiss === Swal.DismissReason.cancel
              }
            });
      },
      showUpload(){
        this.$bvModal.show('modal-upload')
      }
  }
};
</script>

<template>
  <Layout ref="lay">
    <!-- start page title -->
    <div class="row">
      <div class="col-md-2 col-lg-2 col-sm-3">
          <div :class="`card meeting-card ${haveMeeting ? 'active' : ''}`" @click="create()">
              <div class="card-body d-flex flex-column p-4  justify-content-center align-items-center">
                  <i v-if="haveMeeting" class="bx bx-video d-block check-nav-icon mt-4 text-green mb-2" style="font-size:42px"></i>
                  <i v-else class="bx bxs-video-plus d-block check-nav-icon mt-4 text-green mb-2" style="font-size:42px"></i>
                  <h3 class="mt-2 font-size-16" v-if="haveMeeting">{{activeMeeting.room}} </h3>
                  <h3 class="mt-2 font-size-16" v-else>New Meeting</h3>
                  <small v-show="haveMeeting" class="text-muted">Klik for access your meeting room</small>
              </div>
          </div>
      </div>
      <div class="col-md-10 pb-4">

        <div class="card history-meeting ">
          <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title ">Room Meeting History</h4>
              <div class="iconBtn">
                <i class="fas fa-history text-green icon-btn font-size-18 mx-2" @click="refresh()" v-b-tooltip.hover title="Refresh"></i>
                <i :class="`fas ${expanHistory ? 'fa-chevron-down' : 'fa-chevron-left'} text-green icon-btn font-size-18 mx-2`" @click="ExpandHistory()" aria-controls="historyBody" v-b-tooltip.hover title="Expand"></i>
              </div>
          </div>
          <b-collapse id="historyBody" class="card-body" v-model="expanHistory">
            <b-list-group v-if="loadingLoadData">
                <b-list-group-item v-for="i in 10" :key="i" class="pl-0">
                    <ContentLoader height="12" primaryColor="#dedede" secondaryColor="#f5f5f5">
                        <rect x="0" y="0" rx="0" ry="3" width="100" height="6" />
                        <rect x="0" y="8" rx="0" ry="3" width="300" height="4" />
                    </ContentLoader>
                </b-list-group-item>
            </b-list-group>
            
            <EmptyList title="You no have history meeting channel" v-if="!loadingLoadData && listMeeting.length ===0"/>

            <b-list-group v-if="listMeeting.length != 0 && !loadingLoadData">
                <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="(i,index) in listMeeting" :key="index">
                    <div class="d-flex flex-column justify-content-center align-items-start">
                        <span>
                            Room :
                            <b> {{i.room}}
                            <b-badge variant="danger"  v-if="i.expired" pill>Closed</b-badge>
                            <b-badge variant="success" v-else pill>Open</b-badge>
                        </b>
                        </span>
                    </div>
                    <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                        <template v-slot:button-content>
                            <i class="fas fa-grip-vertical text-green font-size-14"></i>
                        </template>
                        <b-dropdown-item-button  @click="Detail(i)"><i class="bx bx-info-circle text-primary pr-2"></i> Detail</b-dropdown-item-button>
                        <b-dropdown-divider v-if="!i.expired"></b-dropdown-divider>
                        <b-dropdown-item-button  @click="copy(i.link)"><i class="bx bx-copy text-primary pr-2"></i> Copy Link</b-dropdown-item-button>
                        <b-dropdown-divider v-if="!i.expired"></b-dropdown-divider>
                        <b-dropdown-item-button  @click="DeleteRoom(i)"><i class="fas fa-trash text-danger pr-2"></i> Delete Room</b-dropdown-item-button>
                    </b-dropdown>
                </b-list-group-item>
            </b-list-group>
          </b-collapse>
        </div>

        <div class="card history-meeting" v-if="selectedRoom != null">

          <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title ">Detail Room {{selectedRoom.room}}</h4>
              <div class="iconBtn">
                <i class="fas fas fa-info-circle text-green icon-btn font-size-18 mx-2" @click="infoSelected()" v-b-tooltip.hover aria-controls="infoSelected" :title="`Info Room ${selectedRoom.room}`"></i>
                <i :class="`fas ${visibleSelected ? 'fa-chevron-down' : 'fa-chevron-left'} text-green icon-btn font-size-18 mx-2`" @click="ExpandSelected()" aria-controls="SelectedBody" v-b-tooltip.hover title="Expand"></i>
              </div>
          </div>

          <b-collapse id="SelectedBody" class="card-body" v-model="visibleSelected">
            <b-list-group v-if="loadingSelected">
                <b-list-group-item v-for="i in 10" :key="i" class="pl-0">
                    <ContentLoader height="12" primaryColor="#dedede" secondaryColor="#f5f5f5">
                        <rect x="0" y="0" rx="0" ry="3" width="100" height="6" />
                        <rect x="0" y="8" rx="0" ry="3" width="300" height="4" />
                    </ContentLoader>
                </b-list-group-item>
            </b-list-group>
            
            <EmptyList title="You no have history meeting channel" v-if="!loadingSelected && selectedRoom === null"/>

            <div v-if="selectedRoom !== null && !loadingSelected">
              <b-collapse id="infoSelected" v-model="visibleInfoSelected">
                <table class="table table-centered">
                  <tbody>
                    <tr>
                      <td>Room Name </td>
                      <td> : </td>
                      <td><strong>{{selectedRoom.room}}</strong></td>
                    </tr>
                    <tr>
                      <td>Host </td>
                      <td> : </td>
                      <td><strong>{{userName}}</strong></td>
                    </tr>
                    <tr>
                      <td>Status </td>
                      <td> : </td>
                      <td><strong>{{selectedRoom.opened ? "Room Opened" : "Room Closed"}}</strong></td>
                    </tr>
                    <tr>
                      <td>Created Date</td>
                      <td> : </td>
                      <td><strong>{{selectedRoom.created}}</strong></td>
                    </tr>
                    <tr>
                      <td>Will Expire On</td>
                      <td> : </td>
                      <td><strong>{{selectedRoom.expiredOn}}</strong></td>
                    </tr>
                    <tr>
                      <td>Link</td>
                      <td> : </td>
                      <td><strong><i>{{selectedRoom.link}}</i></strong></td>
                    </tr>
                  </tbody>
                </table>
              </b-collapse>
              <div class="row">
                <div class="col-md-12">
                  <div class="card card-listFiles">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="card-title ">List File on Room {{selectedRoom.room}}</h4>
                        <div class="iconBtn">
                          <i class="fas fa-cloud-upload-alt text-green icon-btn font-size-18 mx-2" @click="showUpload()" v-b-tooltip.hover :title="`Upload File on ${selectedRoom.room}`"></i>
                          <i class="fas fa-history text-green icon-btn font-size-18 mx-2" @click="refreshFile()" v-b-tooltip.hover title="Refresh"></i>
                        </div>
                    </div>
                    <div class="card-body">
                        <b-list-group v-if="listFiles.length != 0">
                            <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="(i,index) in listFiles" :key="index">
                                <div class="d-flex justify-content-center align-items-start">
                                    <h5 :class="`mb-0 pr-2 font-size-24 ${i.color}`"><i :class="i.icon"></i></h5>
                                    <div class="d-flex flex-column justify-content-center align-items-start">
                                        <span>
                                            <b> {{i.filename}} </b>
                                        </span>
                                        <small class="text-muted"><i>{{i.link}}</i></small>
                                    </div>
                                </div>
                                <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
                                    <template v-slot:button-content>
                                        <i class="fas fa-grip-vertical text-green font-size-14"></i>
                                    </template>
                                    <b-dropdown-item href="javascript:void(0);" @click="Open(i)"><i class="bx bx-share text-green pr-2"></i> Download File</b-dropdown-item>
                                    <b-dropdown-divider></b-dropdown-divider>
                                    <b-dropdown-item href="javascript:void(0);" @click="DeleteFile(i)"><i class="fas fa-times-circle text-danger pr-2"></i> Delete Share File</b-dropdown-item>
                                </b-dropdown>
                            </b-list-group-item>
                        </b-list-group>
                        <EmptyList title="No found shared file on your meeting" v-else/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>

        </div>
      </div>
    </div>
    
    <b-modal id="modal-share" centered no-close-on-backdrop no-close-on-esc  title="Create Meeting"
      ref="modal-share"
      :hide-header="true"
      :hide-footer="true"
      size="lg"
      :hide-header-close="true">
        <Create  title="Create Meeting"/>
    </b-modal>

    <b-modal id="modal-upload" centered no-close-on-backdrop no-close-on-esc title="New Folder"
      ref="modalUpload"
      :hide-header="true"
      :hide-footer="true"
      :hide-header-close="true"
    >
        <Upload  ref="uploadForm"  :file="tmpfile"/>
    </b-modal>

  </Layout>
</template>
