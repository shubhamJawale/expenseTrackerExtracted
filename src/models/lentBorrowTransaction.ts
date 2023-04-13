export class lentBorrowTransaction {
 private name :  string
 private type :  string
 private ammount  :  number

 constructor(name : string, type : string, ammount  : number){ 
 this.name = name
 this.type = type
 this.ammount  = ammount 
}
 public getname(){
            return this.name
        } 
 public setname(name : string){
            this.name = name;
        }
 public gettype(){
            return this.type
        } 
 public settype(type : string){
            this.type = type;
        }
 public getammount (){
            return this.ammount 
        } 
 public setammount (ammount  : number){
            this.ammount  = ammount ;
        }
 }