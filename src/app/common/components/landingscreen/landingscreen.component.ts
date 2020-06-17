import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from '../../services/audio-recording-service.service';

@Component({
  selector: 'app-landingscreen',
  templateUrl: './landingscreen.component.html',
  styleUrls: ['./landingscreen.component.scss']
})
export class LandingscreenComponent implements OnInit {
  isRecording = false;
  recordedTime: any;
  blobUrl: any;
  blobData: any;
  @Input() hidecircle;
  constructor(private sanitizer: DomSanitizer, private audioRecordingService: AudioRecordingService,) { }

  ngOnInit() {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobData = data.blob;
      //this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }
  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }
  storeRecordingIntoDB() {
    let that = this;
    //Creating an indexDB - Used to store users information.  
    let indexedDB = window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'] || window['msIndexedDB'];

    //If the user doesnt support indexedDB then run..
    if (!window.indexedDB) {
      
    } else {

      //Create a profile database
      var database = indexedDB.open("ProfileDatabase", 1);

      //Do something if error occurs to create it 
      database.onerror = function (event) {

        alert('Error creating database');

      }

      //If the database is created run.
      database.onsuccess = function (event: any) {

        let db = event.target.result;

        var transaction = db.transaction(["audiofile"], 'readwrite');

        transaction.objectStore("audiofile").put(that.blobData, 'lesson1_class1');

      }

      //Create a a varbile to store info that needs to be added to database.
      var book1 = { isbn: "028", name: "Programming" };

      //On upgrade needed.
      database.onupgradeneeded = function (event: any) {

        var db = event.target.result;
        if (!db.objectStoreNames.contains("audiofile")) {

          //Add to indexDB
          db.createObjectStore("audiofile", { keypath: "isbn" });

        }

      }

    }
  }

  getRecordingFromDB() {
    let _this = this;
    let indexedDB = window.indexedDB;
    let DBOpenRequest = indexedDB.open("ProfileDatabase", 1);
    DBOpenRequest.onsuccess = function(event) {
      let db = DBOpenRequest.result;
      let transaction = db.transaction(["audiofile"], "readwrite");
      let objectStore = transaction.objectStore("audiofile");
      let objectStoreRequest = objectStore.get("lesson1_class1");
      console.log(objectStoreRequest);
      objectStoreRequest.onsuccess = function(event: any) {
        _this.blobUrl = _this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.result));
      }
    };
  }

}
