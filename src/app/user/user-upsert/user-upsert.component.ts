import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrl: './user-upsert.component.css'
})
export class UserUpsertComponent implements OnInit {

  showMessage:boolean = false;
  allUsers:any = []
  message:string = ''
  userToEdit:any;

  constructor(private router: Router, private fb: FormBuilder, private service: DataService){}

  ngOnInit(): void {
    this.getAllUsers();
    this.getTableData();
  
  }
  
  userDetailsForm :FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    phone: ['', [Validators.required]],
    address: ['', Validators.required]
  })

   
  addUserData(){
    if(this.checkIfUserExists()){
      if(this.result==true){
        this.message = 'User Already Exists !!'

      }
      this.showMessage = true;
      setTimeout(()=> {
        this.hideMessage();
        this.userDetailsForm.reset();
      }, 2000)
    }else{
      this.service.addData(this.userDetailsForm.value).subscribe((res)=>{
        if(res){
          if(this.result==false){
            this.message = 'User Added Successfully !!'
          }
        }
        this.userDetailsForm.reset();
      })
      this.showMessage = true;
    }

    this.updateUserData(this.userToEdit.id, {...this.userToEdit,...this.userDetailsForm.value})
    this.router.navigate(['/user-list'])
  }

  getFormFieldErrors(formControl: string){
    return this.userDetailsForm.get(formControl)?.errors
  }

  getAllUsers(){
    this.service.getData().subscribe((res)=> {
      if(res){
        this.allUsers = res;
        console.log('users in form', this.allUsers)
      }
    })
  }
   result = false;
  checkIfUserExists(){
   
    this.allUsers.forEach((user:any)=> {
       if(user.firstName == this.userDetailsForm.value.firstName && user.email == this.userDetailsForm.value.email){
          this.result = true;
       }
    })
    return this.result;
  }

  hideMessage(){
    this.showMessage = false;
  }

  getTableData(){
     this.userToEdit = this.service.userSubject
    if(this.userToEdit){
      console.log(this.userToEdit)
      this.userDetailsForm.patchValue(this.userToEdit)
    }
  }

  updateUserData(id:any, obj:any){
    this.service.updateData(id, obj).subscribe((res)=> {
      if(res){
        console.log('user updated')
      }
    })
  }

  getUserList(){
    this.router.navigate(['/user-list'])
  }

  numberOnly(event:any): boolean {
    console.log(event.target.value)
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
