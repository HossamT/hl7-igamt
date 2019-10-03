import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import * as froala from '../../../config/froala.json';
import {selectIgId, selectWorkspaceActive} from '../../../root-store/ig/ig-edit/ig-edit.selectors';

@Injectable({
  providedIn: 'root',
})
export class FroalaService {
  config;
  constructor(private http: HttpClient, private store: Store<any>) {
    const staticConfig = {key: froala.key};
    this.config = {...  staticConfig,
      placeholderText: '',
      imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
      fileUploadURL: '/api/storage/upload',
      fileAllowedTypes: ['application/pdf', 'application/msword', 'application/x-pdf', 'text/plain', 'application/xml', 'text/xml'],
      charCounterCount: false,
      quickInsertTags: [''],
      immediateAngularModelUpdate: true,
      events: {
        'froalaEditor.image.beforeUpload': (images) => {
          console.log('Before upload');
          console.log(images);
        },
        'froalaEditor.image.uploaded': (response) => {
          console.log('froalaEditor.image.uploaded');
          console.log(response);
        },
        'froalaEditor.image.inserted': ($img, response) => {
          console.log('froalaEditor.image.inserted');
          console.log(response);
          console.log($img);
        },
        'froalaEditor.image.replaced': ($img, response) => {
          console.log('froalaEditor.image.replaced');
          console.log(response);
          console.log($img);
        },
        'image.error': (error, response) => {
          console.log(error);
          console.log(response);
        },
      },
      imageResize: true,
      pastePlain: true,
    };
  }
  getConfig(): Observable<any> {
    return this.store.select(selectWorkspaceActive).pipe(
      withLatestFrom(this.store.select(selectIgId)),
      map(([active, igId]) => {
          return {
            ...this.config,
            imageUploadURL: '/api/storage/upload/',
            imageManagerLoadURL: '/api/storage/file',
            imageUploadParams: {
              ig: igId,
              type: active.editor.resourceType,
              id: active.display.id,
            },
            events: {... this.config.events,
              'froalaEditor.image.removed': ($img, obj1, obj2) => {
                const index = obj2[0].src.indexOf('=');
                const name = obj2[0].src.substring(index + 1);
                this.http.delete('/api/storage/file?name=' + name + '&ig=' + igId + '&type=' + active.editor.resourceType + '&id=' + active.display.id).subscribe();
              },
            },
          };
        }),
      );
  }
}
