import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { _URLSERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
// import swal from 'sweetalert';
import { UploadFileService } from '../file/upload-file.service';
import { throwError } from 'rxjs/internal/observable/throwError';

declare var swal: any;
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User; // revisar
  token: string;
  menu: any[] = [];
  constructor(public http: HttpClient,
    public router: Router,
    public _uploadFileService: UploadFileService) {
    this.loadStorage();
  }


  RenewToken() {
    let url = _URLSERVICES + '/login/Renewtoken';
    url += '?token' + this.token;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        return true;
      }))
      .pipe(catchError(err => {
       this.router.navigate(['/login']);
        swal('No se pudo renovar el token', 'No fue posible renovar el token', 'error');
        return throwError(err);
      }));
  }
  isLogged() {
    return (this.token.length > 5) ? true : false;
  }
  loadStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
      this.user = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.user = null;
      this.menu = [];
    }
  }

  logout() {
    this.token = '';
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
  }
  saveInStorage(id: string, token: string, user: User, menu: any[] = []) { // revisar usermodelo
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.user = user;
    this.token = token;
    this.menu = menu;
  }
  loginGoogle(token: string) {
    let url = _URLSERVICES + 'login/google';
    return this.http.post(url, { token }).pipe(map((resp: any) => {
      this.saveInStorage(resp.id, resp.token, resp.user, resp.menu);
      return true;
    }));

  }

  login(user: User, remember: boolean = false) {
    if (remember) {
      localStorage.setItem('email', user.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = _URLSERVICES + '/login';
    return this.http.post(url, user)
      .pipe(
        map((resp: any) => {
          this.saveInStorage(resp.id, resp.token, resp.user, resp.menu);
          return true;
        })
      ).pipe(catchError(err => {
        console.log(err.status);
        swal('Error en el login', err.error.message, 'error');
        return throwError(err);

      }));
  }

  createUser(user: User) {
    let url = _URLSERVICES + '/usuario';
    return this.http.post(url, user)
       .pipe(
        map((resp: any) => {
          swal('Usuario creado', user.email, 'success');
          return resp.user;
        })

      ) .pipe(catchError((err: any) => {
        console.log(err.error.errors.message);
         swal(err.error.mensaje, err.error.errors.message, 'error'); 
        return throwError(err);

      }));  
  }
  updateUser(user: User) {
    let url = _URLSERVICES + '/user' + user._id;
    url += '?token=' + this.token;
    return this.http.put(url, user)
      .pipe(
        map((resp: any) => {
          if (user._id === this.user._id) {
            let userDB: User = resp.user;
            this.saveInStorage(userDB._id, this.token, userDB, this.menu);
          }
          swal('Usuario actualizado', user.nombre, 'success');
          return true;
        })

      ).
      pipe(catchError(err => {
        console.log(err.status);
        swal(err.error.message, err.error.errors.message, 'error');
        return throwError(err);

      }));
  }
  changeImg(file: File, id: string) {
    this._uploadFileService.uploadFile(file, 'users', id)
      .then((resp: any) => {
        this.user.img = resp.user.img;
        swal('Imagen Acutualizada', this.user.nombre, 'succes');
        this.saveInStorage(id, this.token, this.user, this.menu);
      });
  }
  loadUsers(from: number = 0) {
    let url = _URLSERVICES + '/user?from=' + from;
    return this.http.get(url);
  }

  searchUsers(value: string) {
    let url = _URLSERVICES + '/search/colection/users/' + value;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.users));
  }
  deleteUser(id: string) {
    let url = _URLSERVICES + '/user/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .pipe(map(resp => {
        swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'succes');
        return true;
      }));
  }
}
