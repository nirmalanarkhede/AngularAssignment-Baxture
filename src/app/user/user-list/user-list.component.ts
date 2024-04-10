import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  allUsersData:any = []
  showMessage:boolean = false;

  constructor(private router: Router, private service: DataService){}

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData(){
    this.service.getData().subscribe((res)=> {
      if(res){
        this.allUsersData = res
        console.log('table data', this.allUsersData)
      }
    })
  }

  deleteUserDetails(id: number){
    this.service.deleteData(id).subscribe((res)=> {
      if(res){
        console.log('user deleted successfully')
      }
      this.getUsersData();
      this.showMessage = true;
      setTimeout(() => {
        this.hideMessage();
      }, 2000) 
    })
  }

  editUserDetails(user:number){
    console.log('edit user', user)
    this.service.getDataFromTable(user);
    this.router.navigate(['/user-upsert'])
  }

  hideMessage(){
    this.showMessage = false;
  }

  goToAddUser(){
    this.router.navigate(['/user-upsert'])
    this.service.getDataFromTable()
  }

}
