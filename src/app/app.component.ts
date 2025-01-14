import { Component, OnInit } from '@angular/core';
import { AuthService } from './Authentication/shared/auth.service';
import { Subscription, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { ACrudService } from './Authentication/shared/acrud.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isMenuCollapsed = true;

  isAuthenticated = false;
  x
  ProfieData: { uname: any; desc: string; email: string; name: any; created_date: Date; imgurl: Observable<string>; isProfileSet: boolean };
  isprofileSet: boolean = false
  username: string
  private userSub: Subscription;
  allpostcount: number = 0;
  isemailverfied: boolean

  isloading: boolean = false

  //variables para saber el rol del usuario
  isStudent: boolean = false
  isTeacher: boolean = false

  constructor(private authService: AuthService, private acrud: ACrudService, private router: Router) {
    this.acrud.username.subscribe(d => {
      this.username = d

    })
  }
  title = 'write-your-heart-out';


  ngOnInit() {   

    if (this.isloading) {
      window.onscroll = function () { myFunction() };

      // Get the header
      var header = document.getElementById("myHeader");

      // Get the offset position of the navbar
      var sticky = header.offsetTop;

      // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
      function myFunction() {
        if (window.pageYOffset > sticky) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }
    }

    this.isloading = true
    this.authService.autoLogin();
    this.authService.isLoggedIn1()
    this.userSub = this.authService.user.subscribe((user: any) => {
      this.isloading = false
      // console.log(user)
      if (user) {
        this.isemailverfied = user.emailVerified
      }
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);

      console.log(this.isAuthenticated)
      if (this.isAuthenticated) {
        this.acrud.getProfileFromUid(user.uid).subscribe(
          d => {
            // console.log(d)
            let x2: {} = {}
            let x = this.acrud.seprate(d)
            this.ProfieData = x[0]
            // console.log(this.ProfieData)
            if (this.ProfieData) {
              this.isprofileSet = this.ProfieData.isProfileSet
              this.username = this.ProfieData.uname
              this.isStudent = x[0].isStudent
              this.isTeacher = x[0].isTeacher
            }
          }
        )
      }
      else {
        this.router.navigate(['/home'])
      }
    });
    this.getAllPosts()
  }

  getAllPosts() {
    this.isloading = true
    this.acrud.getAllData()
      .subscribe(data => {
        let x1 = data[0]
        let x2 = data[1]
        let x3 = []
        x3 = this.acrud.seprate(x1)
        let x4 = this.acrud.seprate(x2)



        let x5 = x3.concat(x4)
        this.allpostcount = x5.length
        this.isloading = false

      })
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  classIsSet=false
toggleClass()
  {
   this.classIsSet=!this.classIsSet;
  }



}
